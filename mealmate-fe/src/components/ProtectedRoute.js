import React from "react";

const ProtectedRoute = ({ children }) => {
  // Logic kiểm tra quyền truy cập (ví dụ: kiểm tra token)
  const isAuthenticated = true; // Thay bằng logic thực tế

  return isAuthenticated ? children : <h1>Please log in</h1>;
};

export default ProtectedRoute;
