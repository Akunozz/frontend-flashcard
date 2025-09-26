import { API_BASE_URL } from "@/lib/api";
import type { ICard } from "@/Interfaces/ICard";

export async function reqCreateCard(data: ICard): Promise<ICard> {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao criar carta");
  return await response.json();
}

export async function reqGetCardsByDeck(deckId: number): Promise<ICard[]> {
  const response = await fetch(`${API_BASE_URL}/cards/deck/${deckId}`);
  if (!response.ok) throw new Error("Erro ao buscar cartas");
  return await response.json();
}

export async function reqUpdateCard(id: number, data: Partial<ICard>): Promise<ICard> {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar carta");
  return await response.json();
}

export async function reqDeleteCard(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
    method: "DELETE" });
  if (!response.ok) throw new Error("Erro ao deletar carta");
}
