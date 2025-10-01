"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import reqTurmaById from "@/hooks/turma/reqTurma";
import Loader from "@/components/loading/loader";
import type { ITurma } from "@/Interfaces/ITurma";
import CriarDeck from "@/components/professor/Decks/criar-deck";
import { BookOpen, Users, Layers, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ListarDeck from "@/components/professor/Decks/listar-decks";
import BackButton from "@/components/BackButton/back-button";

export default function TurmaDetalhePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  let id = params?.id;
  if (Array.isArray(id)) id = id[0];

  const [turma, setTurma] = useState<ITurma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Busca valores dos parâmetros da URL
  const decksCountParam = Number(searchParams.get("decksCount"));
  const alunosCountParam = Number(searchParams.get("alunosCount"));

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
  if (error)
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
        {error}
      </div>
    );
  if (!turma)
    return (
      <div className="text-muted-foreground p-4">Turma não encontrada.</div>
    );

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-8 shadow-xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h1 className="text-xl font-bold text-white">{turma.title}</h1>
              <p className="text-emerald-100 text-xs">
                {turma.description || "Sem descrição"}
              </p>
            </div>
          </div>

          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-2 text-white/90">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">
                {(alunosCountParam || turma.alunosCount || 0) + " alunos"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Layers className="h-5 w-5" />
              <span className="text-sm font-medium">
                {(decksCountParam || turma.decksCount || 0) + " decks"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">
              Decks da Turma
            </h2>
          </div>
          <CriarDeck turmaId={turma.id} />
        </div>

        <ListarDeck turmaId={turma.id} />
      </div>
    </div>
  );
}
