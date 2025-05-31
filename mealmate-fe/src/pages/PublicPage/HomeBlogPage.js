import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, Card, Button, Spin } from "antd";
import {
  ClockCircleOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
  FireOutlined,
  ClockCircleFilled,
  EyeOutlined,
  StarFilled,
} from "@ant-design/icons";
import SectionCard from "../../components/SectionCard";
import { useNavigate } from "react-router-dom";
import { api, endpoints } from "../../utils/axiosInstance";
import moment from "moment";
import background from "../../assets/backgrounds/background-dep-mau-do-cam_085354142.jpg";

const { Title, Text } = Typography;

const HeroContent = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeaturedCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .ant-card-body {
    padding: 24px;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogPost = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const BlogImage = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${BlogPost}:hover & img {
    transform: scale(1.05);
  }
`;

const BlogContent = styled.div`
  padding: 20px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 12px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.3s ease;
  }

  p {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;

  svg {
    color: #4caf50;
    font-size: 14px;
  }

  &.category {
    color: #4caf50;
    font-weight: 500;
  }
`;

const ReadMoreLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4caf50;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;

  svg {
    font-size: 12px;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #2e7d32;

    svg {
      transform: translateX(4px);
    }
  }
`;

const ViewMoreSection = styled.div`
  text-align: center;
  margin: 48px 0 60px;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  font-size: 32px !important;
  font-weight: 600 !important;
  margin: 40px 0 40px !important;
  color: #2c3e50;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 3px;
    background: #4caf50;
    margin: 16px auto 0;
    border-radius: 2px;
  }
`;

const ViewMoreButton = styled(Button)`
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #4caf50;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;

  &:hover,
  &:focus,
  &:active {
    background: #43a047 !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3);
    border: none !important;
  }

  .anticon {
    transition: transform 0.3s ease;
  }

  &:hover .anticon {
    transform: translateX(4px);
  }
`;

const ReadMoreButton = styled(Button)`
  border: 2px solid #000;
  color: #000;
  font-weight: 500;
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  margin-top: 16px;
  transition: all 0.3s ease;

  &:hover,
  &:focus,
  &:active {
    background: #000 !important;
    color: white !important;
    border-color: #000 !important;
    transform: translateY(-2px);
  }
`;

const CategoriesContainer = styled.div`
  margin: 40px 0;
  position: relative;
  padding: 0 40px;
`;

const CategoriesScroll = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px 0;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  /* Hide scrollbar but keep functionality */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const CategoryCard = styled.div`
  min-width: 380px;
  height: 180px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease;
  background: url(${background});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
    opacity: 1;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 0.8;
    }

    img {
      transform: translate(30%, -30%) scale(1.1);
      opacity: 0.85;
    }

    h3 {
      transform: translateX(10px);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
  }

  img {
    position: absolute;
    right: 0;
    top: 0;
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    transform: translate(30%, -30%);
    opacity: 0.75;
    transition: all 0.4s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transform-origin: center center;
  }

  h3 {
    color: white;
    font-size: 32px;
    font-weight: 600;
    margin: 0;
    z-index: 2;
    flex: 1;
    transition: all 0.4s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    position: relative;
    max-width: 60%;

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }

  &:hover h3::after {
    width: 60px;
  }
`;

const RecipesSection = styled.div`
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
`;

const RecipeDescription = styled.p`
  font-size: 18px;
  color: #666;
  margin: 20px 0 40px;
  line-height: 1.6;
`;

const RecipeCarousel = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 0 auto;
  padding: 20px 100px;
  overflow: hidden;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
  transition: transform 0.5s ease;
`;

const RecipeCard = styled.div`
  flex: 0 0 calc(33.333% - 16px);
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  opacity: ${(props) => (props.isMiddle ? 1 : 0.7)};
  transform: ${(props) => (props.isMiddle ? "scale(1.05)" : "scale(0.95)")};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    transform: ${(props) => (props.isMiddle ? "scale(1.05)" : "scale(1)")};
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .content {
    padding: 24px;
    text-align: left;
  }

  h3 {
    font-size: 20px;
    margin: 0 0 16px;
    color: #2c3e50;
  }

  p {
    color: #666;
    margin: 0 0 20px;
    line-height: 1.6;
  }
`;

const RecipeStats = styled.div`
  display: flex;
  gap: 24px;
  color: #666;
  font-size: 16px;

  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .anticon {
    color: #4caf50;
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.direction === "left" ? "left: 20px;" : "right: 20px;")}
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  &:hover {
    background: #4caf50;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorName = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const HomeBlogPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [topBlogs, setTopBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [topRecipes, setTopRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    fetchTopBlogs();
    fetchCategories();
    fetchTopRecipes();
  }, []);

  const fetchTopBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.blogs.topViews);
      if (response.data && response.data.length > 0) {
        // Set the first blog as featured
        setFeaturedBlog(response.data[0]);
        // Set the rest as top blogs
        setTopBlogs(response.data.slice(1));
      }
    } catch (error) {
      console.error("Error fetching top blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get(endpoints.blogCategories.list);
      if (response && Array.isArray(response)) {
        setCategories(response);
      } else if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTopRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const response = await api.get(endpoints.recipes.topRated);
      setTopRecipes(response.data || []);
    } catch (error) {
      console.error("Error fetching top recipes:", error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    if (cardRef.current) {
      const width = cardRef.current.offsetWidth + 24; // including gap
      setCardWidth(width);
    }
  }, []);

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM DD, YYYY");
  };

  const calculateReadTime = (content) => {
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const handlePrevRecipe = () => {
    setCurrentRecipe((prev) => {
      const newIndex = prev - 1;
      return newIndex >= 0 ? newIndex : topRecipes.length - 1;
    });
  };

  const handleNextRecipe = () => {
    setCurrentRecipe((prev) => {
      const newIndex = prev + 1;
      return newIndex < topRecipes.length ? newIndex : 0;
    });
  };

  const handleCardClick = (clickedIndex) => {
    setCurrentRecipe(clickedIndex);
  };

  const getDisplayRecipes = () => {
    const displayRecipes = [];
    const totalRecipes = topRecipes.length;

    if (totalRecipes === 0) return [];

    // Thêm món trước current
    const prevIndex = (currentRecipe - 1 + totalRecipes) % totalRecipes;
    displayRecipes.push({
      ...topRecipes[prevIndex],
      isMiddle: false,
      displayIndex: prevIndex,
    });

    // Thêm món current
    displayRecipes.push({
      ...topRecipes[currentRecipe],
      isMiddle: true,
      displayIndex: currentRecipe,
    });

    // Thêm món sau current
    const nextIndex = (currentRecipe + 1) % totalRecipes;
    displayRecipes.push({
      ...topRecipes[nextIndex],
      isMiddle: false,
      displayIndex: nextIndex,
    });

    return displayRecipes;
  };

  const handleCategoryClick = (category) => {
    if (category && category.slug) {
      navigate(`/blogs/category/${category.slug}`);
    }
  };

  return (
    <>
      <SectionCard background="#4CAF50">
        <HeroContent>
          <Title level={1} style={{ color: "white", marginBottom: 16 }}>
            Nutrition Explained
          </Title>
          <Text style={{ color: "white", fontSize: 18 }}>
            Learn about nutrition from Lifesum's in-house nutritionists and
            invited experts.
          </Text>
        </HeroContent>
      </SectionCard>

      <SectionCard background="#f8f9fa">
        <ContentSection>
          <SectionTitle level={4}>FEATURED STORY</SectionTitle>

          {loading ? (
            <LoadingContainer>
              <Spin size="large" />
            </LoadingContainer>
          ) : featuredBlog ? (
            <FeaturedCard>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <StyledImage
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                  />
                </div>
                <div style={{ flex: 1, padding: "24px 0" }}>
                  <Title level={2}>{featuredBlog.title}</Title>

                  <BlogMeta>
                    <MetaItem
                      className="category"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (featuredBlog.category?.slug) {
                          navigate(
                            `/blogs/category/${featuredBlog.category.slug}`
                          );
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {featuredBlog.category?.name || "Uncategorized"}
                    </MetaItem>
                    <MetaItem>
                      <ClockCircleOutlined />
                      {calculateReadTime(featuredBlog.summary)}
                    </MetaItem>
                    <MetaItem>
                      <EyeOutlined />
                      {featuredBlog.views} views
                    </MetaItem>
                    <MetaItem>{formatDate(featuredBlog.date)}</MetaItem>
                  </BlogMeta>

                  <AuthorInfo>
                    <AuthorAvatar
                      src={featuredBlog.author?.profile_picture}
                      alt={featuredBlog.author?.name}
                    />
                    <AuthorName>{featuredBlog.author?.name}</AuthorName>
                  </AuthorInfo>

                  <Text style={{ fontSize: 16, color: "#666", marginTop: 16 }}>
                    {featuredBlog.summary}
                  </Text>

                  <ReadMoreButton
                    onClick={() => navigate(`/blogs/slug/${featuredBlog.slug}`)}
                  >
                    Read more
                  </ReadMoreButton>
                </div>
              </div>
            </FeaturedCard>
          ) : null}

          {loading ? (
            <LoadingContainer>
              <Spin size="large" />
            </LoadingContainer>
          ) : (
            <BlogGrid>
              {topBlogs.map((blog) => (
                <BlogPost
                  key={blog._id}
                  onClick={() => navigate(`/blogs/slug/${blog.slug}`)}
                >
                  <BlogImage>
                    <img src={blog.coverImage} alt={blog.title} />
                  </BlogImage>
                  <BlogContent>
                    <BlogMeta>
                      <MetaItem
                        className="category"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (blog.category?.slug) {
                            navigate(`/blogs/category/${blog.category.slug}`);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {blog.category?.name || "Uncategorized"}
                      </MetaItem>
                      <MetaItem>
                        <ClockCircleOutlined />
                        {calculateReadTime(blog.summary)}
                      </MetaItem>
                      <MetaItem>
                        <EyeOutlined />
                        {blog.views} views
                      </MetaItem>
                      <MetaItem>{formatDate(blog.date)}</MetaItem>
                    </BlogMeta>
                    <AuthorInfo>
                      <AuthorAvatar
                        src={blog.author?.profile_picture}
                        alt={blog.author?.name}
                      />
                      <AuthorName>{blog.author?.name}</AuthorName>
                    </AuthorInfo>
                    <h3>{blog.title}</h3>
                    <p>{blog.summary}</p>
                    <ReadMoreLink>
                      Read more
                      <ArrowRightOutlined />
                    </ReadMoreLink>
                  </BlogContent>
                </BlogPost>
              ))}
            </BlogGrid>
          )}

          <ViewMoreSection>
            <ViewMoreButton onClick={() => navigate("/blogs/all-blogs")}>
              Xem thêm bài viết
              <ArrowRightOutlined />
            </ViewMoreButton>
          </ViewMoreSection>
        </ContentSection>
      </SectionCard>

      <SectionCard background="#f8f9fa">
        <ContentSection>
          <SectionTitle level={4}>Categories</SectionTitle>
          {loadingCategories ? (
            <LoadingContainer>
              <Spin size="large" />
            </LoadingContainer>
          ) : (
            <>
              <CategoriesScroll
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <CategoryCard
                      key={category._id}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <h3>{category.name}</h3>
                      {category.image && (
                        <img src={category.image} alt={category.name} />
                      )}
                    </CategoryCard>
                  ))
                ) : (
                  <div>No categories found</div>
                )}
              </CategoriesScroll>
            </>
          )}
        </ContentSection>
      </SectionCard>

      <SectionCard background="#fff">
        <RecipesSection>
          <SectionTitle level={4}>Featured recipes</SectionTitle>
          <RecipeDescription>
            Our team of professional chefs and nutritionists know how to make
            healthy eating delicious!
          </RecipeDescription>

          {loadingRecipes ? (
            <LoadingContainer>
              <Spin size="large" />
            </LoadingContainer>
          ) : (
            <RecipeCarousel>
              <CarouselButton direction="left" onClick={handlePrevRecipe}>
                <LeftOutlined />
              </CarouselButton>

              <CardsContainer>
                {getDisplayRecipes().map((recipe) => (
                  <RecipeCard
                    key={`${recipe._id}-${recipe.displayIndex}`}
                    isMiddle={recipe.isMiddle}
                    onClick={() => {
                      if (recipe.slug) {
                        navigate(`/recipes/slug/${recipe.slug}`);
                      } else {
                        handleCardClick(recipe.displayIndex);
                      }
                    }}
                  >
                    <img src={recipe.image} alt={recipe.title} />
                    <div className="content">
                      <h3>{recipe.title}</h3>
                      <p>{recipe.description}</p>
                      <RecipeStats>
                        <span>
                          <ClockCircleFilled />
                          {recipe.time}
                        </span>
                        <span>
                          <FireOutlined />
                          {recipe.calories} KCAL
                        </span>
                        <span>
                          <StarFilled />
                          {recipe.rating.toFixed(1)}
                        </span>
                      </RecipeStats>
                    </div>
                  </RecipeCard>
                ))}
              </CardsContainer>

              <CarouselButton direction="right" onClick={handleNextRecipe}>
                <RightOutlined />
              </CarouselButton>
            </RecipeCarousel>
          )}

          <Button
            type="default"
            size="large"
            onClick={() => navigate("/recipes")}
            style={{
              marginTop: 40,
              marginBottom: 40,
              height: 48,
              padding: "0 32px",
              borderRadius: 24,
              fontSize: 16,
              border: "2px solid #000",
            }}
          >
            See more recipes
          </Button>
        </RecipesSection>
      </SectionCard>
    </>
  );
};

export default HomeBlogPage;
