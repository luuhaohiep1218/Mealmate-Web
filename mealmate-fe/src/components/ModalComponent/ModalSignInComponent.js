import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Form, Input, Button, Divider, message } from "antd";
import { useMealMate } from "../../context/MealMateContext";
import { authService } from "../../services/authService";

const ModalSignInComponent = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login, handleGoogleLogin } = useMealMate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await login(values.email, values.password);
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      // Error messages are handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        return message.error("Please enter your email first");
      }

      setLoading(true);
      await authService.forgotPassword(email);
      message.success(
        "Password reset instructions have been sent to your email"
      );
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
      title={
        <ModalHeader>
          <Title>Sign In</Title>
          <SubTitle>Welcome back to Cooks Delight!</SubTitle>
        </ModalHeader>
      }
    >
      <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter your password" size="large" />
        </Form.Item>

        <ForgotPassword onClick={handleForgotPassword}>
          Forgot password?
        </ForgotPassword>

        <Form.Item>
          <SignInButton
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Sign In
          </SignInButton>
        </Form.Item>

        <StyledDivider>or</StyledDivider>

        <Form.Item>
          <GoogleButton
            block
            size="large"
            onClick={handleGoogleLogin}
            loading={loading}
          >
            <GoogleIcon>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </GoogleIcon>
            Continue with Google
          </GoogleButton>
        </Form.Item>

        <SignUpText>
          Don't have an account? <SignUpLink>Sign up</SignUpLink>
        </SignUpText>
      </StyledForm>
    </Modal>
  );
};

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const SubTitle = styled.p`
  color: #666;
  font-size: 1rem;
  text-align: center;
  margin: 0;
`;

const StyledForm = styled(Form)`
  padding: 1rem 0;
`;

const ForgotPassword = styled.a`
  display: block;
  text-align: right;
  color: #ff4b4b;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const SignInButton = styled(Button)`
  background: #ff4b4b;
  border-color: #ff4b4b;
  height: 45px;
  font-weight: 500;

  &:hover,
  &:focus {
    background: #ff3333 !important;
    border-color: #ff3333 !important;
  }
`;

const StyledDivider = styled(Divider)`
  font-size: 0.9rem;
  color: #666;
  margin: 1.5rem 0;
`;

const GoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  font-weight: 500;
  gap: 0.8rem;

  &:hover {
    color: #333;
    border-color: #d9d9d9;
  }
`;

const GoogleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SignUpText = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
  margin-bottom: 0;
`;

const SignUpLink = styled.a`
  color: #ff4b4b;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default ModalSignInComponent;
