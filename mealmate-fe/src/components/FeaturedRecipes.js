import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/axiosInstance";
import { Spin } from "antd";

const FeaturedRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const recipesPerPage = 2;

  useEffect(() => {
    fetchTopRatedRecipes();
  }, []);

  const fetchTopRatedRecipes = async () => {
    try {
      const response = await api.get("/recipes?sort=-rating&limit=6");
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải công thức:", error);
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(Math.ceil(recipes.length / recipesPerPage) - 1, prev + 1)
    );
  };

  const displayedRecipes = recipes.slice(
    currentPage * recipesPerPage,
    (currentPage + 1) * recipesPerPage
  );

  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Title>Công Thức Nổi Bật</Title>
      <Description>
        Khám phá những công thức nấu ăn được yêu thích nhất của cộng đồng
      </Description>
      <RecipeGrid>
        {displayedRecipes.map((recipe) => (
          <RecipeCard key={recipe._id}>
            <RecipeImage src={recipe.image} alt={recipe.name} />
            <RecipeInfo>
              <RecipeName>{recipe.name}</RecipeName>
              <RecipeDescription>{recipe.description}</RecipeDescription>
              <ViewButton onClick={() => navigate(`/recipes/${recipe._id}`)}>
                Xem Chi Tiết
              </ViewButton>
            </RecipeInfo>
          </RecipeCard>
        ))}
      </RecipeGrid>
      <NavigationButtons>
        <NavButton onClick={handlePrevious} disabled={currentPage === 0}>
          Trước
        </NavButton>
        <NavButton
          onClick={handleNext}
          disabled={
            currentPage === Math.ceil(recipes.length / recipesPerPage) - 1
          }
        >
          Tiếp
        </NavButton>
      </NavigationButtons>
    </Container>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Container = styled.section`
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  font-weight: 700;
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
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

const RecipeInfo = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const RecipeName = styled.h3`
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

const ViewButton = styled.button`
  background: none;
  border: 2px solid #ff9f1c;
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ff9f1c;
  font-weight: 600;

  &:hover {
    background: #ff9f1c;
    color: white;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  background: none;
  border: 2px solid #ff9f1c;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ff9f1c;

  &:hover:not(:disabled) {
    background: #ff9f1c;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #ccc;
    color: #ccc;
  }
`;

export default FeaturedRecipes;
