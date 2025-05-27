import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PaletteSection = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "BREAKFEST", icon: "🍳" },
    { id: 2, name: "LUNCH", icon: "🥗" },
    { id: 3, name: "DINNER", icon: "🍽️" },
    { id: 4, name: "DESSERT", icon: "🍰" },
    { id: 5, name: "QUICK BITE!", icon: "🥪" },
  ];

  return (
    <PaletteContainer>
      <LeftContent>
        <ExploreTag>EXPLORE</ExploreTag>
        <Title>OUR DIVERSE PALETTE</Title>
        <Description>
          If you are a breakfast enthusiast, a connoisseur of savory delights,
          or on the lookout for irresistible desserts, our curated selection has
          something to satisfy every palate.
        </Description>
        <SeeMoreButton>SEE MORE</SeeMoreButton>
      </LeftContent>

      <RightContent>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
          >
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
          </CategoryItem>
        ))}
      </RightContent>
    </PaletteContainer>
  );
};

const PaletteContainer = styled.section`
  padding: 3rem;
  display: flex;
  justify-content: space-between;
  gap: 4rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  max-width: 600px;
`;

const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ExploreTag = styled.span`
  background: #ff6b6b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Description = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SeeMoreButton = styled.button`
  background: none;
  border: 2px solid #333;
  color: #333;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: white;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: translateX(10px);
  }
`;

const CategoryIcon = styled.div`
  font-size: 1.5rem;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryName = styled.h3`
  font-size: 1rem;
  color: #333;
  font-weight: 600;
  margin: 0;
`;

export default PaletteSection;
