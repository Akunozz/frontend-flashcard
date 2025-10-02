import { useQuery } from "@tanstack/react-query";
import type { IReview } from "@/Interfaces/IReview";
import { API_BASE_URL } from "@/lib/api";

// Interface para as estatísticas de reviews por turma
export interface IReviewStats {
  cardId: number;
  correct: number;
  incorrect: number;
}

// GET /reviews - buscar todas as reviews
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

// GET /reviews/:id - buscar review por ID
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

// GET /reviews/turmas/:turmaId - buscar estatísticas de reviews por turma
export async function getReviewStatsByTurmaId(turmaId: number): Promise<IReviewStats[]> {
  const response = await fetch(`${API_BASE_URL}/reviews/turmas/${turmaId}`);
  if (!response.ok) throw new Error("Erro ao buscar estatísticas de reviews da turma");
  return response.json();
}

export function useReviewStatsByTurma(turmaId: number) {
  return useQuery<IReviewStats[]>({
    queryKey: ["reviews", "turmas", turmaId],
    queryFn: () => getReviewStatsByTurmaId(turmaId),
    enabled: !!turmaId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
