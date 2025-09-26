"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import reqTurmaById from "@/hooks/turma/reqTurma";
import Loader from "@/components/loading/loader";
import type { ITurma } from "@/Interfaces/ITurma";
import CriarDeck from "@/components/Decks/criar-deck";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ListarDeck from "@/components/Decks/listar-decks";

export default function TurmaDetalhePage() {
  const params = useParams();
  let id = params?.id;
  if (Array.isArray(id)) id = id[0];
  const [turma, setTurma] = useState<ITurma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    reqTurmaById(id)
      .then((data) => setTurma(data))
      .catch((err) => setError(err.message || "Erro ao buscar turma."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!turma) return <div>Turma não encontrada.</div>;

  return (
    <div>
      <header className="flex items-center mb-4 gap-2">
        <ChevronLeft className="" onClick={() => window.history.back()} />
        <div className="flex flex-col">
          <h1 className="font-semibold">{turma.title}</h1>
          <span className="text-gray-500 text-sm">
            {turma.description || "Sem descrição"}
          </span>
        </div>
      </header>

      <Separator />

      <div className="mt-4 flex justify-between items-center">
        <div>
          <h1 className="font-semibold">Decks</h1>
        </div>
        <div>
          <CriarDeck turmaId={turma.id} />
        </div>
      </div>

      <div className="mt-6">
        <ListarDeck turmaId={turma.id} />
      </div>
    </div>
  );
}
