import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>UNLEASH CULINARY EXCELLENCE</HeroTitle>
        <HeroText>
          Explore a world of flavors, discover handcrafted recipes, and let the
          aroma of our passion for cooking fill your kitchen
        </HeroText>
        <ExploreButton onClick={() => navigate("/recipes")}>
          EXPLORE RECIPES
        </ExploreButton>
      </HeroContent>
    </HeroContainer>
  );
};

const HeroContainer = styled.div`
  height: 600px;
  background-image: url("/images/banner-food.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 400px;
    border-radius: 15px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 2rem;
  animation: fadeIn 1s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  color: #ff9f1c;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const ExploreButton = styled.button`
  background: #ff9f1c;
  color: #011936;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: #ff8c00;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 159, 28, 0.4);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

export default HeroSection;
