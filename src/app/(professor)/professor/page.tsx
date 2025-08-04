import CriarTurmaDialog from "@/components/professor/turma/criar-turma";
import ListarTurmas from "@/components/professor/turma/listar-turmas";
import { cookies } from "next/headers";

export default async function ProfessorPage() {
  const cookieStore = await cookies();
  const professorId = cookieStore.get("id")?.value;
  return (
    <main>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Turmas</h1>
        <CriarTurmaDialog professorId={professorId ?? ""} />
      </header>

      <div>
        <ListarTurmas professorId={professorId ?? ""} />
      </div>
    </main>
  );
}
