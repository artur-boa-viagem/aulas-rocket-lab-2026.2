import type { Review } from "../../types";
import { StarRating } from "../StarRating/StarRating";
import "./ReviewCard.css";

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <div className="review-card">
      <div className="review-header">
        <strong>{review.user_name}</strong>
        <StarRating value={review.rating} size={16} />
        <div className="review-actions">
          <button
            className="icon-btn"
            title="Editar"
            onClick={() => onEdit(review)}
          >
            ✏️
          </button>
          <button
            className="icon-btn danger"
            title="Excluir"
            onClick={() => onDelete(review.id)}
          >
            🗑️
          </button>
        </div>
      </div>
      <p className="review-text">{review.review_text}</p>
      <span className="review-meta">Zerou {review.times_completed}x</span>
    </div>
  );
}
