import EntrarTurma from "@/components/student/turma/entrar-turma";
import ListarTurmasAluno from "@/components/student/turma/listar-turma";
import { cookies } from "next/headers";

export default async function StudentPage() {
  const cookieStore = await cookies();
  const sutendtId = cookieStore.get("id")?.value;
  return (
    <div>
      <h1>Página do Estudante</h1>
      <div>
        <EntrarTurma studentId={sutendtId ?? ""} />
        <ListarTurmasAluno studentId={sutendtId ?? ""} />
      </div>
    </div>
  );
}
