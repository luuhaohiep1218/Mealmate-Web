import React from "react";
import styled from "styled-components";

const PaletteSection = () => {
  const categories = [
    { icon: "🍳", name: "BREAKFAST" },
    { icon: "🥗", name: "LUNCH" },
    { icon: "🍔", name: "DINNER" },
    { icon: "🍰", name: "DESSERT" },
    { icon: "🥪", name: "QUICK BITE!" },
  ];

  return (
    <Container>
      <ExploreTag>EXPLORE</ExploreTag>
      <Content>
        <TextContent>
          <h2>OUR DIVERSE PALETTE</h2>
          <p>
            If you are a breakfast enthusiast, a connoisseur of savory delights,
            or on the lookout for irresistible desserts, our curated selection
            has something to satisfy every palate.
          </p>
          <SeeMoreButton>SEE MORE</SeeMoreButton>
        </TextContent>
        <Categories>
          {categories.map((category, index) => (
            <CategoryItem key={index}>
              <CategoryIcon>{category.icon}</CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
            </CategoryItem>
          ))}
        </Categories>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background: #e6f3ff;
  padding: 4rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ExploreTag = styled.span`
  background: #ff6b6b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 500;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 4rem;
  max-width: 1200px;
  margin: 2rem auto 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const TextContent = styled.div`
  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.8rem;
    }
  }

  p {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 600px;

    @media (max-width: 768px) {
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
    }
  }
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: unset;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(10px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;

    &:hover {
      transform: translateX(5px);
    }
  }
`;

const CategoryIcon = styled.span`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CategoryName = styled.span`
  font-weight: 500;
  color: #333;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SeeMoreButton = styled.button`
  background: none;
  border: 2px solid #333;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
`;

export default PaletteSection;
