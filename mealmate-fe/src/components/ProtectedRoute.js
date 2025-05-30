import React from "react";
import { Navigate } from "react-router-dom";
import { useMealMate } from "../context/MealMateContext";
import { Spin, message } from "antd";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user, setShowLoginModal } = useMealMate();

  // Hiển thị loading spinner khi đang kiểm tra xác thực
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang chủ và hiển thị modal đăng nhập
  if (!isAuthenticated) {
    message.warning("Vui lòng đăng nhập để truy cập trang này");
    setShowLoginModal(true);
    return <Navigate to="/" replace />;
  }

  // Kiểm tra quyền truy cập dựa trên vai trò
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    message.error("Bạn không có quyền truy cập trang này");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
