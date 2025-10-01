"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import reqTurmaById from "@/hooks/turma/reqTurma";
import Loader from "@/components/loading/loader";
import type { ITurma } from "@/Interfaces/ITurma";
import { ChevronLeft, BookOpen, User, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ListarDeck from "@/components/professor/Decks/listar-decks";
import { Button } from "@/components/ui/button";

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
  if (error)
    return <div className="text-center py-12 text-destructive">{error}</div>;
  if (!turma)
    return (
      <div className="text-center py-12 text-muted-foreground">
        Turma não encontrada.
      </div>
    );

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="gap-2 -ml-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex items-start gap-4">
          <div className="p-4 rounded-2xl bg-primary/10">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground leading-tight">
                {turma.title}
              </h1>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                {turma.description || "Sem descrição"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <code className="font-mono text-primary font-semibold">
                  {turma.token}
                </code>
              </div>
              {turma.professor && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {turma.professor.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Decks Disponíveis
          </h2>
          <p className="text-sm text-muted-foreground">
            Escolha um deck para começar a estudar
          </p>
        </div>
        <ListarDeck turmaId={turma.id} aluno/>
      </section>
    </div>
  );
}
