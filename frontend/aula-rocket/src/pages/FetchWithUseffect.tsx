import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button/Button";
import "./GameDetails.css";

const API = "http://127.0.0.1:8000";
const GAME_IDS = [1, 2, 3] as const;
const GAME_MAPPING = {
  1: "Zelda",
  2: "GOW",
  3: "Minecraft"
}

type ApiGame = {
  id: number;
  title: string;
  synopsis: string | null;
  cover_url: string | null;
};

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export const FetchWithUseffect = () => {
  const [gameId, setGameId] = useState<number | null>(null);
  const [game, setGame] = useState<ApiGame | null>(null);

  const [loading, setLoading] = useState(false);

  // Classroom: no ignore/cancelled flag. A slower GET /games/1 can land after
  // GET /games/3 and replace the title the student just saw.
  useEffect(() => {
    if (gameId == null) return;

    setLoading(true);
    async function fetchGame() {
      try {
        const game = await fetchData<ApiGame>(`${API}/games/${gameId}`);
        setGame(game);
      } catch (error) {
        setGame(null);
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [gameId]);

  return (
    <div className="details">
      <Link to="/">← Voltar</Link>
      <h2>{"Demo: GET /games/{id}"}</h2>
      <p>
        Clique rápido em 1 e depois em 3. Sem cancelar o fetch antigo, a resposta
        lenta do jogo 1 pode sobrescrever o jogo 3.
      </p>

      <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
        {GAME_IDS.map((id) => (
          <Button
            key={id}
            aria-pressed={gameId === id}
            onClick={() => setGameId(id)}
            style={gameId === id ? { background: "#111", color: "#fff" } : undefined}
          >
            {GAME_MAPPING[id]}
          </Button>
        ))}
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : game ? (
        <div className="details-top">
          {game.cover_url && (
            <img src={game.cover_url} alt={game.title} className="details-cover" />
          )}
          <div className="details-synopsis">
            <strong>{game.title}</strong>
            <p>{game.synopsis}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
