import React from "react";
import styled from "styled-components";

const PageContainer = ({ children }) => {
  return (
    <OuterContainer>
      <Container>{children}</Container>
    </OuterContainer>
  );
};

const OuterContainer = styled.div`
  flex: 1;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1rem 0;
  }
`;

export default PageContainer;
