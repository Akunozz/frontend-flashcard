"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  reqListarTurmasProfessor,
  deleteTurma,
  useUpdateTurma,
} from "@/hooks/turma/reqTurma";
import type { ITurma } from "@/Interfaces/ITurma";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Copy,
  Eye,
  Loader2,
  Pencil,
  Save,
  Settings,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Loader from "@/components/loading/loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const turmaSchema = z.object({
  title: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
});
type TurmaFormData = z.infer<typeof turmaSchema>;
interface ListarTurmasProps {
  professorId: string;
  latestOnly?: boolean;
  horizontal?: boolean;
}

export default function ListarTurmas({
  professorId,
  latestOnly = false,
  horizontal = false,
}: ListarTurmasProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<ITurma | null>(null);
  const updateTurmaMutation = useUpdateTurma(professorId);

  const {
    data: turmasRaw,
    isLoading,
    isError,
  } = useQuery<ITurma[]>({
    queryKey: ["turma", professorId],
    queryFn: () => reqListarTurmasProfessor(professorId),
  });

  const turmas = useMemo(() => {
    if (!turmasRaw) return [];
    if (latestOnly) {
      return [...turmasRaw]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
    }
    return turmasRaw;
  }, [turmasRaw, latestOnly]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTurma(id);
      await queryClient.invalidateQueries({ queryKey: ["turma", professorId] });
      toast.success("Turma deletada com sucesso!");
    } catch {
      toast.error("Erro ao deletar turma.");
    } finally {
      setDeletingId(null);
    }
  };

  const form = useForm<TurmaFormData>({
    resolver: zodResolver(turmaSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleEdit = (turma: ITurma) => {
    setEditingTurma(turma);
    form.reset({
      title: turma.title,
      description: turma.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: TurmaFormData) => {
    if (!editingTurma?.id) return;
    updateTurmaMutation.mutate(
      { id: editingTurma.id, ...data },
      {
        onSuccess: () => {
          toast.success("Turma atualizada com sucesso!");
          setIsEditDialogOpen(false);
          setEditingTurma(null);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Erro ao atualizar turma");
        },
      }
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Código ${code} copiado!`);
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-destructive font-medium">Erro ao buscar turmas.</div>
    );
  if (!turmas || turmas.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma turma encontrada</h3>
        <p className="text-muted-foreground text-sm text-center">
          Crie sua primeira turma para começar
        </p>
      </div>
    );

  return (
    <div
      className={
        horizontal
          ? "flex gap-4 overflow-x-auto flex-nowrap md:grid md:grid-cols-2 py-2 scrollbar-hide"
          : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      }
    >
      {turmas.map((turma) => (
        <Card
          key={turma.id}
          className="min-w-[280px] group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-white via-white to-emerald-50 dark:border-none dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700"
        >
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center justify-between gap-4">
              <span className="text-lg font-bold text-balance leading-tight">
                {turma.title}
              </span>
              <div className={horizontal ? "hidden" : ""}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-accent/50 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex gap-4 w-32">
                    <Button
                      onClick={() => handleEdit(turma)}
                      className="bg-green-50 text-primary"
                    >
                      <Pencil />
                    </Button>
                    {/* Modal de edição de turma */}
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Editar Turma</DialogTitle>
                          <DialogDescription>
                            Altere o nome e a descrição da turma e clique em
                            salvar.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={form.handleSubmit(handleUpdate)}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label className="block text-sm font-medium mb-1">
                              Nome da Turma
                            </Label>
                            <Input
                              type="text"
                              {...form.register("title")}
                              className="w-full border rounded-lg px-3 py-2"
                              placeholder="Digite o nome da turma..."
                            />
                            {form.formState.errors.title && (
                              <span className="text-red-500 text-xs">
                                {form.formState.errors.title.message}
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="block text-sm font-medium mb-1">
                              Descrição
                            </Label>
                            <Textarea
                              {...form.register("description")}
                              className="w-full border rounded-lg px-3 py-2 resize-none"
                              rows={3}
                              placeholder="Digite a descrição..."
                            />
                            {form.formState.errors.description && (
                              <span className="text-red-500 text-xs">
                                {form.formState.errors.description.message}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditDialogOpen(false)}
                              disabled={updateTurmaMutation.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                              Cancelar
                            </Button>
                            <Button
                              type="submit"
                              disabled={updateTurmaMutation.isPending}
                              className="text-white"
                            >
                              {updateTurmaMutation.isPending ? (
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
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar exclusão</DialogTitle>
                          <DialogDescription>
                            Isso excluirá permanentemente a turma{" "}
                            <strong>{turma.title}</strong> e todos os decks e
                            cards criados nela. Esses dados serão perdidos para
                            sempre.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <DialogClose asChild>
                            <Button variant="outline">
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(turma.id)}
                            disabled={deletingId === turma.id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deletingId === turma.id
                              ? "Deletando..."
                              : "Deletar"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </PopoverContent>
                </Popover>
              </div>
            </CardTitle>
            <p
              className={
                horizontal
                  ? "text-xs text-muted-foreground truncate"
                  : "text-xs text-muted-foreground line-clamp-2"
              }
            >
              {turma.description || "Sem descrição"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <Badge
                variant="secondary"
                className="font-mono text-sm font-bold bg-primary text-primary-foreground px-3 py-1"
              >
                {turma.token}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyCode(turma.token)}
                className="h-7 w-7 hover:bg-primary/20 transition-colors ml-auto"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">
                  {turma.alunosCount}{" "}
                  {turma.alunosCount === 1 ? "aluno" : "alunos"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="p-1.5 bg-accent/10 rounded-md">
                  <BookOpen className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium">
                  {turma.decksCount} {turma.decksCount === 1 ? "deck" : "decks"}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
              Criada em {new Date(turma.createdAt).toLocaleDateString("pt-BR")}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
              size="sm"
              onClick={() =>
                router.push(
                  `/professor/turmas/${turma.id}?decksCount=${turma.decksCount}&alunosCount=${turma.alunosCount}`
                )
              }
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualizar Turma
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
