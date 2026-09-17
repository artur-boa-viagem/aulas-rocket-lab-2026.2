export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Game {
  id: number;
  title: string;
  synopsis: string | null;
  cover_url: string | null;
}

export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  game_id: number;
  rating: number;
  review_text: string | null;
  times_completed: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewCreate {
  user_id: number;
  rating: number;
  review_text: string | null;
  times_completed: number;
}

export interface ReviewUpdate {
  rating?: number;
  review_text?: string | null;
  times_completed?: number;
}
