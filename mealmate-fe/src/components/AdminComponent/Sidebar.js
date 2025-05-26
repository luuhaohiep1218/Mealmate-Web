import React from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo-mealmate-removebg-preview.png"; // Import logo
import styled from "styled-components";
import { Link } from "react-router-dom"; // Import Link

const { Sider } = Layout;

// Styled components
const SidebarContainer = styled(Sider)`
  background-color: #f2b705;
  color: #fff;

  &.ant-layout-sider-collapsed {
    .sidebar-header {
      justify-content: center;
    }
  }
`;

const SidebarHeader = styled.div`
  height: 64px;
  margin: 16px;
  display: flex;
  align-items: center;
  color: #fff;

  img {
    height: 48px;
    width: auto;
    margin-right: 8px;
  }

  ${({ collapsed }) =>
    !collapsed &&
    `
      justify-content: center;
    `}
`;

const CustomMenu = styled(Menu)`
  background-color: #f2b705;
  color: #fff;
  border-right: 0;

  .ant-menu-item-selected {
    background-color: #ffd700 !important;
    color: #fff !important;

    &:hover {
      background-color: #ffc107 !important;
    }
  }

  .ant-menu-item:hover {
    background-color: #e0a800 !important;
    color: #fff !important;
  }

  .ant-menu-submenu-selected {
    background-color: #ffd700 !important;
    color: #fff !important;
  }

  // Đảm bảo item active được highlight đúng
  .ant-menu-item:active,
  .ant-menu-item-selected:active {
    background-color: #ffd700 !important;
  }

  // Tùy chỉnh Link trong Menu.Item
  .ant-menu-item a {
    color: #fff;
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }

  .ant-menu-item-selected a {
    color: #fff !important;
  }

  // Ẩn text và chỉ hiển thị icon khi collapsed là false
  ${({ collapsed }) =>
    !collapsed &&
    `
      .ant-menu-item a {
        display: flex;
        align-items: center;
      }

      // Ẩn text bên trong Link nhưng giữ icon
      .ant-menu-item a > span:last-child {
        display: none;
      }

      // Đảm bảo icon vẫn hiển thị
      .ant-menu-item a > span:first-child {
        margin-right: 0;
      }
    `}
`;

const Sidebar = ({ collapsed }) => {
  return (
    <SidebarContainer width={200} theme="light" collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        {!collapsed && <img src={logo} alt="MealMate Logo" />}
      </SidebarHeader>
      <CustomMenu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        selectedKeys={
          window.location.pathname === "/"
            ? ["1"]
            : [window.location.pathname.split("/")[1] || "1"]
        }
        inlineIndent={12}
        collapsed={!collapsed}
      >
        <Menu.Item key="1">
          <Link to="/admin/dashboard">
            <DashboardOutlined /> <span>Dashboard</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/admin/recipes">
            <DashboardOutlined /> <span>Recipes</span>
          </Link>
        </Menu.Item>
      </CustomMenu>
    </SidebarContainer>
  );
};

export default Sidebar;
