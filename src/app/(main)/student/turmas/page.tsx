import BackButton from "@/components/BackButton/back-button";
import ListarTurmasAluno from "@/components/student/turma/listar-turma";
import { GraduationCap } from "lucide-react";
import { cookies } from "next/headers";

export default async function TurmasPage() {
  const cookieStore = await cookies();
  const sutendtId = cookieStore.get("id")?.value;

  return (
    <div className="space-y-6">
      <BackButton />

      <header className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="p-3 rounded-2xl bg-primary/10">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Minhas Turmas
          </h1>
          <p className="text-muted-foreground">
            Todas as turmas que você participa
          </p>
        </div>
      </header>

      <ListarTurmasAluno studentId={sutendtId ?? ""} />
    </div>
  );
}
