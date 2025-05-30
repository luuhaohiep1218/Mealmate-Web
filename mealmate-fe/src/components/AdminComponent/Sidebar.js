import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
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

    .ant-menu-item {
      padding-left: 28px !important;

      .anticon {
        font-size: 20px;
      }
    }
  }
`;

const StyledHeader = styled.div`
  height: 64px;
  margin: 16px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  height: ${({ $collapsed }) => ($collapsed ? "32px" : "48px")};
  width: auto;
  transition: all 0.3s ease;
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

    .anticon {
      font-size: 18px;
      margin-right: 10px;
    }

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
    if (path.includes("/admin/menus")) return "menus";
    return "";
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Trang Chủ</Link>,
    },
    {
      key: "recipes",
      icon: <BookOutlined />,
      label: <Link to="/admin/recipes">Công Thức</Link>,
    },
    {
      key: "menus",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/menus">Thực Đơn</Link>,
    },
  ];

  return (
    <SidebarContainer
      width={200}
      theme="light"
      collapsible
      trigger={null}
      collapsed={collapsed}
    >
      <StyledHeader>
        <LogoImage $collapsed={collapsed} src={logo} alt="MealMate Logo" />
      </StyledHeader>
      <CustomMenu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
