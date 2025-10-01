"use client";

import { useState } from "react";
import { reqCreateDeck } from "@/hooks/decks/reqDeck";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CriarDeckProps {
  turmaId: number;
}

const deckSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título do deck.")
    .max(30, "Máx. 30 caracteres."),
  description: z
    .string()
    .max(150, "Máx. 150 caracteres.")
    .optional()
    .or(z.literal("")),
  turmaId: z.number().min(1, "ID da turma inválido."),
});
type DeckValues = z.infer<typeof deckSchema>;

export default function CriarDeck({ turmaId }: CriarDeckProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeckValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: { title: "", description: "", turmaId: turmaId },
  });

  const queryClient = useQueryClient();

  const { mutateAsync: createDeck, isPending } = useMutation({
    mutationFn: (data: DeckValues) =>
      reqCreateDeck({
        title: data.title,
        description: data.description ?? "",
        turmaId: data.turmaId,
      }),
    onSuccess: async (deck) => {
      if (deck?.id) {
        toast.success("Deck criado com sucesso!");
        await queryClient.invalidateQueries({ queryKey: ["decks", turmaId] });
        reset();
        setOpen(false);
      } else {
        toast.error("Erro ao criar deck.");
      }
    },
    onError: () => {
      toast.error("Erro ao criar deck.");
    },
  });

  const onSubmit = async (data: DeckValues) => {
    await createDeck(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white"><PlusCircle /> Criar Deck</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Deck</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo deck.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              type="text"
              id="title"
              placeholder="Ex: Biologia Básica"
              required
              {...register("title")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.title && (
              <p id="title-error" className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Opcional"
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              {...register("description")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none min-h-[80px]"
            />
            {errors.description && (
              <p id="description-error" className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            aria-busy={isSubmitting || isPending}
            className="text-white flex justify-center w-full"
          >
            {isSubmitting || isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Criando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Criar Deck
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
