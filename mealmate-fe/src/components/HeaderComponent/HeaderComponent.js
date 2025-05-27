import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as LogoIcon } from "../../assets/logo.svg";
import GlobalStyle from "../GlobalStyle";

const HeaderComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <GlobalStyle />
      <HeaderContainer>
        <Navbar>
          <LogoWrapper>
            <LogoIcon />
            <LogoText>
              <span>Cooks</span>
              <span>Delight</span>
            </LogoText>
          </LogoWrapper>

          <NavContent className={isMenuOpen ? "open" : ""}>
            <NavLinks>
              <NavLink className="active">HOME</NavLink>
              <NavLink>RECIPES</NavLink>
              <NavLink>COOKING TIPS</NavLink>
              <NavLink>ABOUT US</NavLink>
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
            <SubscribeButton>SUBSCRIBE</SubscribeButton>
          </NavRight>

          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>☰</span>
          </MobileMenuButton>
        </Navbar>
      </HeaderContainer>
    </>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem;
  background: transparent;
  position: relative;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0.3rem;
  }
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 50px;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    border-radius: 25px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  min-width: 140px;

  svg {
    height: 35px;
    width: auto;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  span {
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;

    &:first-child {
      margin-bottom: -2px;
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

const SubscribeButton = styled.button`
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #333;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
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

export default HeaderComponent;
