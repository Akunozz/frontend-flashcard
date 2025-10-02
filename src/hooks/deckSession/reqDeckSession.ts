import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ICard } from "@/Interfaces/ICard";
import type { IDeckSession } from "@/Interfaces/IDeckSession";
import { API_BASE_URL } from "@/lib/api";


// GET /deck-sessions/decks/:deckId/cards
export async function getCardsFromDeck(deckId: number): Promise<ICard[]> {
	const response = await fetch(`${API_BASE_URL}/deck-sessions/decks/${deckId}/cards`);
	if (!response.ok) throw new Error("Erro ao buscar cartas do deck");
	return response.json();
}

export function useCardsFromDeck(deckId: number) {
	return useQuery<ICard[]>({
		queryKey: ["deckSessionCards", deckId],
		queryFn: () => getCardsFromDeck(deckId),
		enabled: !!deckId,
	});
}

// POST /deck-sessions
export async function reqDeckSession(data: { studentId: string; deckId: number; reviews: { cardId: number; result: "CORRECT" | "INCORRECT" }[] }): Promise<IDeckSession> {
	const response = await fetch(`${API_BASE_URL}/deck-sessions`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error("Erro ao criar sessão/reviews");
	return response.json();
}

export function useDeckSession() {
	const queryClient = useQueryClient();
	return useMutation({
    mutationFn: reqDeckSession,
    onSuccess: (data) => {
      console.log("Sessão criada com sucesso:", data);
      queryClient.invalidateQueries({ queryKey: ["deckSessionCards"] });
    },
    onError: (error) => {
      console.error("Erro ao criar sessão:", error);
    },
  });
}
