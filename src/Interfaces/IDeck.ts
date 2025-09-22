import type { ICard } from "./ICard";
import type { IDeckSession } from "./IDeckSession";

export interface IDeck {
  id: number;
  title: string;
  description?: string;
  turmaId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  cards?: ICard[];
  sessions?: IDeckSession[];
}
