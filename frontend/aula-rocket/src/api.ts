// TanStack/API client — unused while the app runs on mock data.
// FetchWithUseffect.tsx is the only live API caller.
/*
import type { Game, Review, ReviewCreate, ReviewUpdate, User } from "./types";

const API = "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function detailMessage(data: unknown, status: number): string {
  if (data && typeof data === "object" && "detail" in data) {
    const detail = (data as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
  }
  return `HTTP ${status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 204) return undefined as T;

  const data: unknown = await res.json().catch(() => undefined);
  if (!res.ok) throw new ApiError(res.status, detailMessage(data, res.status));
  return data as T;
}

export const api = {
  getUsers: () => request<User[]>("/users"),
  getGames: () => request<Game[]>("/games"),
  getGame: (id: number) => request<Game>(`/games/${id}`),
  getReviews: (gameId: number) => request<Review[]>(`/games/${gameId}/reviews`),
  createReview: (gameId: number, body: ReviewCreate) =>
    request<Review>(`/games/${gameId}/reviews`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateReview: (reviewId: number, body: ReviewUpdate) =>
    request<Review>(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteReview: (reviewId: number) =>
    request<void>(`/reviews/${reviewId}`, { method: "DELETE" }),
};

export const queryKeys = {
  users: ["users"] as const,
  games: ["games"] as const,
  game: (id: number) => ["games", id] as const,
  reviews: (gameId: number) => ["games", gameId, "reviews"] as const,
};
*/

export {};

