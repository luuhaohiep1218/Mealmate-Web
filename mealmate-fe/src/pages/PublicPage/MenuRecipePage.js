import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, useParams, Link } from "react-router-dom";
import FeedbackForm from "../../components/UserFeedbackComponent/FeedbackForm";
import FeedbackList from "../../components/UserFeedbackComponent/FeedbackList";

const MenuRecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  const handleFeedbackSubmitted = (newFeedback) => {
    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Không thể tải món ăn. Vui lòng thử lại sau.");
        console.error("Lỗi khi lấy dữ liệu recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <LoadingMessage>Đang tải...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!recipe) return <ErrorMessage>Không tìm thấy món ăn.</ErrorMessage>;

  return (
    <Container>
      <ImageHeader>
        <img
          src={recipe.image || "/images/recipe-placeholder.jpg"}
          alt={recipe.name}
        />
      </ImageHeader>

      <Title>{recipe.name}</Title>
      {recipe.description ? (
        <Description>{recipe.description}</Description>
      ) : (
        <Description>Chưa có mô tả cho món ăn này.</Description>
      )}

      <Info>
        <InfoItem>🍴 Khẩu phần: {recipe.servings || 1}</InfoItem>
        <InfoItem>
          ⏱️ Thời gian: {recipe.total_time} phút (Sơ chế: {recipe.prep_time}{" "}
          phút, Nấu: {recipe.cook_time} phút)
        </InfoItem>
        <InfoItem>👨‍🍳 Người tạo: {recipe.createdBy?.name || "Ẩn danh"}</InfoItem>
      </Info>

      <TwoColumnLayout>
        <LeftColumn>
          <Card className="instructions">
            <CardHeader>👨‍🍳 Cách làm</CardHeader>
            {recipe.steps?.length > 0 ? (
              <ol>
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <p>Chưa có hướng dẫn chế biến.</p>
            )}
          </Card>
        </LeftColumn>

        <RightColumn>
          <Card>
            <CardHeader>🥗 Nguyên liệu</CardHeader>
            {recipe.ingredients?.length > 0 ? (
              <ul>
                {recipe.ingredients.map((item, i) => (
                  <li key={i}>
                    {item.name} - {item.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa có thông tin nguyên liệu.</p>
            )}
          </Card>

          <Card>
            <CardHeader>🍎 Giá trị dinh dưỡng</CardHeader>
            {recipe.nutrition ? (
              <div>
                <p>• Calories: {recipe.calories} kcal</p>
                <p>• Protein: {recipe.nutrition.protein}g</p>
                <p>• Fat: {recipe.nutrition.fat}g</p>
                <p>• Carbs: {recipe.nutrition.carbs}g</p>
              </div>
            ) : (
              <p>Không có dữ liệu dinh dưỡng.</p>
            )}
          </Card>
        </RightColumn>
      </TwoColumnLayout>

      <FeedbackSection>
        <SectionHeader>⭐ Đánh giá món ăn</SectionHeader>
        <p>Trung bình: {recipe.rating?.toFixed(1) || "Chưa có"} / 5</p>
        <FeedbackForm
          recipeId={recipe._id}
          onSubmitted={handleFeedbackSubmitted}
        />
      </FeedbackSection>

      <Section>
        <FeedbackList recipeId={recipe._id} newFeedbacks={feedbacks} />
      </Section>

      <BackButtonWrapper>
        <BackButton onClick={() => navigate(-1)}>Quay lại</BackButton>
        <Link to="/menus ">
          <BackButton>Thực đơn</BackButton>
        </Link>
      </BackButtonWrapper>
    </Container>
  );
};

export default MenuRecipePage;

// Styled Components (giữ nguyên từ bản gốc)
// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: auto;
`;

const ImageHeader = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 1.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
`;

const Info = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #666;
  margin-bottom: 2rem;
  justify-content: center;
`;

const InfoItem = styled.span`
  font-size: 1rem;
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
`;

const Section = styled.section`
  margin-top: 2rem;
`;

const SectionHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #444;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 2rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #e74c3c;
  padding: 2rem;
`;

const BackButtonWrapper = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const BackButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const Card = styled.div`
  background: #fefefe;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  ul,
  ol {
    padding-left: 1.2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
  }

  &.instructions {
    height: 450px; /* chiều cao cố định */
    overflow-y: auto; /* thanh cuộn dọc */
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: #ccc #fefefe;

    &::-webkit-scrollbar {
      /* Chrome, Edge, Safari */
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 4px;
    }
  }
`;

const CardHeader = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
`;
const TwoColumnLayout = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 2;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FeedbackSection = styled.div`
  margin-top: 3rem;
  background: #fefefe;
  padding: 2rem;
  border-top: 1px solid #ddd;
  text-align: center;

  p {
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }
`;
