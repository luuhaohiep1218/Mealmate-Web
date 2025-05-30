import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
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

const MessageContainer = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
`;

const ErrorMessage = styled(MessageContainer)`
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
`;

const SuccessMessage = styled(MessageContainer)`
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
`;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser, setIsAuthenticated } = useMealMate();
  const [loginMessage, setLoginMessage] = useState({ type: "", content: "" });

  // Kiểm tra xem người dùng đã đăng nhập với vai trò admin chưa
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
      setLoginMessage({ type: "", content: "" }); // Reset message
      const response = await api.post(endpoints.auth.adminLogin, values);

      if (response.accessToken) {
        // Lưu token
        sessionStorage.setItem("token", response.accessToken);

        // Kiểm tra role trước khi chuyển hướng
        if (response.role === "ADMIN") {
          // Cập nhật context và lưu thông tin user
          const userInfo = {
            role: response.role,
            full_name: response.full_name,
            phone: response.phone,
            email: response.email,
          };
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          setUser(userInfo);
          setIsAuthenticated(true);

          setLoginMessage({
            type: "success",
            content: "Đăng nhập thành công! Chào mừng quản trị viên.",
          });

          // Chờ 1 giây trước khi chuyển hướng để người dùng thấy thông báo
          setTimeout(() => {
            navigate("/admin/dashboard", { replace: true });
          }, 1000);
        } else {
          setLoginMessage({
            type: "error",
            content: "Tài khoản không có quyền truy cập vào trang quản trị!",
          });
          // Xóa token nếu không phải admin
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userInfo");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";

      // Xử lý các trường hợp lỗi cụ thể
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Email hoặc mật khẩu không đúng định dạng!";
            break;
          case 401:
            errorMessage = "Email hoặc mật khẩu không chính xác!";
            break;
          case 403:
            errorMessage = "Tài khoản của bạn không có quyền truy cập!";
            break;
          case 404:
            errorMessage = "Tài khoản không tồn tại trong hệ thống!";
            break;
          case 500:
            errorMessage = "Lỗi hệ thống, vui lòng thử lại sau!";
            break;
          default:
            errorMessage =
              error.response.data?.message ||
              "Đăng nhập thất bại. Vui lòng thử lại!";
        }
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối!";
      }

      setLoginMessage({
        type: "error",
        content: errorMessage,
      });
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate("/")} icon={<ArrowLeftOutlined />}>
        Quay lại Trang chủ
      </BackButton>
      <StyledCard>
        <Logo src={logo} alt="MealMate Logo" />
        <Title>Đăng nhập Admin</Title>

        {/* Hiển thị thông báo */}
        {loginMessage.content &&
          (loginMessage.type === "error" ? (
            <ErrorMessage>{loginMessage.content}</ErrorMessage>
          ) : (
            <SuccessMessage>{loginMessage.content}</SuccessMessage>
          ))}

        <StyledForm name="admin_login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Vui lòng nhập email hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email của bạn"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu của bạn"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Đăng nhập
            </StyledButton>
          </Form.Item>
        </StyledForm>

        <LoginText>
          Không phải là admin?
          <Link to="/">Đăng nhập người dùng</Link>
        </LoginText>
      </StyledCard>
    </PageContainer>
  );
};

export default AdminLoginPage;
