export interface Game {
  id: string;
  title: string;
  coverUrl: string;
  synopsis: string;
}

export interface Review {
  id: string;
  gameId: string;
  userName: string;
  text: string;
  rating: number;
  timesFinished: number;
}
