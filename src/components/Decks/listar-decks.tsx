"use client";

import { useRouter } from "next/navigation";
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
import { BookOpen, Eye, Pencil, Settings, Trash2, XCircle } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

interface ListarDeckProps {
  turmaId: number;
}

export default function ListarDeck({ turmaId }: ListarDeckProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const {
    data: decks = [],
    isLoading,
    isError,
    error,
  } = useQuery<IDeck[], Error>({
    queryKey: ["decks", turmaId],
    queryFn: () => reqGetDecksByTurmaId(turmaId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteDeck, isPending: deleting } = useMutation({
    mutationFn: (id: number) => reqDeleteDeck(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["decks", turmaId] });
      const previous = queryClient.getQueryData<IDeck[]>(["decks", turmaId]);
      queryClient.setQueryData<IDeck[]>(["decks", turmaId], (old) =>
        (old ?? []).filter((d) => d.id !== id)
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["decks", turmaId], context.previous);
      }
      toast.error("Erro ao deletar deck.");
    },
    onSuccess: async () => {
      toast.success("Deck deletado com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["decks", turmaId] });
    },
    onSettled: () => setConfirmId(null),
  });

  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <div className="text-red-500">
        {error?.message || "Erro ao buscar decks."}
      </div>
    );
  }
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
                  <Button disabled>
                    <Pencil />
                  </Button>

                  {/* Confirmação de delete */}
                  <Dialog
                    open={confirmId === deck.id}
                    onOpenChange={(o) => !o && setConfirmId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setConfirmId(deck.id)}
                        className="p-0 h-auto"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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
                          onClick={() => deck.id && deleteDeck(deck.id)}
                          disabled={deleting}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deleting ? "Deletando..." : "Deletar Deck"}
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
                className="bg-primary text-white dark:bg-primary dark:text-white gap-2"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams({
                    title: deck.title || "",
                    description: deck.description || "",
                  }).toString();
                  router.push(`/professor/decks/${deck.id}?${params}`);
                }}
              >
                <Eye />
                Visualizar Deck
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
