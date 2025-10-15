import { useQuery } from "@tanstack/react-query";
import type { IReview } from "@/Interfaces/IReview";
import { API_BASE_URL } from "@/lib/api";

export async function getAllReviews(): Promise<IReview[]> {
  const response = await fetch(`${API_BASE_URL}/reviews`);
  if (!response.ok) throw new Error("Erro ao buscar reviews");
  return response.json();
}

export function useReviews() {
  return useQuery<IReview[]>({
    queryKey: ["reviews"],
    queryFn: getAllReviews,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export async function getReviewById(id: number): Promise<IReview> {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar review");
  return response.json();
}

export function useReview(id: number) {
  return useQuery<IReview>({
    queryKey: ["reviews", id],
    queryFn: () => getReviewById(id),
    enabled: !!id,
  });
}

export async function getReviewStatsByTurmaId(
  turmaId: number
): Promise<IReview[]> {
  const response = await fetch(`${API_BASE_URL}/reviews/turmas/${turmaId}`);
  if (!response.ok)
    throw new Error("Erro ao buscar estatísticas de reviews da turma");
  return response.json();
}

export function useReviewStatsByTurma(turmaId: number) {
  return useQuery<IReview[]>({
    queryKey: ["reviews", "turmas", turmaId],
    queryFn: () => getReviewStatsByTurmaId(turmaId),
    enabled: !!turmaId,
  });
}

export async function getReviewByDeckId(deckId: number): Promise<IReview[]> {
  const response = await fetch(`${API_BASE_URL}/reviews/decks/${deckId}`);
  if (!response.ok) throw new Error("Erro ao buscar reviews do deck");
  return response.json();
}

export function useReviewsByDeck(deckId: number) {
  return useQuery<IReview[]>({
    queryKey: ["reviews", "decks", deckId],
    queryFn: () => getReviewByDeckId(deckId),
    enabled: !!deckId,
  });
}
