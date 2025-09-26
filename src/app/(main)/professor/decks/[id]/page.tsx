"use client";

import { useParams, useSearchParams } from "next/navigation";
import CriarCardsDialog from "@/components/Cards/criar-cards";
import ListarCard from "@/components/Cards/listar-cards";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeckPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const title = searchParams.get("title") || "titulo do deck";
  const description = searchParams.get("description") || "descrição";
  const router = useRouter();

  return (
    <div>
      <span
        className="flex items-center text-primary"
        onClick={() => router.back()}
      >
        <ChevronLeft />
        Voltar
      </span>
      <div className="max-w-3xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lgxs font-bold">{title}</h1>
            <p className="text-gray-500 text-xs">{description}</p>
          </div>
          <CriarCardsDialog deckId={id} />
        </div>

        <ListarCard deckId={id} />
      </div>
    </div>
  );
}
