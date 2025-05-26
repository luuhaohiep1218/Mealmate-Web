import React from "react";
import { Card, Statistic, Progress } from "antd";
import { StarOutlined } from "@ant-design/icons";

const RatingCard = () => {
  return (
    <Card>
      <Statistic
        title="Rating"
        value={4.7}
        precision={1}
        valueStyle={{ color: "#3f8600" }}
        suffix={<StarOutlined />}
      />
      <Progress percent={96} status="active" />
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Statistic value={5} suffix=" / 5" style={{ marginTop: 8 }} />
        <div>384</div>
      </div>
    </Card>
  );
};

export default RatingCard;
