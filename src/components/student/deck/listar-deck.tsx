"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Clock } from "lucide-react";
import type { IDeck } from "@/Interfaces/IDeck";

interface DeckListProps {
  decks: IDeck[];
  onStartStudy: (deckId: number) => void;
  isLoading?: boolean;
}

export function DeckList({ decks, onStartStudy, isLoading }: DeckListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!decks || decks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            Nenhum deck disponível no momento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Card key={deck.id} className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-balance">
              <Brain className="h-5 w-5 text-primary" />
              {deck.title}
            </CardTitle>
            {deck.description && (
              <CardDescription className="text-pretty">
                {deck.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{deck.cards?.length || 0} cards</span>
              </div>
              {deck.sessions && deck.sessions.length > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{deck.sessions.length} sessões</span>
                </div>
              )}
            </div>
            <Button
              onClick={() => onStartStudy(deck.id)}
              className="w-full"
              disabled={!deck.cards || deck.cards.length === 0}
            >
              Iniciar Estudo
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
