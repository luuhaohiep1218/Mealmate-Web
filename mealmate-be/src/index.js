const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const path = require("path");

const db = require("./config/db");
const { errorHandle } = require("./middlewares/errorMiddleware");

const routes = require("./routes/index");

const User = require("./models/UserModel");

dotenv.config({
  path: __dirname + "/.env",
});

db.connect();

const app = express();

// app.use(morgan("combined"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get profile picture from Google profile
        const profilePicture =
          profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        return done(null, {
          email: profile.emails[0].value,
          full_name: profile.displayName,
          picture: profilePicture,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// API routes
app.use("/api", routes);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling
app.use(errorHandle);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
