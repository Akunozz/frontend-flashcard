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
import { mockDecks } from "@/data/mockData";
import CriarTurmaDialog from "@/components/professor/turma/criar-turma";

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
          <div className="max-h-60 overflow-y-auto">
            <ListarTurmas professorId={professorId ?? ""} latestOnly />
          </div>
        </div>
      </section>

      <section>
        {/* Top Performing Decks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Decks Mais Populares</CardTitle>
            <CardDescription>Baseado no número de estudos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDecks
              .sort(
                (a, b) => b.studyStats.totalStudies - a.studyStats.totalStudies
              )
              .slice(0, 3)
              .map((deck, index) => {
                const accuracy = Math.round(
                  (deck.studyStats.correctAnswers /
                    (deck.studyStats.correctAnswers +
                      deck.studyStats.incorrectAnswers)) *
                    100
                );

                return (
                  <div
                    key={deck.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{deck.title}</div>
                        <div className="text-xs text-gray-600">
                          {deck.studyStats.totalStudies} estudos
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{accuracy}%</Badge>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </section>

    </main>
  );
}
