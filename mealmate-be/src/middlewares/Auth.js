const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Account = require("../models/AccountModel"); // 🔄 Sử dụng Account thay vì User

// Tạo access token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Tạo refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// Middleware bảo vệ route
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Set decoded token info to req.user
      req.user = {
        userId: decoded.userId,
        accountId: decoded.accountId,
        role: decoded.role,
      };

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware kiểm tra quyền admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

// Middleware kiểm tra role linh hoạt
const roleMiddleware = (allowedRoles) => (req, res, next) => {
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Unauthorized role" });
  }
};

module.exports = {
  generateToken,
  protect,
  adminMiddleware,
  generateRefreshToken,
  roleMiddleware,
};
