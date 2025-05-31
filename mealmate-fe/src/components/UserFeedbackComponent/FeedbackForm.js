import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const FeedbackForm = ({ recipeId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Vui lòng chọn số sao.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/feedback", {
        recipe: recipeId,
        rating,
        comment,
      });

      const newFeedback = res.data;

      setMessage("Gửi đánh giá thành công!");
      setRating(0);
      setComment("");

      if (onSubmitted) onSubmitted(newFeedback);

      // Tự động ẩn message sau 3 giây
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Label>Đánh giá của bạn (1–5 sao):</Label>
      <StarSelector>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            active={star <= rating}
            onClick={() => setRating(star)}
          >
            ★
          </Star>
        ))}
      </StarSelector>

      <Label>Nhận xét:</Label>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Cảm nghĩ của bạn về món ăn này..."
      />

      <SubmitButton type="submit" disabled={submitting || rating === 0}>
        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
      </SubmitButton>

      {message && <Message>{message}</Message>}
      {error && <Error>{error}</Error>}
    </FormWrapper>
  );
};

export default FeedbackForm;

// Styled
const FormWrapper = styled.form`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 500;
  margin: 0.5rem 0;
`;

const StarSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Star = styled.span`
  font-size: 2rem;
  cursor: pointer;
  color: ${(props) => (props.active ? "#ffc107" : "#ddd")};
  transition: color 0.2s;
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 500px;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #1e88e5;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  font-weight: 500;
  color: #2e7d32;
`;

const Error = styled.p`
  margin-top: 1rem;
  font-weight: 500;
  color: #d32f2f;
`;
