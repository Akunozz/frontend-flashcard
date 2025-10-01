import { API_BASE_URL } from "@/lib/api";
import type { ICard } from "@/Interfaces/ICard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Hook para criar card
export function useCreateCard(deckId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reqCreateCard,
    onSuccess: () => {
      if (deckId)
        queryClient.invalidateQueries({ queryKey: ["cardsByDeck", deckId] });
    },
  });
}

// Hook para buscar cards por deck
export function useGetCardsByDeck(deckId: number) {
  return useQuery<ICard[]>({
    queryKey: ["cardsByDeck", deckId],
    queryFn: () => reqGetCardsByDeck(deckId),
    enabled: !!deckId,
  });
}

// Hook para atualizar card
export function useUpdateCard(deckId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ICard> }) =>
      reqUpdateCard(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cardsByDeck", deckId] });
      queryClient.invalidateQueries({ queryKey: ["cardById", variables.id] });
    },
  });
}

// Hook para deletar card
export function useDeleteCard(deckId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reqDeleteCard,
    onSuccess: () => {
      if (deckId)
        queryClient.invalidateQueries({ queryKey: ["cardsByDeck", deckId] });
    },
  });
}

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

export async function reqUpdateCard(
  id: number,
  data: Partial<ICard>
): Promise<ICard> {
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
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao deletar carta");
}
