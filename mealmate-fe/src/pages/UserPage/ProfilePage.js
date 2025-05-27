import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMealMate } from "../../context/MealMateContext";
import SideNavAccount from "../../components/SideNav/SideNavAccount";
import { Form, Input, Button, Upload, message } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";

const ProfilePage = () => {
  const { user, updateUserProfile } = useMealMate();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.profile_picture || null);

  if (!user) {
    return navigate("/");
  }

  const handleSubmit = async (values) => {
    try {
      await updateUserProfile({
        ...values,
        profile_picture: imageUrl,
      });
      message.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.url);
      message.success("Profile picture uploaded successfully");
    } else if (info.file.status === "error") {
      message.error("Failed to upload profile picture");
    }
  };

  return (
    <PageContainer>
      <SideNavAccount />
      <MainContent>
        <ContentHeader>
          <h1>Profile Settings</h1>
          <p>Manage your personal information and preferences</p>
        </ContentHeader>

        <ProfileSection>
          <ProfileImageSection>
            <ProfileImageWrapper>
              {imageUrl ? (
                <ProfileImage src={imageUrl} alt="Profile" />
              ) : (
                <UserOutlined style={{ fontSize: "40px", color: "#999" }} />
              )}
              {isEditing && (
                <Upload
                  name="avatar"
                  showUploadList={false}
                  action="/api/upload"
                  onChange={handleImageUpload}
                >
                  <UploadButton>
                    <CameraOutlined />
                  </UploadButton>
                </Upload>
              )}
            </ProfileImageWrapper>
          </ProfileImageSection>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              full_name: user.full_name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              height: user.height,
              weight: user.weight,
              age: user.age,
              gender: user.gender,
            }}
            onFinish={handleSubmit}
          >
            <FormGrid>
              <FormSection>
                <SectionTitle>Personal Information</SectionTitle>
                <Form.Item
                  name="full_name"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="phone" label="Phone Number">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input.TextArea disabled={!isEditing} rows={3} />
                </Form.Item>
              </FormSection>

              <FormSection>
                <SectionTitle>Health Information</SectionTitle>
                <Form.Item name="height" label="Height (cm)">
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="weight" label="Weight (kg)">
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="age" label="Age">
                  <Input type="number" disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="gender" label="Gender">
                  <Input disabled={!isEditing} />
                </Form.Item>
              </FormSection>
            </FormGrid>

            <ButtonGroup>
              {!isEditing ? (
                <EditButton onClick={() => setIsEditing(true)}>
                  Edit Profile
                </EditButton>
              ) : (
                <>
                  <SaveButton htmlType="submit">Save Changes</SaveButton>
                  <CancelButton onClick={() => setIsEditing(false)}>
                    Cancel
                  </CancelButton>
                </>
              )}
            </ButtonGroup>
          </Form>
        </ProfileSection>
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
  max-width: 1000px;
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

const ProfileSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ProfileImageSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadButton = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  .ant-form-item {
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  height: 40px;
  padding: 0 2rem;
  font-size: 1rem;
  border-radius: 20px;
`;

const EditButton = styled(StyledButton)`
  background: #ff4b4b;
  color: white;
  border: none;

  &:hover {
    background: #ff3333;
    color: white;
  }
`;

const SaveButton = styled(StyledButton)`
  background: #ff4b4b;
  color: white;
  border: none;

  &:hover {
    background: #ff3333;
    color: white;
  }
`;

const CancelButton = styled(StyledButton)`
  border: 2px solid #ff4b4b;
  color: #ff4b4b;
  background: white;

  &:hover {
    color: #ff3333;
    border-color: #ff3333;
  }
`;

export default ProfilePage;
