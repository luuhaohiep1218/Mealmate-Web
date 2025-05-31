import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link for the back button
import axios from "axios";
import styled from "styled-components";

const MenuDetailPage = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/menus/${id}`);
        setMenu(res.data);
      } catch (err) {
        setError("Không thể tải chi tiết thực đơn. Vui lòng thử lại sau.");
        console.error("Lỗi khi lấy dữ liệu menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  if (loading) return <LoadingMessage>Đang tải...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!menu) return <ErrorMessage>Không tìm thấy thực đơn.</ErrorMessage>;

  return (
    <Container>
      {/* Image Header */}
      <ImageHeader>
        <img
          src={menu.image || "/images/menu-placeholder.jpg"}
          alt={menu.name}
        />
      </ImageHeader>

      {/* Menu Title and Description */}
      <Title>{menu.name}</Title>
      {menu.description ? (
        <Description>{menu.description}</Description>
      ) : (
        <Description>Chưa có mô tả cho thực đơn này.</Description>
      )}

      {/* Menu Info */}
      <Info>
        <InfoItem>🍽️ Phục vụ: {menu.serves || 1} người</InfoItem>
        <InfoItem>🕒 Loại bữa ăn: {menu.type || "Không xác định"}</InfoItem>
        <InfoItem>
          🏷️ Tags:{" "}
          {menu.tags && menu.tags.length > 0
            ? menu.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)
            : "Không có tag"}
        </InfoItem>
        <InfoItem>👨‍🍳 Người tạo: {menu.createdBy?.name || "Ẩn danh"}</InfoItem>
      </Info>

      {/* Recipe List */}
      <SectionTitle>📝 Danh sách món ăn </SectionTitle>
      {menu.recipes && menu.recipes.length > 0 ? (
        menu.recipes.map(({ recipe, servings }, index) =>
          recipe ? ( // 👈 KIỂM TRA NULL
            <RecipeCard key={recipe._id || index}>
              <CardContent>
                <RecipeImage
                  src={recipe.image || "/images/recipe-placeholder.jpg"}
                  alt={recipe.name}
                />
                <RecipeDetails>
                  <RecipeTitle>{recipe.name}</RecipeTitle>
                  {recipe.description && (
                    <RecipeDescription>{recipe.description}</RecipeDescription>
                  )}
                  <RecipeInfo>🍴 Khẩu phần: {servings || 1}</RecipeInfo>
                  <RecipeInfo>
                    ⏱️ Thời gian: {recipe.total_time} phút (Sơ chế:{" "}
                    {recipe.prep_time} phút, Nấu: {recipe.cook_time} phút)
                  </RecipeInfo>
                </RecipeDetails>
                <ViewButtonWrapper>
                  <Link to={`/recipes/${recipe._id}`}>
                    <ViewButton>Xem chi tiết</ViewButton>
                  </Link>
                </ViewButtonWrapper>
              </CardContent>
            </RecipeCard>
          ) : (
            <p key={index}>⚠️ Công thức đã bị xóa hoặc không tồn tại.</p>
          )
        )
      ) : (
        <p>Thực đơn này chưa có món ăn nào.</p>
      )}

      {/* Back Button */}
      <BackButtonWrapper>
        <Link to="/menus/${menu._id}">
          <BackButton>Quay lại danh sách thực đơn</BackButton>
        </Link>
      </BackButtonWrapper>
    </Container>
  );
};

export default MenuDetailPage;

// ===== Styled Components =====
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

const Tag = styled.span`
  display: inline-block;
  background: #4caf50;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  margin-right: 0.5rem;
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const RecipeCard = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
`;

const RecipeTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-top: 0;
`;

const RecipeDescription = styled.p`
  font-size: 1rem;
  font-style: italic;
  color: #555;
  margin-bottom: 0.5rem;
`;

const RecipeInfo = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
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
const CardContent = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RecipeImage = styled.img`
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
  background-color: #e0e0e0;
`;

const RecipeDetails = styled.div`
  flex: 1;
`;
const ViewButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ViewButton = styled.button`
  background: none;
  border: 2px solid #333;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    color: white;
  }
`;
