import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useMealMate } from "../../context/MealMateContext";

const SideNav = () => {
  const { user, logout } = useMealMate();
  const location = useLocation();

  const isActiveRoute = (path) => {
    // Exact match for root account page
    if (path === "/account") {
      return location.pathname === "/account";
    }
    // For other routes, check if it's an exact match or starts with the path
    // but only if it's followed by a slash or is the end of the path
    return (
      location.pathname === path ||
      (location.pathname.startsWith(path) &&
        (location.pathname.charAt(path.length) === "/" ||
          location.pathname.length === path.length))
    );
  };
  console.log("user", user.authProvider);

  return (
    <SideNavContainer>
      <ProfileImage>
        <img
          src={user.profile_picture || "/images/profile-art.jpg"}
          alt="Ảnh đại diện"
        />
      </ProfileImage>
      <NavLinks>
        <NavLink
          to="/account"
          className={isActiveRoute("/account") ? "active" : ""}
        >
          Tổng quan tài khoản
        </NavLink>
        <NavLink
          to="/account/profile"
          className={isActiveRoute("/account/profile") ? "active" : ""}
        >
          Hồ sơ cá nhân
        </NavLink>
        {/* Chỉ hiển thị nút đổi mật khẩu nếu không phải đăng nhập bằng Google */}
        {user?.authProvider !== "google" && (
          <NavLink
            to="/account/change-password"
            className={
              isActiveRoute("/account/change-password") ? "active" : ""
            }
          >
            Đổi mật khẩu
          </NavLink>
        )}
        <NavLink
          to="/account/daily-menu"
          className={isActiveRoute("/account/daily-menu") ? "active" : ""}
        >
          Thực đơn hàng ngày
        </NavLink>
        <NavLink
          to="/meal-planner"
          className={isActiveRoute("/meal-planner") ? "active" : ""}
        >
          Lập kế hoạch bữa ăn
        </NavLink>
        <NavLink
          to="/account/subscription"
          className={isActiveRoute("/account/subscription") ? "active" : ""}
        >
          Gói dịch vụ
        </NavLink>
        <NavLink
          to="/account/settings"
          className={isActiveRoute("/account/settings") ? "active" : ""}
        >
          Cài đặt
        </NavLink>
        <NavLink onClick={logout} className="danger">
          Đăng xuất
        </NavLink>
      </NavLinks>
    </SideNavContainer>
  );
};

const SideNavContainer = styled.nav`
  width: 250px;
  flex-shrink: 0;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 60px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #666;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }

  &.active {
    background: #ff4b4b;
    color: white;
  }

  &.danger {
    color: #ff4b4b;
    &:hover {
      background: #fff1f1;
    }
  }
`;

export default SideNav;
