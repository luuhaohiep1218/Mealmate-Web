import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FeaturedRecipes = () => {
  const navigate = useNavigate();

  const recipes = [
    {
      id: 1,
      title: "Savory Herb-Infused Chicken",
      description:
        "Dive into the savory symphony of flavors with our Savory Herb-Infused Chicken. A delightful blend of fresh herbs and perfectly cooked chicken creates an unforgettable dining experience.",
      image: "/recipes/herb-chicken.jpg",
      cookTime: "45 mins",
    },
    {
      id: 2,
      title: "Decadent Chocolate Mousse",
      description:
        "Dive into the velvety indulgence of our Decadent Chocolate Mousse. A dessert that combines rich chocolate with a light, airy texture for the perfect sweet ending.",
      image: "/recipes/chocolate-mousse.jpg",
      cookTime: "30 mins",
    },
  ];

  return (
    <FeaturedContainer>
      <Header>
        <Title>FEATURED RECIPES</Title>
        <NavigationButtons>
          <NavButton aria-label="Previous recipe">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavButton>
          <NavButton aria-label="Next recipe">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavButton>
        </NavigationButtons>
      </Header>

      <RecipeGrid>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          >
            <RecipeImage src={recipe.image} alt={recipe.title} />
            <RecipeContent>
              <RecipeTitle>{recipe.title}</RecipeTitle>
              <RecipeDescription>{recipe.description}</RecipeDescription>
              <RecipeTime>
                <ClockIcon>⏰</ClockIcon>
                {recipe.cookTime}
              </RecipeTime>
            </RecipeContent>
          </RecipeCard>
        ))}
      </RecipeGrid>
    </FeaturedContainer>
  );
};

const FeaturedContainer = styled.section`
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  font-weight: 700;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: 2px solid #333;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;

  &:hover {
    background: #333;
    color: white;
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RecipeCard = styled.div`
  display: flex;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RecipeImage = styled.img`
  width: 300px;
  height: 250px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const RecipeContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const RecipeTitle = styled.h3`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const RecipeDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
`;

const RecipeTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const ClockIcon = styled.span`
  font-size: 1rem;
`;

export default FeaturedRecipes;
