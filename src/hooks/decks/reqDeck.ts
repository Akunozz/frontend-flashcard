import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Hook para criar deck
export function useCreateDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reqCreateDeck,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["decksByTurma", variables.turmaId] });
    },
  });
}

// Hook para buscar todos os decks
export function useGetAllDecks() {
  return useQuery<IDeck[]>({
    queryKey: ["allDecks"],
    queryFn: reqGetAllDecks,
  });
}

// Hook para buscar deck por id
export function useGetDeckById(id: number) {
  return useQuery<IDeck>({
    queryKey: ["deckById", id],
    queryFn: () => reqGetDeckById(id),
    enabled: !!id,
  });
}

// Hook para atualizar deck
export function useUpdateDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DeckUpdateDTO }) => reqUpdateDeck(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deckById", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["decksByTurma"] });
    },
  });
}

// Hook para deletar deck
export function useDeleteDeck(turmaId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reqDeleteDeck,
    onSuccess: () => {
      if (turmaId) queryClient.invalidateQueries({ queryKey: ["decksByTurma", turmaId] });
      queryClient.invalidateQueries({ queryKey: ["allDecks"] });
    },
  });
}

// Hook para buscar decks por turma
export function useGetDecksByTurmaId(turmaId: number) {
  return useQuery<IDeck[]>({
    queryKey: ["decksByTurma", turmaId],
    queryFn: () => reqGetDecksByTurmaId(turmaId),
    enabled: !!turmaId,
  });
}
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