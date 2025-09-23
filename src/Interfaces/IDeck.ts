import type { ICard } from "./ICard";
import type { IDeckSession } from "./IDeckSession";

export interface IDeck {
  id: number;
  title: string;
  description?: string;
  turmaId: number;
  cards?: ICard[];
  sessions?: IDeckSession[];
}
