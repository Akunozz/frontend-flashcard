"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reqListarTurmasAluno } from "@/hooks/turma/reqTurma";
import type { ITurmaAluno } from "@/Interfaces/ITurma";
import Loader from "@/components/loading/loader";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ListarTurmasProps {
  studentId: string;
  latestOnly?: boolean;
  horizontal?: boolean;
}

export default function ListarTurmasAluno({
  studentId,
  latestOnly = false,
  horizontal = false,
}: ListarTurmasProps) {
  const {
    data: turmasRaw,
    isLoading,
    isError,
  } = useQuery<ITurmaAluno[]>({
    queryKey: ["turmaAluno", studentId],
    queryFn: () => reqListarTurmasAluno(studentId),
  });

  const turmas = useMemo(() => {
    if (!turmasRaw) return [];
    if (latestOnly) {
      return [...turmasRaw]
        .sort(
          (a, b) =>
            new Date(b.turma.createdAt).getTime() -
            new Date(a.turma.createdAt).getTime()
        )
        .slice(0, 5);
    }
    return turmasRaw;
  }, [turmasRaw, latestOnly]);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-center py-12 text-destructive">
        Erro ao buscar turmas.
      </div>
    );
  if (!turmas || turmas.length === 0)
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma turma encontrada.
      </div>
    );

  return (
    <div
      className={
        horizontal
          ? "flex gap-4 overflow-x-auto scrollbar-hide py-2"
          : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      }
    >
      {turmas.map((turma, index) => (
        <Link
          key={turma.id}
          href={`/student/turmas/${turma.turma.id}`}
          className="block"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Card
            className={`
              group relative overflow-hidden border-2 transition-all duration-300
              hover:shadow-xl hover:scale-[1.02] hover:border-primary/50
              ${horizontal ? "min-w-[320px]" : ""}
              animate-fade-in-up
            `}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

            <CardHeader className="relative space-y-3 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <CardTitle className="flex  items-center gap-2 text-xl font-serif font-bold text-foreground leading-tight">
                    <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    {turma.turma.title || "Erro ao encontrar nome"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {turma.turma.description || "Sem descrição"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">Código:</span>
                <code className="px-2 py-1 rounded-md bg-muted text-primary font-mono text-xs">
                  {turma.turma.token}
                </code>
              </div>

              <Badge>
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {turma.turma._count?.turmaAluno || 0}
                </span>
                <span className="text-xs">
                  {turma.turma._count?.turmaAluno === 1 ? "aluno" : "alunos"}
                </span>
              </Badge>
 
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sm font-semibold">Professor:</span>
                <span className="text-muted-foreground">
                  {turma.turma.professor?.name}
                </span>
              </div>

              <Badge>
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {turma.turma._count?.decks || 0}
                </span>
                <span className="text-xs">
                  {turma.turma._count?.decks === 1 ? "deck" : "decks"}
                </span>
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
