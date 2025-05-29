const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const Account = require("../models/AccountModel");
const User = require("../models/UserModel");

const { generateToken, generateRefreshToken } = require("../middlewares/Auth");

const register = asyncHandler(async (req, res) => {
  const { full_name, email, password, phone } = req.body;

  // Validate inputs
  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email");
  }
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error(
      "Password must be at least 6 characters and contain at least one letter and one number"
    );
  }
  if (!full_name) {
    res.status(400);
    throw new Error("Full name is required");
  }

  // Check if account already exists
  const accountExists = await Account.findOne({ email });
  if (accountExists) {
    res.status(400);
    throw new Error("Account already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new account
  const account = await Account.create({
    email,
    password_hash: hashedPassword,
    role: "USER",
    isActive: true,
    authProvider: "local",
  });

  // Create corresponding user
  const user = await User.create({
    account: account._id,
    full_name,
    phone,
  });

  if (account && user) {
    const accessToken = generateToken(account._id);
    const refreshToken = generateRefreshToken(account._id);

    // Save refresh token to account
    account.refreshToken = refreshToken;
    await account.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      _id: account._id,
      full_name: user.full_name,
      email: account.email,
      phone: user.phone,
      role: account.role,
      accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid account or user data");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // Find account
  const account = await Account.findOne({ email });
  if (!account || !account.isActive) {
    res.status(401);
    throw new Error("Invalid credentials or account is inactive");
  }

  // Check if account is USER role
  if (account.role !== "USER") {
    res.status(403);
    throw new Error("Access denied. This endpoint is for users only.");
  }

  // Compare password
  if (await bcrypt.compare(password, account.password_hash)) {
    const accessToken = generateToken(account._id);
    const refreshToken = generateRefreshToken(account._id);

    // Save refresh token
    account.refreshToken = refreshToken;
    await account.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    // Get corresponding user data
    const user = await User.findOne({ account: account._id });

    res.json({
      accessToken,
      role: account.role,
      full_name: user ? user.full_name : "",
      phone: user ? user.phone : "",
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // Find account
  const account = await Account.findOne({ email });
  if (!account || !account.isActive) {
    res.status(401);
    throw new Error("Invalid credentials or account is inactive");
  }

  // Check if account is ADMIN role
  if (account.role !== "ADMIN") {
    res.status(403);
    throw new Error("Access denied. This endpoint is for administrators only.");
  }

  // Compare password
  if (await bcrypt.compare(password, account.password_hash)) {
    const accessToken = generateToken(account._id);
    const refreshToken = generateRefreshToken(account._id);

    // Save refresh token
    account.refreshToken = refreshToken;
    await account.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    // Get corresponding user data
    const user = await User.findOne({ account: account._id });

    res.json({
      accessToken,
      role: account.role,
      full_name: user ? user.full_name : "",
      phone: user ? user.phone : "",
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  // Find account with refresh token
  const account = await Account.findOne({ refreshToken });
  if (!account) {
    res.status(403);
    throw new Error("Invalid refresh token");
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err || account._id.toString() !== decoded.id) {
      res.status(403);
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateToken(account._id);
    res.json({ accessToken: newAccessToken });
  });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(200).json({ message: "Already logged out" });
  }

  // Find account with refresh token
  const account = await Account.findOne({ refreshToken });
  if (account) {
    account.refreshToken = null;
    await account.save();
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({ message: "Logout successful" });
});

const googleAuth = asyncHandler(async (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!req.user || !req.user.email) {
    console.error("No user data received from Google");
    return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }

  const { email, full_name, picture } = req.user;

  try {
    let account = await Account.findOne({ email });
    let user;

    if (!account) {
      // Tạo tài khoản mới
      account = new Account({
        email,
        authProvider: "google",
        role: "USER",
        isActive: true,
      });
      await account.save();
    } else if (account.authProvider !== "google") {
      // Nếu tài khoản dùng nhà cung cấp khác trước đó → cập nhật lại
      account.authProvider = "google";
      await account.save();
    }

    // Kiểm tra user gắn với account đó
    user = await User.findOne({ account: account._id });

    if (!user) {
      user = new User({
        account: account._id,
        full_name,
        profile_picture: picture,
      });
      await user.save();
    } else {
      // Nếu user đã có, cập nhật ảnh nếu có
      user.profile_picture = picture;
      await user.save();
    }

    // Tạo token
    const accessToken = generateToken(account._id);
    const refreshToken = generateRefreshToken(account._id);

    // Lưu refreshToken vào DB
    account.refreshToken = refreshToken;
    await account.save();

    // Gửi cookie refreshToken
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    // Redirect kèm accessToken
    return res.redirect(`${FRONTEND_URL}/login-success?token=${accessToken}`);
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
});

const sendEmail = ({ recipient_email, newPassword }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MAIL_USER,
      to: recipient_email,
      subject: "Password Recovery - KODING 101",
      html: `<!DOCTYPE html>
      <html>
      <head>
          <title>Password Recovery</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #FAFAFA; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
              <h2 style="color: #0070f3; text-align: center;">Password Reset Request</h2>
              <p>Hello,</p>
              <p>You have requested to reset your password. Your new password is:</p>
              <h3 style="text-align: center; background: #f3f3f3; padding: 10px; border-radius: 5px;">${newPassword}</h3>
              <p>Please change your password after logging in for security reasons.</p>
              <p>If you did not request this change, please ignore this email or contact support.</p>
              <p style="text-align: center;"><a href="http://localhost:3000" style="color: #0070f3;">Go to Login</a></p>
              <hr />
              <p style="font-size: 12px; color: #555;">This is an automated email, please do not reply.</p>
          </div>
      </body>
      </html>`,
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return reject({ message: "An error occurred while sending email." });
      }
      return resolve({ message: "Email sent successfully." });
    });
  });
};

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Valid email is required");
  }

  // Find account
  const account = await Account.findOne({ email });
  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  // Generate new password
  const newPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update account with new password
  account.password_hash = hashedPassword;
  const updatedAccount = await account.save();

  if (!updatedAccount) {
    res.status(500);
    throw new Error("Failed to update password");
  }

  // Send email with new password
  await sendEmail({ recipient_email: email, newPassword });

  res.json({ message: "New password has been sent to your email." });
});

module.exports = {
  register,
  userLogin,
  adminLogin,
  refreshAccessToken,
  logout,
  googleAuth,
  forgotPassword,
};
