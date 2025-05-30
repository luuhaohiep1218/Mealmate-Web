import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMealMate } from "../../context/MealMateContext";
import SideNavAccount from "../../components/SideNav/SideNavAccount";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import { api, endpoints } from "../../utils/axiosInstance";

const { Option } = Select;

const ProfilePage = () => {
  const { user, setUser } = useMealMate();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.profile_picture || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xác thực khi component mount
    const token = sessionStorage.getItem("token");
    if (!token) {
      message.error("Vui lòng đăng nhập để tiếp tục");
      navigate("/login");
      return;
    }

    // Cập nhật form với dữ liệu user hiện tại
    if (user) {
      form.setFieldsValue({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
      });
      setImageUrl(user.profile_picture);
    }
  }, [user, form, navigate]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("Đang gửi dữ liệu:", values); // Debug log

      const token = sessionStorage.getItem("token");
      if (!token) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }

      const updatedData = {
        full_name: values.full_name?.trim(),
        phone: values.phone?.trim(),
        gender: values.gender,
        height: values.height ? Number(values.height) : undefined,
        weight: values.weight ? Number(values.weight) : undefined,
        profile_picture: imageUrl,
      };

      console.log("Đang gửi dữ liệu cập nhật:", updatedData); // Debug log

      const response = await api.patch(
        endpoints.user.updateProfile,
        updatedData
      );
      console.log("Phản hồi cập nhật:", response); // Debug log

      if (response) {
        const updatedUser = {
          ...user,
          ...response,
        };
        setUser(updatedUser);
        sessionStorage.setItem("userInfo", JSON.stringify(updatedUser));

        message.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        throw new Error("Không nhận được phản hồi từ server");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error); // Debug log
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
      } else {
        message.error(
          "Không thể cập nhật thông tin: " +
            (error.response?.data?.message ||
              error.message ||
              "Đã có lỗi xảy ra")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const imageUrl = info.file.response.imageUrl;
      console.log("URL ảnh đã tải lên:", imageUrl); // Debug log
      setImageUrl(imageUrl);
      message.success("Tải ảnh lên thành công");
    } else if (info.file.status === "error") {
      console.error("Lỗi tải ảnh:", info.file.error); // Debug log
      if (info.file.error.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
      } else {
        message.error("Không thể tải ảnh lên");
      }
    }
  };

  return (
    <PageContainer>
      <SideNavAccount />
      <MainContent>
        <ContentHeader>
          <h1>Thông tin cá nhân</h1>
          <p>Quản lý thông tin và tùy chọn cá nhân của bạn</p>
        </ContentHeader>

        <ProfileSection>
          <ProfileImageSection>
            <ProfileImageWrapper>
              {imageUrl ? (
                <ProfileImage src={imageUrl} alt="Ảnh đại diện" />
              ) : (
                <UserOutlined style={{ fontSize: "40px", color: "#999" }} />
              )}
              {isEditing && (
                <Upload
                  name="file"
                  showUploadList={false}
                  action={`${process.env.REACT_APP_API_URL}/upload`}
                  onChange={handleImageUpload}
                  headers={{
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                  }}
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
              gender: user.gender,
              height: user.height,
              weight: user.weight,
            }}
            onFinish={handleSubmit}
          >
            <FormGrid>
              <FormSection>
                <SectionTitle>Thông tin cơ bản</SectionTitle>
                <Form.Item
                  name="full_name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input disabled={true} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    {
                      pattern: /^\d{10}$/,
                      message: "Số điện thoại phải có 10 chữ số",
                    },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="gender" label="Giới tính">
                  <Select disabled={!isEditing}>
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </FormSection>

              <FormSection>
                <SectionTitle>Thông tin sức khỏe</SectionTitle>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Các thông tin này không bắt buộc nhưng sẽ giúp chúng tôi gợi ý
                  các công thức phù hợp hơn với bạn
                </p>
                <Form.Item
                  name="height"
                  label="Chiều cao (cm)"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Chiều cao không hợp lệ",
                    },
                    { transform: (value) => (value ? Number(value) : null) },
                  ]}
                  tooltip="Nhập chiều cao của bạn để nhận gợi ý về khẩu phần ăn phù hợp"
                >
                  <Input
                    type="number"
                    disabled={!isEditing}
                    placeholder="Ví dụ: 170"
                  />
                </Form.Item>
                <Form.Item
                  name="weight"
                  label="Cân nặng (kg)"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      message: "Cân nặng không hợp lệ",
                    },
                    { transform: (value) => (value ? Number(value) : null) },
                  ]}
                  tooltip="Nhập cân nặng của bạn để nhận gợi ý về lượng calories phù hợp"
                >
                  <Input
                    type="number"
                    disabled={!isEditing}
                    placeholder="Ví dụ: 60"
                  />
                </Form.Item>
              </FormSection>
            </FormGrid>

            <ButtonGroup>
              {!isEditing ? (
                <EditButton onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </EditButton>
              ) : (
                <>
                  <SaveButton htmlType="submit" loading={loading}>
                    Lưu thay đổi
                  </SaveButton>
                  <CancelButton onClick={() => setIsEditing(false)}>
                    Hủy
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
