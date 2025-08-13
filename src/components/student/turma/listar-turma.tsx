"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reqListarTurmasAluno } from "@/hooks/turma/reqTurma";
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
  studentId: string;
}

export default function ListarTurmasAluno({ studentId }: ListarTurmasProps) {
  const [turmas, setTurmas] = useState<ITurma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTurmas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await reqListarTurmasAluno(studentId);
      setTurmas(res);
    } catch {
      setError("Erro ao buscar turmas.");
    }
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    fetchTurmas();
    const handler = () => fetchTurmas();
    window.addEventListener("turmaCreated", handler);
    return () => window.removeEventListener("turmaCreated", handler);
  }, [fetchTurmas]);

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
