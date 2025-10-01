"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  Pause,
  Play as PlayIcon,
  SkipForward,
  RotateCcw,
  Check,
  X,
  Zap,
  Star,
} from "lucide-react";
import { useCardsFromDeck, useCreateSessionWithReviews } from "@/hooks/deckSession/reqDeckSession";

export default function StudyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = Number(searchParams.get("deckId"));
  const studentId = typeof window !== "undefined" ? localStorage.getItem("studentId") || "" : "";

  const { data: cards = [], isLoading, isError, error } = useCardsFromDeck(deckId);
  const { mutate: createSession } = useCreateSessionWithReviews();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  const [reviews, setReviews] = useState<{ cardId: number; result: "CORRECT" | "INCORRECT" }[]>([]);
  const sessionPostedRef = useRef(false);

  useEffect(() => {
    if (!isPaused && !isFinished) {
      const interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isFinished]);
  if (isLoading) return <div className="p-8 text-center">Carregando cards...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">{error?.message || "Erro ao buscar cards."}</div>;
  if (!cards.length) return <div className="p-8 text-center">Nenhum card encontrado.</div>;

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + (isFinished ? 1 : 0)) / cards.length) * 100;
  const answeredCards = correctAnswers + incorrectAnswers;
  const accuracy = answeredCards ? Math.round((correctAnswers / answeredCards) * 100) : 0;

  const finishSession = (finalReviews: { cardId: number; result: "CORRECT" | "INCORRECT" }[]) => {
    setIsFinished(true);
    setEndTime(Date.now());
    if (!sessionPostedRef.current && studentId && deckId && finalReviews.length) {
      sessionPostedRef.current = true;
      createSession({ studentId, deckId, reviews: finalReviews });
    }
  };

  const advanceToNextCard = (finalReviews: { cardId: number; result: "CORRECT" | "INCORRECT" }[]) => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
      setAnswered(false);
    } else {
      finishSession(finalReviews);
    }
  };

  const handleFlip = () => {
    if (!answered) setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (answered) return;
    setAnswered(true);
    const updatedReviews = [
      ...reviews,
      { cardId: currentCard.id ?? 0, result: correct ? "CORRECT" : "INCORRECT" },
    ];
    setReviews(updatedReviews);
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((current) => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setIncorrectAnswers((prev) => prev + 1);
      setStreak(0);
    }
    setTimeout(() => {
      advanceToNextCard(updatedReviews);
    }, 1200);
  };

  const skipCard = () => {
    setIncorrectAnswers((prev) => prev + 1);
    setStreak(0);
    const updatedReviews = [
      ...reviews,
      { cardId: currentCard.id ?? 0, result: "INCORRECT" },
    ];
    setReviews(updatedReviews);
    advanceToNextCard(updatedReviews);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Extraordinário! 🌟";
    if (percentage >= 80) return "Excelente! 🎉";
    if (percentage >= 70) return "Muito bom! 👏";
    if (percentage >= 60) return "Bom trabalho! 👍";
    return "Continue praticando! 💪";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Fácil";
      case "medium": return "Médio";
      case "hard": return "Difícil";
      default: return difficulty;
    }
  };

  // Results screen
  if (isFinished) {
    const totalTime = endTime ? Math.floor((endTime - startTime) / 1000) : sessionTime;

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Parabéns! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Deck:</span>
                  <span className="font-medium">{deckId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Precisão:
                  </span>
                  <span className={`font-bold text-lg ${getPerformanceColor(accuracy)}`}>
                    {accuracy}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Acertos:</span>
                  <span className="font-medium text-green-600">{correctAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Erros:</span>
                  <span className="font-medium text-red-600">{incorrectAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Maior sequência:
                  </span>
                  <span className="font-medium">{maxStreak}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tempo:
                  </span>
                  <span className="font-medium">{formatTime(totalTime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Pontos:
                  </span>
                  <span className="font-medium text-purple-600">{correctAnswers * 10 + maxStreak * 5}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-lg">{getPerformanceMessage(accuracy)}</p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => window.location.reload()} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Estudar Novamente
                </Button>
                <Button variant="outline" onClick={() => router.back()} className="w-full">
                  Voltar aos Decks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-semibold">Deck {deckId}</h2>
            <p className="text-sm text-gray-600">
              {currentCardIndex + 1} de {cards.length}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <PlayIcon className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </Button>
        </div>
        <Progress value={progress} className="h-2 mb-3" />
        {/* Stats Row */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatTime(sessionTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-orange-500" />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span>{accuracy}%</span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 pt-8">
        <div className="w-full max-w-md mx-auto">
          {/* Removido difficulty/category pois não existem em ICard */}
          <Card
            className="h-80 cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={handleFlip}
          >
            <CardContent className="h-full flex items-center justify-center p-6">
              <div className="text-center space-y-4">
                {!isFlipped ? (
                  <>
                    <div className="font-medium text-center">{currentCard.front}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Toque para ver a resposta
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-600 mb-2">Resposta:</div>
                    <div className="font-medium text-center">{currentCard.back}</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          {isFlipped && !answered && (
            <div className="mt-6 space-y-3">
              <div className="flex gap-4">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleAnswer(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Errei
                </Button>
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleAnswer(true)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Acertei
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full text-gray-500"
                onClick={skipCard}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Pular card
              </Button>
            </div>
          )}
          {answered && (
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                {currentCardIndex === cards.length - 1 ? "Finalizando..." : "Próximo card..."}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bottom Stats */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="font-medium text-green-600">{correctAnswers}</div>
            <div className="text-gray-500">Acertos</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-red-600">{incorrectAnswers}</div>
            <div className="text-gray-500">Erros</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-blue-600">{cards.length - currentCardIndex - 1}</div>
            <div className="text-gray-500">Restantes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
