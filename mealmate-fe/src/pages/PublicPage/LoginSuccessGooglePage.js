import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMealMate } from "../../context/MealMateContext";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { api, endpoints } from "../../utils/axiosInstance";

const LoginSuccessGooglePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsAuthenticated } = useMealMate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processGoogleLogin = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const userInfoStr = params.get("userInfo");

        if (!token || !userInfoStr) {
          throw new Error("Không nhận được thông tin xác thực");
        }

        // Lưu token vào sessionStorage
        sessionStorage.setItem("token", token);

        try {
          // Gọi API để lấy thông tin user profile đầy đủ
          const userProfile = await api.get(endpoints.user.profile);

          if (!userProfile) {
            throw new Error("Không thể lấy thông tin người dùng");
          }

          // Tạo object userInfo với đầy đủ thông tin
          const userInfo = {
            _id: userProfile._id,
            full_name: userProfile.full_name,
            email: userProfile.email,
            phone: userProfile.phone,
            role: userProfile.role,
            profile_picture: userProfile.profile_picture,
            authProvider: userProfile.authProvider,
            gender: userProfile.gender,
            height: userProfile.height,
            weight: userProfile.weight,
            date_of_birth: userProfile.date_of_birth,
            job: userProfile.job,
          };

          // Lưu thông tin user vào sessionStorage
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

          // Cập nhật context
          setUser(userInfo);
          setIsAuthenticated(true);

          message.success("Đăng nhập thành công!");
          navigate("/account");
        } catch (e) {
          console.error("Lỗi khi lấy thông tin người dùng:", e);
          throw new Error("Không thể lấy thông tin người dùng");
        }
      } catch (error) {
        console.error("Lỗi xử lý đăng nhập Google:", error);
        setError(error.message || "Đăng nhập thất bại");
        message.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");

        // Xóa thông tin nếu có lỗi
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userInfo");
        setUser(null);
        setIsAuthenticated(false);

        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    processGoogleLogin();
  }, [location, navigate, setUser, setIsAuthenticated]);

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
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Spin indicator={antIcon} spinning={isLoading} />
      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          maxWidth: "400px",
          wordWrap: "break-word",
        }}
      >
        {error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : isLoading ? (
          "Đang xử lý đăng nhập..."
        ) : (
          "Đăng nhập thành công, đang chuyển hướng..."
        )}
      </div>
    </div>
  );
};

export default LoginSuccessGooglePage;
