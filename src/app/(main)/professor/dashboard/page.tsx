import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Target, TrendingUp, Users } from "lucide-react";
import { cookies } from "next/headers";

export default async function ProfessorPage() {
  const cookieStore = await cookies();
  const professorId = cookieStore.get("id")?.value;
  return (
    <main>
      <header className="flex items-center justify-center mb-6">
        <div className="grid-cols-2">
          <div className="space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="!size-3 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        1
                      </div>
                      <div className="text-sm text-gray-600">Decks Criados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        1
                      </div>
                      <div className="text-sm text-gray-600">Estudantes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">1%</div>
                      <div className="text-sm text-gray-600">
                        Precisão Média
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        1
                      </div>
                      <div className="text-sm text-gray-600">Min/Sessão</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>
    </main>
  );
}
