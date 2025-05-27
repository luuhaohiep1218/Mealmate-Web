import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import styled from "styled-components";
import GlobalStyle from "../GlobalStyle";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #faf7f2;
  width: 100%;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  /* Add padding to account for the fixed header if needed */
  padding-top: ${(props) => (props.hasFixedHeader ? "80px" : "0")};
`;

const DefaultLayoutComponent = ({ children, hasFixedHeader = false }) => {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <HeaderComponent />
        <MainContent hasFixedHeader={hasFixedHeader}>{children}</MainContent>
        <FooterComponent />
      </Wrapper>
    </>
  );
};

export default DefaultLayoutComponent;
