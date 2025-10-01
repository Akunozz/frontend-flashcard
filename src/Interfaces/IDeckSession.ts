import type { IReview } from "./IReview";

export interface IDeckSession {
  id: number;
  studentId: string;
  deckId: number;
  createdAt: string;
  reviews?: IReview[];
}
