import React from "react";
import { Row, Col } from "antd";
import SalesCard from "../../components/AdminComponent/SalesCard";
import RatingCard from "../../components/AdminComponent/RatingCard";
import RecentUsersCard from "../../components/AdminComponent/RecentUsersCard";
import {
  FacebookOutlined,
  TwitterOutlined,
  GooglePlusOutlined,
} from "@ant-design/icons";

const AdminDashboardPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Row gutter={[16, 16]}>
        {/* Daily Sales */}
        <Col span={8}>
          <SalesCard
            title="Daily Sales"
            value={3229.95}
            percent={67}
            socialIcon={
              <FacebookOutlined style={{ fontSize: 24, color: "#3b5999" }} />
            }
            totalLikes={12.231}
            target={35098}
            duration={350}
            isPositive
          />
        </Col>

        {/* Monthly Sales */}
        <Col span={8}>
          <SalesCard
            title="Monthly Sales"
            value={-2942.32}
            percent={36}
            socialIcon={
              <TwitterOutlined style={{ fontSize: 24, color: "#1da1f2" }} />
            }
            totalLikes={-6.3}
            target={34185}
            duration={800}
            isPositive={false}
          />
        </Col>

        {/* Yearly Sales */}
        <Col span={8}>
          <SalesCard
            title="Yearly Sales"
            value={8638.32}
            percent={80}
            socialIcon={
              <GooglePlusOutlined style={{ fontSize: 24, color: "#db4437" }} />
            }
            totalLikes={5.9}
            target={25098}
            duration={900}
            isPositive
          />
        </Col>

        {/* Rating */}
        <Col span={8}>
          <RatingCard />
        </Col>

        {/* Recent Users */}
        <Col span={16}>
          <RecentUsersCard />
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage;
