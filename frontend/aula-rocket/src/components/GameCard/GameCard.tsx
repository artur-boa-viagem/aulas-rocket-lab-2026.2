import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../../types";
import { Button } from "../Button/Button";
import "./GameCard.css";

interface GameCardProps {
  game: Game;
  onAddReview: (game: Game) => void; // abre o modal (estado fica na Home)
}

// Molécula: combina átomos (Button + img + título).
export function GameCard({ game, onAddReview }: GameCardProps) {
  const navigate = useNavigate();
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="game-card">
      <h2 className="game-card-title">{game.title}</h2>

      {imgOk ? (
        <img
          src={game.coverUrl}
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
        {/* Rota /jogos/:id — ver react-router-dom no App.tsx */}
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
