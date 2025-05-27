import React from "react";
import { Navigate } from "react-router-dom";
import { useMealMate } from "../context/MealMateContext";
import { Spin, message } from "antd";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user, setShowLoginModal } = useMealMate();

  // Show loading spinner while checking authentication
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

  // If not authenticated, redirect to home and show login modal
  if (!isAuthenticated) {
    message.warning("Please login to access this page");
    setShowLoginModal(true);
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    message.error("You do not have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
