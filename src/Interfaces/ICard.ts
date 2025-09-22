import type { IReview } from "./IReview";

export interface ICard {
  id: number;
  front: string;
  back: string;
  imageUrl?: string;
  deckId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  reviews?: IReview[];
}
