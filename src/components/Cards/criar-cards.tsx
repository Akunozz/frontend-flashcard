"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { reqCreateCard } from "@/hooks/cards/reqCard";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "../ui/label";
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
          onClick={() => {
            reset();
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Carta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Carta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label className="block font-medium mb-1">Frente</Label>
            <Textarea
              {...register("front")}
              placeholder="Digite a pergunta ou termo..."
              className="w-full min-h-[100px] text-sm border-primary"
            />
            {errors.front && (
              <p className="text-red-500 text-xs mt-1">
                {errors.front.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label className="block font-medium mb-1">Verso</Label>
            <Textarea
              {...register("back")}
              placeholder="Digite a resposta ou definição..."
              className="w-full min-h-[100px] text-sm border-primary"
            />
            {errors.back && (
              <p className="text-red-500 text-xs mt-1">{errors.back.message}</p>
            )}
          </div>
          {/* <div className="space-y-1">
            <Label className="block font-medium mb-1">Imagem (URL)</Label>
            <Input
              {...register("imageUrl")}
              placeholder="https://... (opcional)"
              className="w-full"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div> */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Criando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CirclePlus /> Criar Carta
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
