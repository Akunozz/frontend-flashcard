export interface IReview {
  id: number;
  sessionId: number;
  cardId: number;
  result: "CORRECT" | "INCORRECT";
  createdAt: string; // ISO date string
}
