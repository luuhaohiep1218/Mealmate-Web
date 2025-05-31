import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";

const FeedbackList = ({ recipeId, newFeedbacks = [] }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/feedback/${recipeId}`
        );
        const fetched = res.data;

        const filteredFetched = fetched.filter(
          (f) => !newFeedbacks.some((nf) => nf._id === f._id)
        );

        setFeedbacks([...newFeedbacks, ...filteredFetched]);
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [recipeId, newFeedbacks]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p>Đang tải đánh giá...</p>;

  return (
    <ListWrapper>
      <Title>📢 Đánh giá từ người dùng</Title>
      {currentFeedbacks.length === 0 ? (
        <Empty>Chưa có đánh giá nào.</Empty>
      ) : (
        currentFeedbacks.map((fb) => (
          <FeedbackCard key={fb._id}>
            <UserInfo>
              <Avatar
                src={fb.user?.profile_picture || "/images/default-avatar.png"}
                alt="avatar"
              />
              <div>
                <strong>{fb.user?.full_name || "Ẩn danh"}</strong>
                <DateText>
                  {new Date(fb.createdAt).toLocaleDateString("vi-VN")}
                </DateText>
              </div>
            </UserInfo>
            <Stars>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={18}
                  color={i < fb.rating ? "#facc15" : "#e4e4e4"}
                />
              ))}
            </Stars>
            <Comment>{fb.comment || <i>(Không có nhận xét)</i>}</Comment>
          </FeedbackCard>
        ))
      )}

      {totalPages > 1 && (
        <Pagination>
          <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </PageButton>
          {[...Array(totalPages)].map((_, i) => (
            <PageButton
              key={i}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </PageButton>
        </Pagination>
      )}
    </ListWrapper>
  );
};

export default FeedbackList;

// Styled Components
const ListWrapper = styled.div`
  margin-top: 3rem;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #444;
`;

const Empty = styled.p`
  color: #777;
`;

const FeedbackCard = styled.div`
  background: #fafafa;
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const DateText = styled.div`
  font-size: 0.85rem;
  color: #888;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
`;

const Comment = styled.p`
  font-size: 1rem;
  color: #333;
`;

const Pagination = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  background-color: ${({ active }) => (active ? "#4caf50" : "#eee")};
  color: ${({ active }) => (active ? "white" : "#333")};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
