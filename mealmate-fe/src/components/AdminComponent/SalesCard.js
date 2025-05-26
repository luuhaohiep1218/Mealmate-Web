import React from "react";
import { Card, Statistic, Progress } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const SalesCard = ({
  title,
  value,
  percent,
  socialIcon,
  totalLikes,
  target,
  duration,
  isPositive,
}) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={Math.abs(value)}
        precision={2}
        valueStyle={{ color: isPositive ? "#3f8600" : "#cf1322" }}
        prefix={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        suffix="$"
      />
      <Progress percent={percent} status="active" />
      <div style={{ textAlign: "center", marginTop: 16 }}>
        {socialIcon}
        <Statistic
          value={totalLikes}
          suffix={` ${totalLikes > 0 ? "+" : ""}${totalLikes}% Total Likes`}
          style={{ marginTop: 8 }}
        />
        <div>
          Target: {target} | Duration: {duration}
        </div>
      </div>
    </Card>
  );
};

export default SalesCard;
