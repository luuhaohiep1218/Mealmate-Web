import React from "react";
import { Card, Avatar, Button } from "antd";

const RecentUsersCard = () => {
  const users = [
    {
      name: "Isabella Christensen",
      description: "Lorem ipsum is simply dummy text of...",
      date: "11 MAY 12:56",
      color: "#87d068",
      initial: "IC",
    },
    {
      name: "Mathilde Andersen",
      description: "Lorem ipsum is simply dummy text of...",
      date: "11 MAY 10:35",
      color: "#1890ff",
      initial: "MA",
    },
    {
      name: "Karla Sørensen",
      description: "Lorem ipsum is simply dummy text of...",
      date: "9 MAY 17:24",
      color: "#f56a00",
      initial: "KS",
    },
  ];

  return (
    <Card title="Recent Users">
      {users.map((user, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: index === users.length - 1 ? 0 : 16,
          }}
        >
          <Avatar style={{ backgroundColor: user.color }}>
            {user.initial}
          </Avatar>
          <div style={{ marginLeft: 16, flex: 1 }}>
            <div>{user.name}</div>
            <div style={{ color: "#888" }}>{user.description}</div>
          </div>
          <div>{user.date}</div>
          <Button type="primary" style={{ marginLeft: 8 }}>
            Approve
          </Button>
          <Button type="default" style={{ marginLeft: 8 }}>
            Reject
          </Button>
        </div>
      ))}
    </Card>
  );
};

export default RecentUsersCard;
