const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Account = require("../models/AccountModel"); // 🔄 Sử dụng Account thay vì User

// Tạo access token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Tạo refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Middleware bảo vệ route
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const account = await Account.findById(decoded.id).select("-password");

    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    req.user = account; // Lưu thông tin tài khoản vào req.user
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token đã hết hạn, vui lòng đăng nhập lại" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    console.error("🔥 Lỗi bảo vệ route:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
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
