import { useEffect, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Game, Review } from "../../types";
// import { api, queryKeys } from "../../api";
import { Button } from "../Button/Button";
import { StarRating } from "../StarRating/StarRating";
import { CounterRow } from "../CounterRow/CounterRow";
import "./AddReviewModal.css";

interface AddReviewModalProps {
  game: Game | null;
  editing?: Review | null;
  onClose: () => void;
  onAdd: (review: Omit<Review, "id">) => void;
  onUpdate?: (id: string, data: Partial<Review>) => void;
}

export function AddReviewModal({
  game,
  editing,
  onClose,
  onAdd,
  onUpdate,
}: AddReviewModalProps) {
  // const queryClient = useQueryClient();
  // const usersQuery = useQuery({
  //   queryKey: queryKeys.users,
  //   queryFn: api.getUsers,
  //   enabled: Boolean(game) && !editing,
  // });

  const [timesFinished, setTimesFinished] = useState(0);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState("Usuário 1");

  useEffect(() => {
    if (editing) {
      setTimesFinished(editing.timesFinished);
      setText(editing.text);
      setRating(editing.rating);
      setUserName(editing.userName);
    } else {
      setTimesFinished(0);
      setText("");
      setRating(5);
      setUserName("Usuário 1");
    }
  }, [editing, game]);

  // const createMutation = useMutation({
  //   mutationFn: (body: Parameters<typeof api.createReview>[1]) =>
  //     api.createReview(game!.id, body),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: queryKeys.reviews(game!.id) });
  //     onClose();
  //   },
  // });
  //
  // const updateMutation = useMutation({
  //   mutationFn: (body: Parameters<typeof api.updateReview>[1]) =>
  //     api.updateReview(editing!.id, body),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: queryKeys.reviews(game!.id) });
  //     onClose();
  //   },
  // });

  if (!game) return null;

  const gameId = game.id;
  const gameTitle = game.title;
  const gameCover = game.coverUrl;

  function handleConfirm() {
    if (!text.trim()) {
      alert("Escreva uma resenha!");
      return;
    }
    if (editing) {
      onUpdate?.(editing.id, { text, rating, timesFinished, userName });
    } else {
      onAdd({ gameId, text, rating, timesFinished, userName });
    }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <img src={gameCover} alt={gameTitle} className="modal-cover" />

          <div className="modal-form">
            <strong>{gameTitle}</strong>

            <CounterRow setTimesFinished={setTimesFinished} timesFinished={timesFinished} />

            <input
              className="modal-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Seu nome"
            />

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
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            {editing ? "Salvar" : "Confirmar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
