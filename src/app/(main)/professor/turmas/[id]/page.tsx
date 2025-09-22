"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import reqTurmaById from "@/hooks/turma/reqTurma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/loading/loader";
import type { ITurma } from "@/Interfaces/ITurma";

export default function TurmaDetalhePage() {
  const params = useParams();
  let id = params?.id;
  if (Array.isArray(id)) id = id[0];
  const [turma, setTurma] = useState<ITurma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    reqTurmaById(id)
      .then((data) => setTurma(data))
      .catch((err) => setError(err.message || "Erro ao buscar turma."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!turma) return <div>Turma não encontrada.</div>;

  return (
    <main className="flex justify-center items-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{turma.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="font-semibold">Descrição:</span> {turma.description || "Sem descrição"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Código de acesso:</span> <span className="italic">{turma.token}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Criada em:</span> {new Date(turma.createdAt).toLocaleDateString()}
          </div>
          {/* Adicione mais detalhes conforme necessário */}
        </CardContent>
      </Card>
    </main>
  );
}
