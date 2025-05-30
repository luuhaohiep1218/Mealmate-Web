import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    message.info("Trang không tồn tại, đang chuyển hướng về trang chủ...");
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default NotFoundPage;
