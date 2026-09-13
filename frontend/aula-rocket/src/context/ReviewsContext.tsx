import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Review } from "../types";
import { initialReviews } from "../data/games";

// ============================================================
// Aula: useContext vs prop drilling
// ------------------------------------------------------------
// Sem contexto, teríamos que passar `reviews`, `addReview` etc.
// via props em TODOS os níveis (App -> Home -> GameCard -> Modal).
// Isso se chama "prop drilling".
// O Context deixa qualquer componente pegar o valor direto.
// ============================================================

interface ReviewsContextValue {
  reviews: Review[];
  getReviewsByGame: (gameId: string) => Review[];
  addReview: (review: Omit<Review, "id">) => void;
  updateReview: (id: string, data: Partial<Review>) => void;
  deleteReview: (id: string) => void;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  // useState: quando muda, o React RE-RENDERIZA quem usa o valor.
  // (Diferente de `let`, que muda mas a tela não atualiza — demonstrar em aula!)
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  function getReviewsByGame(gameId: string): Review[] {
    return reviews.filter((r) => r.gameId === gameId);
  }

  function addReview(data: Omit<Review, "id">) {
    const newReview: Review = {
      ...data,
      id: `r-${Date.now()}`,
    };
    setReviews((prev) => [newReview, ...prev]);
  }

  function updateReview(id: string, data: Partial<Review>) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r)),
    );
  }

  function deleteReview(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <ReviewsContext.Provider
      value={{ reviews, getReviewsByGame, addReview, updateReview, deleteReview }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

// Hook customizado: esconde o `useContext` + checagem de null.
export function useReviews(): ReviewsContextValue {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews deve ser usado dentro de <ReviewsProvider>");
  return ctx;
}
