import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Review } from "../types";
import { games } from "../data/games";
import { ReviewCard } from "../components/ReviewCard/ReviewCard";
import { AddReviewModal } from "../components/AddReviewModal/AddReviewModal";
import { Button } from "../components/Button/Button";
import "./GameDetails.css";

interface GameDetailsProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, "id">) => void;
  onUpdateReview: (id: string, data: Partial<Review>) => void;
  onDeleteReview: (id: string) => void;
}

export function GameDetails({
  reviews,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
}: GameDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const game = games.find((g) => g.id === id);

  const [editing, setEditing] = useState<Review | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!game) {
    return (
      <div>
        <p>Jogo não encontrado.</p>
        <Link to="/">Voltar</Link>
      </div>
    );
  }

  const gameReviews = reviews.filter((r) => r.gameId === game.id);

  return (
    <div className="details">
      <Link to="/">← Voltar</Link>

      <h2>{game.title}</h2>
      <div className="details-top">
        <img src={game.coverUrl} alt={game.title} className="details-cover" />
        <div className="details-synopsis">{game.synopsis}</div>
      </div>

      <div className="details-reviews">
        <div style={{ marginBottom: "16px" }}>
          <strong>Avaliações</strong>
        </div>
        {gameReviews.length === 0 && <p>Ainda sem avaliações. Seja o primeiro!</p>}
        {gameReviews.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            onEdit={setEditing}
            onDelete={onDeleteReview}
          />
        ))}
      </div>

      <div className="details-footer">
        <Button onClick={() => setIsAdding(true)}>+ Nova avaliação</Button>
      </div>

      <AddReviewModal
        game={editing || isAdding ? game : null}
        editing={editing}
        onClose={() => {
          setEditing(null);
          setIsAdding(false);
        }}
        onAdd={onAddReview}
        onUpdate={onUpdateReview}
      />
    </div>
  );
}
