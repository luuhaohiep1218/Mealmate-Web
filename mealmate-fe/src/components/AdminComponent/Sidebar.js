import React from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo-mealmate-removebg-preview.png"; // Import logo
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation

const { Sider } = Layout;

// Styled components
const SidebarContainer = styled(Sider)`
  &&& {
    background: #f2b705;
  }

  .ant-layout-sider-children {
    background: #f2b705;
  }

  &.ant-layout-sider-collapsed {
    .sidebar-header {
      justify-content: center;
    }
  }
`;

const SidebarHeader = styled.div`
  height: 64px;
  margin: 16px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: ${(props) => (props.collapsed ? "32px" : "48px")};
    width: auto;
    transition: all 0.3s ease;
  }
`;

const CustomMenu = styled(Menu)`
  &&& {
    background: #f2b705;
    color: #fff;
    border-right: 0;
    margin-top: 8px;
    padding: 0;
  }

  .ant-menu-item {
    background: #f2b705;
    margin: 4px 0;
    padding: 0 16px !important;
    border-radius: 0;
    height: 50px;
    line-height: 50px;
    width: 100%;

    &:hover {
      background-color: #e6a800 !important;
    }
  }

  .ant-menu-item-selected {
    background-color: #e6a800 !important;
    border-left: 3px solid #fff;
    margin-left: 0;
    margin-right: 0;

    &:hover {
      background-color: #e6a800 !important;
    }

    a {
      color: #fff !important;
      font-weight: 600;
    }
  }

  .ant-menu-item a {
    color: #fff;
    padding-left: 12px;

    &:hover {
      color: #fff;
    }
  }

  // Override ant-design padding
  &.ant-menu-inline {
    .ant-menu-item {
      margin: 0;
      width: 100%;
    }
  }
`;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "dashboard";
    if (path.includes("/admin/recipes")) return "recipes";
    return "";
  };

  return (
    <SidebarContainer width={200} theme="light" collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        <img src={logo} alt="MealMate Logo" />
      </SidebarHeader>
      <CustomMenu theme="light" mode="inline" selectedKeys={[getSelectedKey()]}>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/admin/dashboard">Trang Chủ</Link>
        </Menu.Item>
        <Menu.Item key="recipes" icon={<DashboardOutlined />}>
          <Link to="/admin/recipes">Công Thức</Link>
        </Menu.Item>
      </CustomMenu>
    </SidebarContainer>
  );
};

export default Sidebar;
