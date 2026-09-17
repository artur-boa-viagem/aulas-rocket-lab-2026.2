import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Game, Review } from "../../types";
import { api, queryKeys } from "../../api";
import { Button } from "../Button/Button";
import { StarRating } from "../StarRating/StarRating";
import { CounterRow } from "../CounterRow/CounterRow";
import "./AddReviewModal.css";

interface AddReviewModalProps {
  game: Game | null;
  editing?: Review | null;
  onClose: () => void;
}

export function AddReviewModal({ game, editing, onClose }: AddReviewModalProps) {
  const queryClient = useQueryClient();
  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: api.getUsers,
    enabled: Boolean(game) && !editing,
  });

  const [timesFinished, setTimesFinished] = useState(0);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [userId, setUserId] = useState<number | "">("");

  useEffect(() => {
    if (editing) {
      setTimesFinished(editing.times_completed);
      setText(editing.review_text ?? "");
      setRating(editing.rating);
      setUserId(editing.user_id);
    } else {
      setTimesFinished(0);
      setText("");
      setRating(5);
      setUserId(usersQuery.data?.[0]?.id ?? "");
    }
  }, [editing, game, usersQuery.data]);

  const createMutation = useMutation({
    mutationFn: (body: Parameters<typeof api.createReview>[1]) =>
      api.createReview(game!.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(game!.id) });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (body: Parameters<typeof api.updateReview>[1]) =>
      api.updateReview(editing!.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(game!.id) });
      onClose();
    },
  });

  if (!game) return null;

  const pending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error ?? updateMutation.error;

  function handleConfirm() {
    if (!text.trim()) {
      alert("Escreva uma resenha!");
      return;
    }
    if (editing) {
      updateMutation.mutate({
        review_text: text,
        rating,
        times_completed: timesFinished,
      });
      return;
    }
    if (userId === "") {
      alert("Escolha um usuário!");
      return;
    }
    createMutation.mutate({
      user_id: userId,
      review_text: text,
      rating,
      times_completed: timesFinished,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          {game.cover_url && (
            <img src={game.cover_url} alt={game.title} className="modal-cover" />
          )}

          <div className="modal-form">
            <strong>{game.title}</strong>

            <CounterRow setTimesFinished={setTimesFinished} timesFinished={timesFinished} />

            {editing ? (
              <input className="modal-input" value={editing.user_name} disabled />
            ) : (
              <select
                className="modal-input"
                value={userId}
                onChange={(e) => setUserId(Number(e.target.value))}
              >
                {usersQuery.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            )}

            <textarea
              className="modal-textarea"
              placeholder="Resenha do usuário"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />

            <div className="rating-row">
              <span>Rating</span>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {error && <p className="modal-error">{error.message}</p>}
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={pending}>
            {editing ? "Salvar" : "Confirmar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
