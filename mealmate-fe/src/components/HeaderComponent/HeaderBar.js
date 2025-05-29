import React from "react";
import { Layout, Input, Avatar, Button, Dropdown } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMealMate } from "../../context/MealMateContext";

const { Header } = Layout;

const StyledDropdownItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  .icon {
    font-size: 16px;
    color: #666;
  }
`;

const HeaderBar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useMealMate();

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("token");

    // Clear context
    setUser(null);
    setIsAuthenticated(false);

    // Navigate to login page
    navigate("/admin/login");
  };

  const items = [
    {
      key: "logout",
      label: (
        <StyledDropdownItem onClick={handleLogout}>
          <LogoutOutlined className="icon" />
          <span>Logout</span>
        </StyledDropdownItem>
      ),
    },
  ];

  return (
    <Header
      style={{
        padding: "0 16px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Section: Menu and Search */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
      </div>

      {/* Right Section: Icons */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* <Badge count={3} style={{ marginRight: 32 }}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: "16px", marginRight: 16 }}
          />
        </Badge> */}
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow
          trigger={["click"]}
        >
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: "#87d068", cursor: "pointer" }}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
