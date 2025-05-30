import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import SideNavAccount from "../../components/SideNav/SideNavAccount";
import { api, endpoints } from "../../utils/axiosInstance";
import { useMealMate } from "../../context/MealMateContext";

const ChangePasswordPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useMealMate();

  useEffect(() => {
    // Chuyển hướng nếu người dùng đăng nhập bằng Google
    if (user?.authProvider === "google") {
      message.error("Tính năng này không khả dụng cho tài khoản Google");
      navigate("/account");
    }
  }, [user, navigate]);

  // Nếu đang kiểm tra user hoặc là tài khoản Google, không hiển thị gì cả
  if (!user || user.authProvider === "google") {
    return null;
  }

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Kiểm tra mật khẩu mới và xác nhận mật khẩu
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
        return;
      }

      const response = await api.post(endpoints.user.changePassword, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      if (response) {
        message.success("Thay đổi mật khẩu thành công");
        form.resetFields();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Mật khẩu cũ không chính xác");
      } else {
        message.error(
          "Không thể thay đổi mật khẩu: " +
            (error.response?.data?.message || "Đã có lỗi xảy ra")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SideNavAccount />
      <MainContent>
        <ContentHeader>
          <h1>Thay đổi mật khẩu</h1>
          <p>Cập nhật mật khẩu của bạn để bảo vệ tài khoản</p>
        </ContentHeader>

        <FormSection>
          <Form
            form={form}
            name="change-password"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="oldPassword"
              label="Mật khẩu hiện tại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu hiện tại",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu mới",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới"
              />
            </Form.Item>

            <Form.Item>
              <SubmitButton type="primary" htmlType="submit" loading={loading}>
                Cập nhật mật khẩu
              </SubmitButton>
            </Form.Item>
          </Form>
        </FormSection>
      </MainContent>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #faf7f5;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 800px;
`;

const ContentHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  .ant-form-item {
    margin-bottom: 1.5rem;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 40px;
  background: #ff4b4b;
  border: none;
  border-radius: 20px;
  font-size: 1rem;

  &:hover {
    background: #ff3333;
  }
`;

export default ChangePasswordPage;
