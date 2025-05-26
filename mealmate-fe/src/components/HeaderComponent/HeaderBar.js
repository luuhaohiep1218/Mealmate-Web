import React from "react";
import { Layout, Input, Badge, Avatar, Button } from "antd";
import {
  SearchOutlined,
  SunOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderBar = ({ collapsed, setCollapsed }) => {
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
        <Button
          type="text"
          icon={<SunOutlined />}
          style={{ fontSize: "16px", marginRight: 16 }}
        />
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{ fontSize: "16px", marginRight: 16 }}
        />
        <Badge count={3} style={{ marginRight: 32 }}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: "16px", marginRight: 16 }}
          />
        </Badge>
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: "#87d068" }}
        />
      </div>
    </Header>
  );
};

export default HeaderBar;
