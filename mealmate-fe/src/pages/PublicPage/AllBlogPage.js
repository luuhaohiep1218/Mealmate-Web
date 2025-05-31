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
import { useNavigate, Link, useLocation } from "react-router-dom";
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

const HeroSection = styled.div`
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  padding: 60px 20px 40px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  h1 {
    color: white;
    margin-bottom: 8px;
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BlogGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 48px;

  > * {
    flex: 0 0 calc(33.333% - 16px);
    width: calc(33.333% - 16px);
  }

  @media (max-width: 1024px) {
    > * {
      flex: 0 0 calc(50% - 12px);
      width: calc(50% - 12px);
    }
  }

  @media (max-width: 768px) {
    > * {
      flex: 0 0 100%;
      width: 100%;
    }
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

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
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

const CardContent = styled.div`
  padding: 20px;

  .blog-summary {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #666;
    margin: 12px 0;
  }

  h4 {
    margin: 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 16px;
  font-size: 14px;
  margin-bottom: 12px;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c8e6c9;
  }
`;

const ReadMoreButton = styled.button`
  margin-top: 16px;
  padding: 0;
  height: auto;
  line-height: 1;
  border: none;
  background: none;
  color: #2e7d32;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #1b5e20;
  }

  .anticon {
    transition: transform 0.2s ease;
  }

  &:hover .anticon {
    transform: translateX(4px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;

  .anticon {
    color: #4caf50;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
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

const AllBlogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  // Tạo breadcrumb items dựa trên location
  const getBreadcrumbItems = () => {
    return [
      {
        title: (
          <Link to="/blogs">
            <ReadOutlined /> Blog
          </Link>
        ),
      },
      {
        title: "All Stories",
      },
    ];
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.blogs.list);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM DD, YYYY");
  };

  const calculateReadTime = (content) => {
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    if (category && category.slug) {
      navigate(`/blogs/category/${category.slug}`);
    }
  };

  return (
    <>
      <HeroSection>
        <Title level={1}>All stories</Title>
        <Text>Discover our latest articles and insights</Text>
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
                onClick={() => navigate(`/blogs/slug/${blog.slug}`)}
              >
                <ImageWrapper>
                  <img src={blog.coverImage} alt={blog.title} />
                </ImageWrapper>
                <CardContent>
                  <CategoryTag
                    onClick={(e) => handleCategoryClick(e, blog.category)}
                  >
                    {blog.category?.name || "Uncategorized"}
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
                  <ReadMoreButton>
                    Đọc thêm
                    <ArrowRightOutlined />
                  </ReadMoreButton>
                </CardContent>
              </BlogPost>
            ))}
          </BlogGrid>
        )}
      </ContentSection>
    </>
  );
};

export default AllBlogPage;
