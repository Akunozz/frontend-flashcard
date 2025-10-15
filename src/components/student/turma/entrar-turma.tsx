"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addAluno } from "@/hooks/turma/reqTurma";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Users, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EntrarTurmaProps {
  studentId: string;
}

const entrarTurmaSchema = z.object({
  token: z
    .string()
    .min(6, "O código da turma deve ter 6 dígitos")
    .max(6, "O código da turma deve ter 6 dígitos"),
});

type EntrarTurmaValues = z.infer<typeof entrarTurmaSchema>;

export default function EntrarTurma({ studentId }: EntrarTurmaProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EntrarTurmaValues>({
    resolver: zodResolver(entrarTurmaSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (data: EntrarTurmaValues) => {
    try {
      await addAluno(data.token, studentId);
      toast.success("Entrou na turma de código " + data.token + "!");
      await queryClient.invalidateQueries({
        queryKey: ["turmaAluno", studentId],
      });
      reset();
      setTimeout(() => setOpen(false), 500);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao entrar na turma");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-md shadow-primary/20 dark:shadow-sm text-white">
          <Users className="w-4 h-4" />
          Entrar em turma
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-serif">
              Entrar em nova turma
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            Digite o código de 6 dígitos fornecido pelo seu professor para
            acessar a turma
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm font-semibold">
              Código da turma
            </Label>
            <Input
              {...register("token")}
              id="token"
              placeholder="Ex: 123456"
              className="h-12 text-center text-lg font-mono tracking-wider"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full h-12 gap-2 shadow-lg shadow-primary/20 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Entrar na turma
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
