import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card } from "antd";
import {
  LockOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { api, endpoints } from "../../utils/axiosInstance";
import logo from "../../assets/logo/logo-removebg-preview.png";
import { useMealMate } from "../../context/MealMateContext";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
  position: relative;
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: none;
  font-size: 16px;
  color: #1a1a1a;

  &:hover {
    color: #333;
    background: none;
  }

  .anticon {
    font-size: 18px;
  }
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
  display: block;
  margin: 0 auto 0px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .ant-card-body {
    padding: 24px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
  color: #1a1a1a;
  font-weight: 600;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input-affix-wrapper {
    border-radius: 8px;
    padding: 8px 11px;

    &:hover,
    &:focus {
      border-color: #1a1a1a;
    }
  }

  .ant-input-affix-wrapper-focused {
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.2);
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 45px;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
  background-color: #1a1a1a;
  color: white;
  border: none;

  &:hover {
    background-color: #333;
  }

  &:focus {
    background-color: #1a1a1a;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.2);
  }
`;

const LoginText = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;

  a {
    color: #1a1a1a;
    text-decoration: none;
    margin-left: 5px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser, setIsAuthenticated } = useMealMate();

  // Check if user is already logged in as admin
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");

    if (token && userInfo.role === "ADMIN") {
      setUser(userInfo);
      setIsAuthenticated(true);
      navigate("/admin/dashboard");
    }
  }, [navigate, setUser, setIsAuthenticated]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await api.post(endpoints.auth.adminLogin, values);

      if (response.accessToken) {
        // Lưu token
        sessionStorage.setItem("token", response.accessToken);

        // Kiểm tra role trước khi chuyển hướng
        if (response.role === "ADMIN") {
          // Cập nhật context
          const userInfo = {
            role: response.role,
            full_name: response.full_name,
            phone: response.phone,
          };
          setUser(userInfo);
          setIsAuthenticated(true);

          message.success("Đăng nhập thành công!");
          navigate("/admin/dashboard", { replace: true });
        } else {
          message.error("Tài khoản không có quyền truy cập!");
          // Xóa token nếu không phải admin
          sessionStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      message.error(errorMessage);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate("/")} icon={<ArrowLeftOutlined />}>
        Back to Home
      </BackButton>
      <StyledCard>
        <Logo src={logo} alt="MealMate Logo" />
        <Title>Admin Login</Title>
        <StyledForm name="admin_login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Sign In
            </StyledButton>
          </Form.Item>
        </StyledForm>

        <LoginText>
          Not an admin?
          <Link to="/">User Login</Link>
        </LoginText>
      </StyledCard>
    </PageContainer>
  );
};

export default AdminLoginPage;
