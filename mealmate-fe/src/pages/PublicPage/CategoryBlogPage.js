import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography, Card, Spin, Breadcrumb } from "antd";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  HomeOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { api, endpoints } from "../../utils/axiosInstance";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import moment from "moment";

const { Title, Text } = Typography;

const BreadcrumbContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: center;

  .ant-breadcrumb {
    font-size: 16px;

    a {
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        color: white;
      }
    }

    .ant-breadcrumb-link {
      color: rgba(255, 255, 255, 0.85);
    }

    .ant-breadcrumb-separator {
      margin: 0 12px;
      color: rgba(255, 255, 255, 0.85);
    }

    span:last-child {
      color: rgba(255, 255, 255, 0.65);
    }
  }
`;

const StyledDescription = styled.div`
  font-size: 20px;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.2);
  padding: 12px 24px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  letter-spacing: 0.5px;
  font-weight: 500;
  width: 100%;
`;

const HeroSection = styled.div`
  position: relative;
  padding: 80px 20px 60px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  min-height: 400px;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${(props) =>
      props.backgroundImage
        ? `url(${props.backgroundImage})`
        : "linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)"};
    background-size: cover;
    background-position: center;
    filter: brightness(0.6);
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
    z-index: 2;
  }

  h1,
  div {
    position: relative;
    z-index: 3;
  }

  h1 {
    color: white;
    margin-bottom: 0;
    font-size: 48px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 240px;
  overflow: hidden;
  position: relative;

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

const CardContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;

  .blog-summary {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #666;
    margin: 12px 0;
    font-size: 16px;
    line-height: 1.6;
    flex-grow: 1;
  }

  h4 {
    margin: 12px 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
    color: #2c3e50;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CategoryTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: #c8e6c9;
    transform: translateY(-1px);
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
  border-top: 1px solid #eee;
  padding-top: 16px;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;

  .anticon {
    color: #4caf50;
    font-size: 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
`;

const AuthorAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AuthorName = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const CategoryBlogPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetchCategoryAndBlogs();
  }, [slug]);

  const fetchCategoryAndBlogs = async () => {
    try {
      setLoading(true);

      // Đầu tiên, lấy thông tin category dựa trên slug
      const categoriesResponse = await api.get(endpoints.blogCategories.list);
      const categories = Array.isArray(categoriesResponse.data)
        ? categoriesResponse.data
        : categoriesResponse;

      const currentCategory = categories.find((cat) => cat.slug === slug);

      if (!currentCategory) {
        navigate("/blogs/all-blogs");
        return;
      }

      setCategory(currentCategory);

      // Sau đó lấy các blogs thuộc category đó bằng ID
      const blogsResponse = await api.get(
        `${endpoints.blogs.list}?category=${currentCategory._id}`
      );
      setBlogs(blogsResponse.data || []);
    } catch (error) {
      console.error("Error fetching category blogs:", error);
      navigate("/blogs/all-blogs");
    } finally {
      setLoading(false);
    }
  };

  const getBreadcrumbItems = () => {
    return [
      {
        title: (
          <Link to="/blogs">
            <HomeOutlined /> Blog
          </Link>
        ),
      },
      {
        title: (
          <Link to="/blogs/all-blogs">
            <ReadOutlined /> All Stories
          </Link>
        ),
      },
      {
        title: category?.name || "Category",
      },
    ];
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM DD, YYYY");
  };

  const calculateReadTime = (content) => {
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const handleCategoryClick = (e, categoryId) => {
    e.stopPropagation();
    // Tìm category slug từ ID để điều hướng
    const targetCategory = category?._id === categoryId ? category : null;
    if (targetCategory) {
      navigate(`/blogs/category/${targetCategory.slug}`);
    }
  };

  return (
    <>
      <HeroSection backgroundImage={category?.image}>
        <Title level={1}>{category?.name || "Category"}</Title>
        <StyledDescription>
          {category?.description || "Exploring stories in this category"}
        </StyledDescription>
        <BreadcrumbContainer>
          <Breadcrumb items={getBreadcrumbItems()} />
        </BreadcrumbContainer>
      </HeroSection>

      <ContentSection>
        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        ) : (
          <BlogGrid>
            {blogs.map((blog) => (
              <BlogPost
                key={blog._id}
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                <ImageWrapper>
                  <img src={blog.coverImage} alt={blog.title} />
                </ImageWrapper>
                <CardContent>
                  <CategoryTag
                    onClick={(e) => handleCategoryClick(e, blog.category?._id)}
                  >
                    {category?.name || "Uncategorized"}
                  </CategoryTag>
                  <Title level={4}>{blog.title}</Title>
                  <Text className="blog-summary">{blog.summary}</Text>
                  <MetaInfo>
                    <MetaItem>
                      <ClockCircleOutlined />
                      {calculateReadTime(blog.summary)}
                    </MetaItem>
                    <MetaItem>
                      <EyeOutlined />
                      {blog.views} views
                    </MetaItem>
                    <MetaItem>{formatDate(blog.date)}</MetaItem>
                  </MetaInfo>
                  <AuthorInfo>
                    <AuthorAvatar
                      src={blog.author?.profile_picture}
                      alt={blog.author?.name}
                    />
                    <AuthorName>{blog.author?.name}</AuthorName>
                  </AuthorInfo>
                </CardContent>
              </BlogPost>
            ))}
          </BlogGrid>
        )}
      </ContentSection>
    </>
  );
};

export default CategoryBlogPage;
