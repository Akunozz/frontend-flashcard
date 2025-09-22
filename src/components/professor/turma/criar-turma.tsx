"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reqCriarTurma } from "@/hooks/turma/reqTurma";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";

interface CriarTurmaDialogProps {
  professorId: string;
}

// ----------------- Schema (Zod) -----------------
const turmaSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o nome da turma.")
    .max(80, "Máx. 80 caracteres."),
  description: z
    .string()
    .max(200, "Máx. 200 caracteres.")
    .optional()
    .or(z.literal("")), // permite string vazia
});

type TurmaValues = z.infer<typeof turmaSchema>;
// ------------------------------------------------

export default function CriarTurmaDialog({
  professorId,
}: CriarTurmaDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TurmaValues>({
    resolver: zodResolver(turmaSchema),
    defaultValues: { title: "", description: "" }
  });

  const onSubmit = async (data: TurmaValues) => {
    clearErrors("root");
    try {
      const turma = await reqCriarTurma({
        title: data.title,
        description: data.description ?? "",
        professorId,
      });

      if (turma?.id) {
        toast.success("Turma criada com sucesso!");
        window.dispatchEvent(new CustomEvent("turmaCreated"));
        reset();
        setTimeout(() => setOpen(false), 500);
      } else {
        setError("root", { message: "Erro ao criar turma." });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar turma.";
      setError("root", { message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="w-4 h-4 mr-2" />
          Criar Turma
          </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Criar nova turma</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Nome da turma</Label>
            <Input
              id="title"
              placeholder="Ex.: 3º Ano B - Biologia"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <p id="title-error" className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Opcional"
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              {...register("description")}
            />
            {errors.description && (
              <p id="description-error" className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {errors.root?.message && (
            <div className="text-red-500 text-sm">{errors.root.message}</div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="text-white"
          >
            {isSubmitting ? <span className="flex items-center gap-2"><Loader2 className="animate-spin"/> Criando...</span> : "Criar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
