import ListarTurmas from "@/components/professor/turma/listar-turmas";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cookies } from "next/headers";

export default async function ProfessorPage() {
  const cookieStore = await cookies();
  const professorId = cookieStore.get("id")?.value;
  return (
    <main>
      <section className="flex items-center justify-center mb-6">
        {/* Turmas Recentes */}
        <div className="w-full px-2">
          <h1 className="flex justify-center text-lg font-bold">
            Visualizar turmas recentes
          </h1>
          <div className="overflow-y-auto mx-auto mt-4">
            <ListarTurmas professorId={professorId ?? ""} latestOnly horizontal/>
          </div>
        </div>
      </section>

      <section>
        {/* Estatísticas do Professor */}
        <div className="w-full px-2">
          <h1 className="flex justify-center text-lg font-bold">
            Estatísticas do Professor
          </h1>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
                <CardDescription>
                  Visão geral do uso da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">??</span>
                  <span className="text-sm text-gray-500">Turmas</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">??</span>
                  <span className="text-sm text-gray-500">Alunos</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">??</span>
                  <span className="text-sm text-gray-500">Decks</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">??</span>
                  <span className="text-sm text-gray-500">Flashcards</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
