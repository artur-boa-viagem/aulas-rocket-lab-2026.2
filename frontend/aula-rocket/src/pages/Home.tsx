import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
import type { Game, Review } from "../types";
import { games } from "../data/games";
// import { api, queryKeys } from "../api";
import { GameCard } from "../components/GameCard/GameCard";
import { AddReviewModal } from "../components/AddReviewModal/AddReviewModal";
import "./Home.css";

interface HomeProps {
  onAddReview: (review: Omit<Review, "id">) => void;
}

export function Home({ onAddReview }: HomeProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // const gamesQuery = useQuery({
  //   queryKey: queryKeys.games,
  //   queryFn: api.getGames,
  // });
  //
  // if (gamesQuery.isPending) return <p>Carregando jogos...</p>;
  // if (gamesQuery.isError) {
  //   return <p>Não foi possível carregar os jogos: {gamesQuery.error.message}</p>;
  // }

  return (
    <div className="home">
      <div className="home-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onAddReview={setSelectedGame} />
        ))}
      </div>

      <AddReviewModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onAdd={onAddReview}
      />
    </div>
  );
}
