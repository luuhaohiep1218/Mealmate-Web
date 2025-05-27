import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMealMate } from "../../context/MealMateContext";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoginSuccessGooglePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleCallback } = useMealMate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processGoogleLogin = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
          setError("No authentication token received");
          message.error("No authentication token received");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        await handleGoogleCallback(token);
        message.success("Welcome back!");
        navigate("/");
      } catch (error) {
        console.error("Google login processing error:", error);
        setError(error.message || "Failed to complete login");
        message.error(
          error.message || "Failed to complete login. Please try again."
        );
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    processGoogleLogin();
  }, [location, navigate, handleGoogleCallback]);

  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Spin indicator={antIcon} spinning={isLoading} />
      <div style={{ marginTop: 20, fontSize: 16 }}>
        {error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : isLoading ? (
          "Completing your login..."
        ) : (
          "Redirecting..."
        )}
      </div>
    </div>
  );
};

export default LoginSuccessGooglePage;
