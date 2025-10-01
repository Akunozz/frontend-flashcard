"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BookCopy, Loader2, PlusCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { reqCreateCard } from "@/hooks/cards/reqCard";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const cardSchema = z.object({
  front: z.string().min(1, "Informe a frente da carta."),
  back: z.string().min(1, "Informe o verso da carta."),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});
type CardValues = z.infer<typeof cardSchema>;

interface CriarCardsProps {
  deckId: number;
}

export default function CriarCardsDialog({ deckId }: CriarCardsProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CardValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: { front: "", back: "", imageUrl: "" },
  });

  const queryClient = useQueryClient();
  const onSubmit = async (data: CardValues) => {
    try {
      await reqCreateCard({ ...data, deckId });
      toast.success("Carta criada com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["cards", deckId] });
      setOpen(false);
      reset();
    } catch (e: any) {
      toast.error(e.message || "Erro ao criar carta");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => reset()}
          className="bg-gradient-to-r from-primary to-accent text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Carta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2 font-semibold justify-center">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                <BookCopy className="w-5 h-5 text-primary" />
              </div>
              Adicionar Nova Carta
            </DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Crie um novo flashcard com pergunta e resposta
            </DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Pergunta (Frente)
            </Label>
            <Textarea
              {...register("front")}
              placeholder="Digite a pergunta ou termo..."
              className="min-h-[120px] text-sm border-2 focus:border-primary transition-colors resize-none"
            />
            {errors.front && (
              <p className="text-destructive text-xs mt-1 font-medium">
                {errors.front.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Resposta (Verso)
            </Label>
            <Textarea
              {...register("back")}
              placeholder="Digite a resposta ou definição..."
              className="min-h-[120px] text-sm border-2 focus:border-primary transition-colors resize-none"
            />
            {errors.back && (
              <p className="text-destructive text-xs mt-1 font-medium">
                {errors.back.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Criando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Criar Carta
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
