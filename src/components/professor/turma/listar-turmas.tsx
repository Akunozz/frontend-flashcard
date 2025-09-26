"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reqListarTurmasProfessor, deleteTurma } from "@/hooks/turma/reqTurma";
import type { ITurma } from "@/Interfaces/ITurma";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Copy,
  Eye,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  const [turmas, setTurmas] = useState<ITurma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const fetchTurmas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await reqListarTurmasProfessor(professorId);
      let turmasFiltradas = res;
      if (latestOnly) {
        turmasFiltradas = [...res]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);
      }
      setTurmas(turmasFiltradas);
    } catch {
      setError("Erro ao buscar turmas.");
    }
    setLoading(false);
  }, [professorId]);

  useEffect(() => {
    fetchTurmas();
    const handler = () => fetchTurmas();
    window.addEventListener("turmaCreated", handler);
    return () => window.removeEventListener("turmaCreated", handler);
  }, [fetchTurmas]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError("");
    try {
      await deleteTurma(id);
      setTurmas((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Erro ao deletar turma.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast(`Código ${code} copiado!`);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!turmas.length) return <div>Nenhuma turma encontrada.</div>;

  return (
    <div
      className={
        horizontal
          ? "flex gap-4 overflow-x-auto flex-nowrap md:grid md:grid-cols-2 py-2"
          : "grid gap-4 md:grid-cols-2"
      }
    >
      {turmas.map((turma) => (
        <Card key={turma.id} className="min-w-[250px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-6">
              <span>{turma.title}</span>
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
                          Isso excluirá permanentemente a turma e todos os dados
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
                          onClick={() => handleDelete(turma.id)}
                          disabled={deletingId === turma.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === turma.id
                            ? "Deletando..."
                            : "Deletar Turma"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </PopoverContent>
              </Popover>
            </CardTitle>
            <div
              className={
                horizontal
                  ? "text-xs text-muted-foreground mb-2 truncate dark:text-zinc-400"
                  : "text-xs text-muted-foreground mb-2 dark:text-zinc-400"
              }
            >
              {turma.description || "Sem descrição"}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="font-mono bg-primary text-white"
              >
                {turma.token}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyCode(turma.token)}
                className="h-6 w-6"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex justify-between">
              <div className="flex text-xs text-gray-500 dark:text-white mt-1 items-center gap-1">
                <User className="h-4 w-4" />
                <span>{turma.alunosCount}</span>
                {turma.alunosCount === 1 ? "aluno" : "alunos"}
              </div>
              <div className="flex text-xs text-gray-500 dark:text-white mt-1 items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{turma.decksCount}</span>
                {turma.decksCount === 1 ? <span> deck </span> : "decks"}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-white">
              <div className="text-xs text-gray-500 mt-1 dark:text-white">
                Criada em: {new Date(turma.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center w-full">
              <Button
                variant="outline"
                className="bg-primary text-white dark:bg-primary dark:text-white"
                size="sm"
                onClick={() => router.push(`/professor/turmas/${turma.id}`)}
              >
                <Eye className="mr-1"/>
                Visualizar Turma
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
