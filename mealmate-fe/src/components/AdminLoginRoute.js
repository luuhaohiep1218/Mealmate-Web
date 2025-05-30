import React from "react";
import { Navigate } from "react-router-dom";
import { useMealMate } from "../context/MealMateContext";
import { message } from "antd";

const AdminLoginRoute = ({ children }) => {
  const { isAuthenticated, user } = useMealMate();

  if (isAuthenticated && user) {
    message.info("Bạn đã đăng nhập, không thể truy cập trang đăng nhập.");
    // Nếu là admin, chuyển hướng đến trang quản trị, ngược lại về trang chủ
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin/dashboard" : "/"} replace />
    );
  }

  return children;
};

export default AdminLoginRoute;
