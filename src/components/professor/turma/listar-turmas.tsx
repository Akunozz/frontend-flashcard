"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reqListarTurmasProfessor, deleteTurma } from "@/hooks/turma/reqTurma";
import type { ITurma } from "@/Interfaces/ITurma";
import { Button } from "@/components/ui/button";
import { Trash2, XCircle } from "lucide-react";
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

interface ListarTurmasProps {
  professorId: string;
}

export default function ListarTurmas({ professorId }: ListarTurmasProps) {
  const [turmas, setTurmas] = useState<ITurma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTurmas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await reqListarTurmasProfessor(professorId);
      setTurmas(res);
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

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!turmas.length) return <div>Nenhuma turma encontrada.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {turmas.map((turma) => (
        <Card key={turma.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{turma.title}</span>
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
            </CardTitle>
            <div>
              Código de acesso: <span className="italic"> {turma.token} </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">
              {turma.description || "Sem descrição"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Quantidade de alunos: ---
              <div className="text-xs text-gray-500 mt-1">
                Criada em: {new Date(turma.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
