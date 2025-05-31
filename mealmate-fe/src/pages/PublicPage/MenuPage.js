import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios"; // axios để gọi API

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [tagList, setTagList] = useState(["All"]); // khởi tạo rỗng hoặc chỉ có "All"

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:8000/api/menus";
        if (activeTag && activeTag !== "All") {
          const tagQuery = activeTag.toLowerCase();
          url += `?tags=${tagQuery}`;
        }

        const response = await axios.get(url);
        setMenus(response.data.data);

        if (response.data.tags) {
          setTagList(["All", ...response.data.tags.map((t) => capitalize(t))]);
        }
      } catch (err) {
        setError("Danh sách thực đơn trống.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [activeTag]);

  return (
    <PageContainer>
      <Title>Gợi Ý Thực Đơn</Title>
      <FilterBar>
        {tagList.map((tag) => (
          <TagButton
            key={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </TagButton>
        ))}
      </FilterBar>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <MenuGrid>
          {menus.map((menu) => (
            <MenuCard key={menu._id}>
              <ImageWrapper>
                <img src={"/images/menu-placeholder.jpg"} alt={menu.name} />
              </ImageWrapper>
              <MenuInfo>
                <MenuTitle>{menu.name}</MenuTitle>
                <MenuDesc>{menu.description}</MenuDesc>
                <MetaRow>
                  <TimeDifficulty>
                    <span>{menu.time}</span>
                    <span>{menu.difficulty}</span>
                  </TimeDifficulty>
                  <ViewButtonWrapper>
                    <Link to={`/menus/${menu._id}`}>
                      <ReadMoreButton>XEM CHI TIẾT</ReadMoreButton>
                    </Link>
                  </ViewButtonWrapper>
                </MetaRow>
              </MenuInfo>
            </MenuCard>
          ))}
        </MenuGrid>
      )}
    </PageContainer>
  );
};
export default MenuPage;
const PageContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MenuCard = styled.div`
  background: #fff;
  border-radius: 20px; /* Bo góc mềm hơn */
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MenuInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
`;

const MenuTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
`;

const MenuDesc = styled.p`
  font-size: 1rem;
  color: #555;
`;
// New styled components for the button
const ViewButtonWrapper = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
`;

const TimeDifficulty = styled.div`
  display: flex;
  gap: 1rem;
  font-weight: 500;
`;

const ReadMoreButton = styled.button`
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
const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
`;

const TagButton = styled.button`
  background: ${({ active }) => (active ? "#A7E52F" : "#f5f2ec")};
  color: ${({ active }) => (active ? "#000" : "#000")};
  border: 1.5px solid ${({ active }) => (active ? "#A7E52F" : "#c9cfc9")};
  padding: 0.5rem 1.4rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: ${({ active }) =>
    active ? "0 0 0 1.5px #A7E52F" : "0 0 0 1px #c9cfc9"};

  &:hover {
    background: #A7E52F;
    color: #000;
    border-color: #A7E52F;
  }

  &:disabled {
    background: #f0eee9;
    color: #999;
    border-color: #ddd;
    cursor: not-allowed;
  }
`;

