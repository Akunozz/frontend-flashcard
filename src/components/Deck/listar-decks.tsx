"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reqGetDecksByTurmaId, reqDeleteDeck } from "@/hooks/decks/reqDeck";
import type { IDeck } from "@/Interfaces/IDeck";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Copy,
  Pencil,
  Settings,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Loader from "@/components/loading/loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ListarDeckProps {
  turmaId: number;
}

export default function ListarDeck({ turmaId }: ListarDeckProps) {
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await reqGetDecksByTurmaId(turmaId);
      setDecks(res);
    } catch {
      setError("Erro ao buscar decks.");
    }
    setLoading(false);
  }, [turmaId]);

  useEffect(() => {
    fetchDecks();
    const handler = () => fetchDecks();
    window.addEventListener("deckCreated", handler);
    return () => window.removeEventListener("deckCreated", handler);
  }, [fetchDecks]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError("");
    try {
      await reqDeleteDeck(id);
      setDecks((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Erro ao deletar deck.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!decks.length) return <div>Nenhum deck encontrado.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Card key={deck.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-6">
              <span>{deck.title}</span>
              <Popover>
                <PopoverTrigger>
                  <div>
                    <Settings className="h-4" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="flex gap-4 w-36">
                  <Button>
                    <Pencil />
                  </Button>
                  <Dialog>
                    <DialogTrigger>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Você tem certeza?</DialogTitle>
                        <DialogDescription>
                          Isso excluirá permanentemente o deck e todos os dados
                          serão perdidos.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-between space-x-2">
                        <DialogClose asChild>
                          <Button type="button">
                            <XCircle className="h-4 w-4" />
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(deck.id)}
                          disabled={deletingId === deck.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === deck.id
                            ? "Deletando..."
                            : "Deletar Deck"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </PopoverContent>
              </Popover>
            </CardTitle>
            <div className="text-sm text-muted-foreground mb-2">
              {deck.description || "Sem descrição"}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-8">
              <div className="text-xs text-gray-500 mt-1 items-center">
                <BookOpen className="h-4 w-4 inline-block mr-1" />
                {deck.cards?.length ?? 0} cards
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center w-full">
              <Button
                variant="outline"
                className="bg-primary text-white dark:bg-primary dark:text-white"
                size="sm"
                onClick={() => router.push(`/professor/decks/${deck.id}`)}
              >
                Visualizar Deck
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
