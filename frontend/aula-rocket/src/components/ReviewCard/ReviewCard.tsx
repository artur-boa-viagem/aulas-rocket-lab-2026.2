import type { Review } from "../../types";
import { StarRating } from "../StarRating/StarRating";
import "./ReviewCard.css";

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <div className="review-card">
      <div className="review-header">
        <strong>{review.userName}</strong>
        <StarRating value={review.rating} size={16} />
      </div>
      <p className="review-text">{review.text}</p>
      <span className="review-meta">Zerou {review.timesFinished}x</span>

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
          onClick={() => {
            if (confirm("Excluir esta avaliação?")) onDelete(review.id);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
