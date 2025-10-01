"use client";

import { useParams, useSearchParams } from "next/navigation";
import CriarCardsDialog from "@/components/professor/Cards/criar-cards";
import ListarCard from "@/components/professor/Cards/listar-cards";
import { BookCopy } from "lucide-react";
import BackButton from "@/components/BackButton/back-button";

export default function DeckPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params?.id);
  const title = searchParams.get("title") || "Título do deck";
  const description = searchParams.get("description") || "Descrição";

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-8 shadow-xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <BookCopy className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <p className="text-emerald-100 text-lg">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-500 rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">Flashcards</h2>
          </div>
          <div>
            <CriarCardsDialog deckId={id} />
          </div>
        </div>

        <ListarCard deckId={id} />
      </div>
    </div>
  );
}
