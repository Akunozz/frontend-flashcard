import ListarTurmas from "@/components/professor/turma/listar-turmas";
import { cookies } from "next/headers";

export default async function ProfessorPage() {
  const cookieStore = await cookies();
  const professorId = cookieStore.get("id")?.value;
  const professorName = cookieStore.get("name")?.value;

  return (
    <main className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-8 shadow-xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative space-y-2">
          <h1 className="text-4xl font-bold text-white">
            Bem-vindo de volta,{" "}
            {professorName ? professorName.split(" ")[0] : "Professor"}!
          </h1>
          <p className="text-emerald-100 text-lg">
            Acompanhe o progresso das suas turmas e gerencie seus conteúdos
          </p>
        </div>
      </div>

      {/* <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">
            Estatísticas Gerais
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Turmas
              </CardTitle>
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900 p-2">
                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ??
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Turmas ativas
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Alunos
              </CardTitle>
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ??
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Alunos matriculados
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Decks
              </CardTitle>
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-2">
                <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ??
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Decks criados
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Flashcards
              </CardTitle>
              <div className="rounded-lg bg-orange-100 dark:bg-orange-900 p-2">
                <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ??
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cards disponíveis
              </p>
            </CardContent>
          </Card>
        </div>
      </section> */}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">
            Turmas Recentes
          </h2>
        </div>
        <ListarTurmas professorId={professorId ?? ""} latestOnly horizontal />
      </section>
    </main>
  );
}
