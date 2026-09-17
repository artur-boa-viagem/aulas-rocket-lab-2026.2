import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Review } from "../types";
import { api, queryKeys } from "../api";
import { ReviewCard } from "../components/ReviewCard/ReviewCard";
import { AddReviewModal } from "../components/AddReviewModal/AddReviewModal";
import { Button } from "../components/Button/Button";
import "./GameDetails.css";

export function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const gameId = Number(id);
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<Review | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const gameQuery = useQuery({
    queryKey: queryKeys.game(gameId),
    queryFn: () => api.getGame(gameId),
    enabled: Number.isInteger(gameId) && gameId > 0,
  });

  const reviewsQuery = useQuery({
    queryKey: queryKeys.reviews(gameId),
    queryFn: () => api.getReviews(gameId),
    enabled: Number.isInteger(gameId) && gameId > 0,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteReview,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(gameId) }),
  });

  if (!Number.isInteger(gameId) || gameId <= 0) {
    return (
      <div>
        <p>Jogo não encontrado.</p>
        <Link to="/">Voltar</Link>
      </div>
    );
  }

  if (gameQuery.isPending) return <p>Carregando jogo...</p>;
  if (gameQuery.isError) {
    return (
      <div>
        <p>{gameQuery.error.message}</p>
        <Link to="/">Voltar</Link>
      </div>
    );
  }

  const game = gameQuery.data;
  const reviews = reviewsQuery.data ?? [];

  return (
    <div className="details">
      <Link to="/">← Voltar</Link>

      <h2>{game.title}</h2>
      <div className="details-top">
        {game.cover_url ? (
          <img src={game.cover_url} alt={game.title} className="details-cover" />
        ) : (
          <div className="details-cover">{game.title.charAt(0)}</div>
        )}
        <div className="details-synopsis">{game.synopsis}</div>
      </div>

      <div className="details-reviews">
        <div style={{ marginBottom: "16px" }}>
          <strong>Avaliações</strong>
        </div>
        {reviewsQuery.isPending && <p>Carregando avaliações...</p>}
        {reviewsQuery.isError && <p>{reviewsQuery.error.message}</p>}
        {deleteMutation.isError && <p>{deleteMutation.error.message}</p>}
        {!reviewsQuery.isPending && reviews.length === 0 && (
          <p>Ainda sem avaliações. Seja o primeiro!</p>
        )}
        {reviews.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            onEdit={setEditing}
            onDelete={(reviewId) => {
              if (confirm("Excluir esta avaliação?")) deleteMutation.mutate(reviewId);
            }}
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
      />
    </div>
  );
}
