"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reqListarTurmasAluno } from "@/hooks/turma/reqTurma";
import type { ITurmaAluno } from "@/Interfaces/ITurma";
import Loader from "@/components/loading/loader";



interface ListarTurmasProps {
  studentId: string;
}

export default function ListarTurmasAluno({ studentId }: ListarTurmasProps) {
  const [turmas, setTurmas] = useState<ITurmaAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    reqListarTurmasAluno(studentId)
      .then((res) => {
        setTurmas(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao buscar turmas.");
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!turmas.length) return <div>Nenhuma turma encontrada.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {turmas.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{item.turma?.title || "Sem nome"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">
              {item.turma?.description || "Sem descrição"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
