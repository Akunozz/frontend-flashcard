"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  reqGetDecksByTurmaId,
  reqDeleteDeck,
  reqUpdateDeck,
} from "@/hooks/decks/reqDeck";
import type { IDeck } from "@/Interfaces/IDeck";
import { Button } from "@/components/ui/button";
import {
  BookCopy,
  CircleX,
  Eye,
  Loader2,
  Pencil,
  Play,
  Save,
  Settings,
  Trash2,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const deckSchema = z.object({
  title: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type DeckFormData = z.infer<typeof deckSchema>;

interface ListarDeckProps {
  turmaId: number;
  aluno?: boolean;
}

export default function ListarDeck({ turmaId, aluno }: ListarDeckProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editingDeck, setEditingDeck] = useState<IDeck | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<DeckFormData>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

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

  const { mutate: updateDeck } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DeckFormData }) => {
      return await reqUpdateDeck(id, data);
    },
    onSuccess: async () => {
      toast.success("Deck atualizado com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["decks", turmaId] });
      setIsEditDialogOpen(false);
      setEditingDeck(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Erro ao atualizar deck");
    },
    onSettled: () => setIsUpdating(false),
  });

  const handleEdit = (deck: IDeck) => {
    setEditingDeck(deck);
    form.reset({
      title: deck.title,
      description: deck.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: DeckFormData) => {
    if (!editingDeck?.id) return;
    setIsUpdating(true);
    updateDeck({ id: editingDeck.id, data });
  };

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
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <Card
            key={deck.id}
            className="min-w-[280px] group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-white via-white to-emerald-50 dark:border-none dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-6">
                <span>{deck.title}</span>

                <div className={aluno ? "hidden" : ""}>
                  <Popover>
                    <PopoverTrigger>
                      <div>
                        <Settings className="h-4" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="flex gap-4 w-32">
                      <Button
                        onClick={() => handleEdit(deck)}
                        className="bg-green-50 text-primary"
                      >
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
                            className="bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Você tem certeza?</DialogTitle>
                            <DialogDescription>
                              Isso excluirá permanentemente o deck e todos os
                              dados serão perdidos.
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
                </div>
              </CardTitle>

              <div className="text-sm text-muted-foreground mb-2">
                {deck.description || "Sem descrição"}
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex gap-8">
                <div className="text-xs text-gray-500 mt-1 items-center">
                  <BookCopy className="h-4 w-4 inline-block mr-1" />
                  {deck.cards?.length ?? 0} cards
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className={aluno ? "hidden" : "flex justify-center w-full"}>
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
              <div className={aluno ? "flex justify-center w-full" : "hidden"}>
                <Button
                  variant="outline"
                  className="bg-primary text-white dark:bg-primary dark:text-white gap-2"
                  size="sm"
                  onClick={() => {
                    const params = new URLSearchParams({
                      title: deck.title || "",
                      description: deck.description || "",
                    }).toString();
                    router.push(`/student/study?deckId=${deck.id}&${params}`);
                  }}
                >
                  <Play />
                  Estudar Deck
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modal de edição de deck */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Deck</DialogTitle>
            <DialogDescription>
              Altere o nome e a descrição do deck e clique em salvar.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Deck</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite o nome do deck..."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite a descrição..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                >
                  <CircleX className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="text-white"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save />
                      Salvar
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
