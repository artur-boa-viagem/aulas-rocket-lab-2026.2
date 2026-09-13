import { useState } from "react";
import type { Game } from "../types";
import { games } from "../data/games";
import { GameCard } from "../components/GameCard/GameCard";
import { AddReviewModal } from "../components/AddReviewModal/AddReviewModal";
import "./Home.css";

// Tela principal (rota "/") — igual ao topo do Excalidraw.
export function Home() {
  // Qual jogo está com o modal aberto? null = nenhum.
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <div className="home">
      <div className="home-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onAddReview={setSelectedGame} />
        ))}
      </div>

      <AddReviewModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
