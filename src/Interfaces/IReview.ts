export interface IReview {
  id: number;
  sessionId: number;
  cardId: number;
  result: string; // ReviewResult (enum/valor)
  createdAt: string; // ISO date string
}
