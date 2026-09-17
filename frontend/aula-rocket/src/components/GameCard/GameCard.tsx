import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../../types";
import { Button } from "../Button/Button";
import "./GameCard.css";

interface GameCardProps {
  game: Game;
  onAddReview: (game: Game) => void;
}

export function GameCard({ game, onAddReview }: GameCardProps) {
  const navigate = useNavigate();
  const [imgOk, setImgOk] = useState(true);
  const cover = game.cover_url;

  return (
    <div className="game-card">
      <h2 className="game-card-title">{game.title}</h2>

      {cover && imgOk ? (
        <img
          src={cover}
          alt={`Capa de ${game.title}`}
          className="game-card-cover"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="game-card-cover fallback">
          {game.title.charAt(0)}
        </div>
      )}

      <div className="game-card-actions">
        <Button variant="secondary" onClick={() => navigate(`/jogos/${game.id}`)}>
          Ver detalhes
        </Button>
        <Button variant="secondary" onClick={() => onAddReview(game)}>
          Add avaliações
        </Button>
      </div>
    </div>
  );
}
