import type { IReview } from "./IReview";

export interface IDeckSession {
  id: number;
  studentId: string;
  deckId: number;
  createdAt: string; // ISO date string
  reviews?: IReview[];
}
