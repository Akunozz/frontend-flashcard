"use client";

import {
  reqDeleteCard,
  reqGetCardsByDeck,
  reqUpdateCard,
} from "@/hooks/cards/reqCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ICard } from "@/Interfaces/ICard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Trash2,
  Loader2,
  FilePlus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const cardSchema = z.object({
  front: z
    .string()
    .min(1, "A pergunta é obrigatória")
    .max(500, "Máximo 500 caracteres"),
  back: z
    .string()
    .min(1, "A resposta é obrigatória")
    .max(1000, "Máximo 1000 caracteres"),
});

type CardFormData = z.infer<typeof cardSchema>;

interface ListarCardProps {
  deckId: number;
}

export default function ListarCard({ deckId }: ListarCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();
  const [editingCard, setEditingCard] = useState<ICard | null>(null);
  const [deletingCard, setDeletingCard] = useState<ICard | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      front: "",
      back: "",
    },
  });

  const {
    data: cards = [],
    isLoading: loading,
    error,
  } = useQuery<ICard[], Error>({
    queryKey: ["cards", deckId],
    queryFn: () => reqGetCardsByDeck(deckId),
  });

  const handleEdit = (card: ICard) => {
    setEditingCard(card);
    form.reset({
      front: card.front,
      back: card.back,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (data: CardFormData) => {
    if (!editingCard?.id) return;

    setIsUpdating(true);
    try {
      await reqUpdateCard(editingCard.id, data);
      toast.success("Carta atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      setIsEditDialogOpen(false);
      setEditingCard(null);
    } catch (e: any) {
      toast.error(e.message || "Erro ao atualizar carta");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (card: ICard) => {
    setDeletingCard(card);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCard?.id) return;

    setIsDeleting(true);
    try {
      await reqDeleteCard(deletingCard.id);
      toast.success("Carta excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      setIsDeleteDialogOpen(false);
      setDeletingCard(null);
    } catch (e: any) {
      toast.error(e.message || "Erro ao excluir carta");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
          <p className="text-sm text-muted-foreground">
            Carregando flashcards...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-destructive/20 rounded-xl bg-destructive/5">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
          <Trash2 className="w-6 h-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive mb-1">
          Erro ao carregar
        </h3>
        <p className="text-destructive/80 text-center text-sm">
          {error.message}
        </p>
      </div>
    );

  if (!cards.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-border rounded-xl bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
          <FilePlus className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Nenhuma carta criada</h2>
        <p className="text-muted-foreground text-center text-sm max-w-md leading-relaxed">
          Adicione flashcards para que os estudantes possam começar a estudar e
          praticar o conteúdo
        </p>
      </div>
    );

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {cards.length} {cards.length === 1 ? "carta" : "cartas"} disponíveis
          </p>
        </div>

      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 px-4"
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            data-index={index}
            className="flex-shrink-0 relative w-72"
          >
            <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between p-4">
                <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Carta #{index + 1}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(card)}
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteClick(card)}
                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="px-6 pl-12 pb-6 space-y-6 h-full flex flex-col">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      Pergunta
                    </span>
                  </div>
                  <div className="bg-white/70 dark:bg-white/10 rounded-xl p-4 border border-blue-200 dark:border-blue-700 shadow-sm">
                    <p className="text-foreground leading-relaxed text-sm font-medium">
                      {card.front}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                      Resposta
                    </span>
                  </div>
                  <div className="bg-white/70 dark:bg-white/10 rounded-xl p-4 border border-green-200 dark:border-green-700 shadow-sm flex-1">
                    <p className="text-foreground leading-relaxed text-sm">
                      {card.back}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-amber-200/50 dark:border-amber-700/50">
                  <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs text-amber-700 dark:text-amber-300">
                    {card.createdAt
                      ? new Date(card.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Data desconhecida"}
                  </span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-200 dark:from-amber-700 to-transparent transform rotate-45 translate-x-4 -translate-y-4"></div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-2 border-b border-border/50">
            <DialogTitle className="text-xl">Editar Carta</DialogTitle>
            <DialogDescription className="text-sm">
              Faça as alterações e clique em salvar.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="space-y-5 pt-2"
            >
              <FormField
                control={form.control}
                name="front"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Pergunta
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite a pergunta..."
                        className="resize-none min-h-[100px] border-2 focus:border-primary transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="back"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Resposta
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite a resposta..."
                        className="resize-none min-h-[120px] border-2 focus:border-primary transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex-row gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                  className="w-1/2"
                >
                  <CircleX/>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-primary to-accent w-1/2"
                >
                  {isUpdating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save />
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
            <DialogTitle className="text-xl">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-sm">
              Tem certeza que deseja excluir esta carta? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          {deletingCard && (
            <div className="py-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border">
                <div>
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Pergunta:
                  </span>
                  <p className="text-sm">{deletingCard.front}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Resposta:
                  </span>
                  <p className="text-sm">{deletingCard.back}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
