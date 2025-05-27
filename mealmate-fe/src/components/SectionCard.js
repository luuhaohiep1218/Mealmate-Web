import React from "react";
import styled from "styled-components";

const SectionCard = ({ children, background = "white" }) => {
  return <CardWrapper background={background}>{children}</CardWrapper>;
};

const CardWrapper = styled.div`
  background: ${(props) => props.background};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0.5rem 0;
`;

export default SectionCard;
