import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import type { Review } from "./types";
import { initialReviews } from "./data/games";
import { Home } from "./pages/Home";
import { GameDetails } from "./pages/GameDetails";
import { FetchWithUseffect } from "./pages/FetchWithUseffect";
import "./index.css";

function App() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  function addReview(data: Omit<Review, "id">) {
    setReviews((prev) => [{ ...data, id: `r-${Date.now()}` }, ...prev]);
  }

  function updateReview(id: string, data: Partial<Review>) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }

  function deleteReview(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <BrowserRouter>
      <header className="app-header">
        <Link to="/" className="app-logo">
          🎮 Game Reviews
        </Link>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home onAddReview={addReview} />} />
          <Route
            path="/jogos/:id"
            element={
              <GameDetails
                reviews={reviews}
                onAddReview={addReview}
                onUpdateReview={updateReview}
                onDeleteReview={deleteReview}
              />
            }
          />
          <Route path="/fetch-with-useEffect" element={<FetchWithUseffect />} />
          <Route
            path="*"
            element={
              <p>
                Página não encontrada. <Link to="/">Voltar</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
