import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import styled from "styled-components";
import GlobalStyle from "../GlobalStyle";
import PageContainer from "../PageContainer";

const DefaultLayoutComponent = ({ children, hasFixedHeader = false }) => {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <MainWrapper>
          <HeaderComponent />
          <PageContainer>
            <MainContent hasFixedHeader={hasFixedHeader}>
              {children}
            </MainContent>
          </PageContainer>
          <FooterComponent />
        </MainWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #faf7f2;
  width: 100%;
  overflow-x: hidden;
`;

const MainWrapper = styled.div`
  max-width: 1440px;
  margin: 1rem auto;
  width: 100%;
  padding: 0 32px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
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

export default DefaultLayoutComponent;
