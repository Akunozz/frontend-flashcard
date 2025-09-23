import { API_BASE_URL } from "@/lib/api";
import type { IDeck } from "@/Interfaces/IDeck";

export interface DeckCreateDTO {
  title: string;
  description?: string;
  turmaId: number;
}

export interface DeckUpdateDTO {
  title?: string;
  description?: string;
}

export async function reqCreateDeck(data: DeckCreateDTO): Promise<IDeck> {
  const response = await fetch(`${API_BASE_URL}/decks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao criar deck");
  return await response.json();
}

export async function reqGetAllDecks(): Promise<IDeck[]> {
  const response = await fetch(`${API_BASE_URL}/decks`);
  if (!response.ok) throw new Error("Erro ao buscar decks");
  return await response.json();
}



export async function reqGetDeckById(id: number): Promise<IDeck> {
  const response = await fetch(`${API_BASE_URL}/decks/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar deck");
  return await response.json();
}

export async function reqUpdateDeck(id: number, data: DeckUpdateDTO): Promise<IDeck> {
  const response = await fetch(`${API_BASE_URL}/decks/${id}` , {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar deck");
  return await response.json();
}

export async function reqDeleteDeck(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/decks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao deletar deck");
}

export async function reqGetDecksByTurmaId(turmaId: number): Promise<IDeck[]> {
  const response = await fetch(`${API_BASE_URL}/decks/turma/${turmaId}`);
  if (!response.ok) throw new Error("Erro ao buscar decks da turma");
  return await response.json();
}