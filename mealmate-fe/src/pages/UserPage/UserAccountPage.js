import React, { useState } from "react";
import { Card, Form, Input, Button, Avatar, Typography, Table } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Title } = Typography;

// Dữ liệu mẫu cho lịch sử đặt món ăn
const orderHistory = [
  {
    key: "1",
    orderId: "ORD001",
    date: "2025-05-20",
    item: "Spaghetti Carbonara",
    price: 15.99,
    status: "Delivered",
  },
  {
    key: "2",
    orderId: "ORD002",
    date: "2025-05-22",
    item: "Phở Bò",
    price: 12.5,
    status: "Delivered",
  },
];

// Styled components
const AccountContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f0f2f5;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  background-color: #fff;

  .ant-card-body {
    padding: 24px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileAvatar = styled(Avatar)`
  background-color: #f2b705;
  margin-right: 16px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 8px;
  color: #333;

  &.main-title {
    color: #f2b705;
    margin-bottom: 24px;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 500;
    color: #555;
  }

  .ant-input {
    border-radius: 4px;
    padding: 8px;
  }

  .ant-input:disabled {
    background-color: #f5f5f5;
    color: #888;
  }
`;

const EditButton = styled(Button)`
  border-radius: 4px;
  background-color: #f2b705;
  border-color: #f2b705;
  color: #fff;
  padding: 8px 16px;
  height: auto;

  &:hover,
  &:focus {
    background-color: #e0a800;
    border-color: #e0a800;
    color: #fff;
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #f2b705;
    color: #fff;
    font-weight: 600;
  }

  .ant-table-tbody > tr > td {
    color: #555;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #fffbe6;
  }
`;

const UserAccountPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Dữ liệu mẫu cho thông tin người dùng
  const currentUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+84 123 456 789",
  };

  // Xử lý khi nhấn nút Edit/Save
  const handleEditSave = () => {
    setIsEditing(!isEditing);
    // Thêm logic lưu thông tin nếu cần (gọi API, v.v.)
  };

  // Cột cho bảng lịch sử đặt món
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <AccountContainer>
      <StyledTitle level={2} className="main-title">
        My Account
      </StyledTitle>
      <StyledCard>
        <ProfileHeader>
          <ProfileAvatar size={64} icon={<UserOutlined />} />
          <div>
            <StyledTitle level={4}>User Profile</StyledTitle>
            <p>Manage your personal information</p>
          </div>
        </ProfileHeader>
        <StyledForm layout="vertical">
          <Form.Item label="Name">
            <Input value={currentUser.name} disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={currentUser.email} disabled />
          </Form.Item>
          <Form.Item label="Phone">
            <Input value={currentUser.phone} disabled={!isEditing} />
          </Form.Item>
          <EditButton onClick={handleEditSave}>
            {isEditing ? "Save" : "Edit Profile"}
          </EditButton>
        </StyledForm>
      </StyledCard>

      {/* Bảng lịch sử đặt món ăn */}
      <StyledCard>
        <StyledTitle level={4}>Order History</StyledTitle>
        <StyledTable columns={columns} dataSource={orderHistory} />
      </StyledCard>
    </AccountContainer>
  );
};

export default UserAccountPage;
