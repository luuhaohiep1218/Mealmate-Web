import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyle from "../GlobalStyle";
import ModalSignInComponent from "../ModalComponent/ModalSignInComponent";
import { useMealMate } from "../../context/MealMateContext";
import { Avatar, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import LogoImage from "../../assets/logo/logo-mealmate-removebg-preview.png";

const HeaderComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { isAuthenticated, user } = useMealMate();
  const navigate = useNavigate();

  const renderAuthButton = () => {
    if (isAuthenticated && user) {
      return (
        <AvatarWrapper onClick={() => navigate("/account")}>
          {user.profile_picture ? (
            <StyledAvatar size={35} src={user.profile_picture} />
          ) : (
            <StyledAvatar size={35} icon={<UserOutlined />}>
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </StyledAvatar>
          )}
        </AvatarWrapper>
      );
    }

    return (
      <SignInButton onClick={() => setIsSignInModalOpen(true)}>
        <UserIcon>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </UserIcon>
      </SignInButton>
    );
  };

  return (
    <>
      <GlobalStyle />
      <HeaderContainer>
        <Navbar>
          <LogoWrapper onClick={() => navigate("/")}>
            <StyledImage
              src={LogoImage}
              alt="Mealmate Logo"
              preview={false}
              width={75}
            />
            <LogoText>
              <span>Meal</span>
              <span>mate</span>
            </LogoText>
          </LogoWrapper>

          <NavContent className={isMenuOpen ? "open" : ""}>
            <NavLinks>
              <NavLink className="active" onClick={() => navigate("/")}>
                HOME
              </NavLink>
              <NavLink onClick={() => navigate("/recipes")}>RECIPES</NavLink>
              <NavLink onClick={() => navigate("/menus")}>MENU</NavLink>
              <NavLink onClick={() => navigate("/blogs")}>BLOG</NavLink>
            </NavLinks>
          </NavContent>

          <NavRight>
            <SearchButton>
              <SearchIcon>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SearchIcon>
            </SearchButton>
            {renderAuthButton()}
          </NavRight>

          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>☰</span>
          </MobileMenuButton>
        </Navbar>
      </HeaderContainer>

      <ModalSignInComponent
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  background: transparent;
  position: relative;
  z-index: 100;
  margin-bottom: 1rem;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: white;
  border-radius: 20px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  min-width: 140px;
  position: relative;
`;

const StyledImage = styled(Image)`
  img {
    object-fit: contain;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  margin-left: -15px;
  position: relative;
  z-index: 1;

  span {
    font-weight: 600;
    font-size: 1.2rem;

    &:first-child {
      color: #ff9f1c;
    }

    &:last-child {
      color: #011936;
    }
  }
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 2rem;

  @media (max-width: 768px) {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 20px 20px;
    z-index: 100;
    margin-top: 0.5rem;

    &.open {
      display: flex;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #666;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  padding-bottom: 2px;
  cursor: pointer;
  text-transform: uppercase;

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #ff4b4b;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #333;
  }

  &.active {
    color: #333;
    &:after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 0.5rem 0;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 140px;
  justify-content: flex-end;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const SearchIcon = styled.span`
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: #333;
  }
`;

const SignInButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserIcon = styled.span`
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: #333;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`;

const AvatarWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledAvatar = styled(Avatar)`
  background-color: #ff4b4b;

  &:hover {
    opacity: 0.9;
  }
`;

export default HeaderComponent;
