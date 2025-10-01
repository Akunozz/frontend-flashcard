import CriarTurmaDialog from "@/components/professor/turma/criar-turma";
import ListarTurmas from "@/components/professor/turma/listar-turmas";
import { cookies } from "next/headers";
import { BookOpen } from "lucide-react";

export default async function ProfessorPage() {
  const cookieStore = await cookies();
  const professorId = cookieStore.get("id")?.value;

  return (
    <main className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-8 shadow-xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Minhas Turmas</h1>
            </div>
            <p className="text-emerald-100 text-xs">
              Gerencie suas turmas e acompanhe o progresso dos alunos
            </p>
          </div>
          <CriarTurmaDialog professorId={professorId ?? ""} />
        </div>
      </div>

      {/* Lista de Turmas */}
      <div className="space-y-4">
        <ListarTurmas professorId={professorId ?? ""} />
      </div>
    </main>
  );
}
