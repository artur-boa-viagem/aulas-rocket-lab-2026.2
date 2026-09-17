import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Game } from "../types";
import { api, queryKeys } from "../api";
import { GameCard } from "../components/GameCard/GameCard";
import { AddReviewModal } from "../components/AddReviewModal/AddReviewModal";
import "./Home.css";

export function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const gamesQuery = useQuery({
    queryKey: queryKeys.games,
    queryFn: api.getGames,
  });

  if (gamesQuery.isPending) return <p>Carregando jogos...</p>;
  if (gamesQuery.isError) {
    return <p>Não foi possível carregar os jogos: {gamesQuery.error.message}</p>;
  }

  return (
    <div className="home">
      <div className="home-grid">
        {gamesQuery.data.map((game) => (
          <GameCard key={game.id} game={game} onAddReview={setSelectedGame} />
        ))}
      </div>

      <AddReviewModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
