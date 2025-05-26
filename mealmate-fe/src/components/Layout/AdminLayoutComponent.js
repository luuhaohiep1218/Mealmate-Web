import React from "react";
import { Layout } from "antd";
import Sidebar from "../../components/AdminComponent/Sidebar";
import HeaderBar from "../../components/HeaderComponent/HeaderBar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AdminLayoutComponent = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              background: "#fff",
              minHeight: 360,
            }}
          >
            <Outlet /> {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayoutComponent;
