import EntrarTurma from "@/components/student/turma/entrar-turma";
import ListarTurmasAluno from "@/components/student/turma/listar-turma";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, UserCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function StudentPage() {
  const cookieStore = await cookies();
  const sutendtId = cookieStore.get("id")?.value;
  const studentName = cookieStore.get("name")?.value;

  return (
    <main className="space-y-8">
      <header className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10">
            <UserCircle2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Olá, {studentName ? studentName.split(" ")[0] : "Aluno"}!
            </h1>
            <p className="text-muted-foreground">
              Continue sua jornada de aprendizado
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60 border border-border/50 p-8 shadow-lg dark:bg-emerald-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Pronto para estudar?
              </h2>
            </div>
            <p className="text-foreground/70 max-w-2xl leading-relaxed">
              Acesse suas turmas e continue aprendendo com flashcards
              interativos criados pelos seus professores
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <EntrarTurma studentId={sutendtId ?? ""} />
              <Link href="/student/turmas">
                <Button
                  variant="outline"
                  className="bg-white dark:bg-white text-primary border-primary shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  Ver minhas turmas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Turmas Recentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Suas últimas turmas acessadas
            </p>
          </div>
          <Link href="/student/turmas">
            <Button variant="ghost" size="sm" className="text-primary">
              Ver todas
            </Button>
          </Link>
        </div>
        <ListarTurmasAluno studentId={sutendtId ?? ""} horizontal latestOnly />
      </section>
    </main>
  );
}
