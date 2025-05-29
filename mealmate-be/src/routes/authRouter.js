const express = require("express");
const asyncHandler = require("express-async-handler");

const { protect, adminMiddleware } = require("../middlewares/Auth");
const {
  register,
  userLogin,
  adminLogin,
  refreshAccessToken,
  logout,
  googleAuth,
  forgotPassword,
} = require("../controllers/AuthController");
const passport = require("passport");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/user/login", userLogin);
router.post("/admin/login", adminLogin);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleAuth
);

module.exports = router;
