export default function StudentStudyPage() {
  return <div>Estudar - Em construção</div>;
}

// "use client";
// import { Suspense, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import {
//   Trophy,
//   Target,
//   RotateCcw,
//   Check,
//   X,
//   Zap,
// } from "lucide-react";
// import {
//   useCardsFromDeck,
//   useDeckSession,
// } from "@/hooks/deckSession/reqDeckSession";
// import Loader from "@/components/loading/loader";
// import BackButton from "@/components/BackButton/back-button";
// import Cookies from "js-cookie";

// export default function StudyPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const deckId = Number(searchParams.get("deckId"));
//   const studentId = Cookies.get("id") ?? "";
//   const title = searchParams.get("title") || "Título do deck";

//   const {
//     data: cards = [],
//     isLoading,
//     isError,
//     error,
//   } = useCardsFromDeck(deckId);
//   const { mutate: createSession } = useDeckSession();
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [incorrectAnswers, setIncorrectAnswers] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [answered, setAnswered] = useState(false);
//   const [streak, setStreak] = useState(0);
//   const [maxStreak, setMaxStreak] = useState(0);
//   const [reviews, setReviews] = useState<
//     { cardId: number; result: "CORRECT" | "INCORRECT" }[]
//   >([]);

//   if (isLoading) return <Loader />;
//   if (isError)
//     return (
//       <div className="p-8 text-center text-red-500">
//         {error?.message || "Erro ao buscar cards."}
//       </div>
//     );
//   if (!cards.length)
//     return (
//       <div>
//         <BackButton />
//         <div className="p-8 text-center">Nenhum card encontrado.</div>
//       </div>
//     );

//   const currentCard = cards[currentCardIndex];
//   const progress =
//     ((currentCardIndex + (isFinished ? 1 : 0)) / cards.length) * 100;
//   const answeredCards = correctAnswers + incorrectAnswers;
//   const accuracy = answeredCards
//     ? Math.round((correctAnswers / answeredCards) * 100)
//     : 0;

//   const finishSession = (
//     finalReviews: { cardId: number; result: "CORRECT" | "INCORRECT" }[]
//   ) => {
//     setIsFinished(true);
//     createSession({ studentId, deckId, reviews: finalReviews });
//   };

//   const advanceToNextCard = (
//     finalReviews: { cardId: number; result: "CORRECT" | "INCORRECT" }[]
//   ) => {
//     if (currentCardIndex < cards.length - 1) {
//       setCurrentCardIndex((prev) => prev + 1);
//       setIsFlipped(false);
//       setAnswered(false);
//     } else {
//       finishSession(finalReviews);
//     }
//   };

//   const handleFlip = () => {
//     if (!answered) setIsFlipped(!isFlipped);
//   };

//   const handleAnswer = (correct: boolean) => {
//     if (answered) return;
//     setAnswered(true);
//     const updatedReviews: {
//       cardId: number;
//       result: "CORRECT" | "INCORRECT";
//     }[] = [
//       ...reviews,
//       {
//         cardId: currentCard.id ?? 0,
//         result: correct ? "CORRECT" : "INCORRECT",
//       },
//     ];
//     setReviews(updatedReviews);
//     if (correct) {
//       setCorrectAnswers((prev) => prev + 1);
//       setStreak((prev) => {
//         const newStreak = prev + 1;
//         setMaxStreak((current) => Math.max(current, newStreak));
//         return newStreak;
//       });
//     } else {
//       setIncorrectAnswers((prev) => prev + 1);
//       setStreak(0);
//     }
//     advanceToNextCard(updatedReviews);
//   };

//   const getPerformanceColor = (percentage: number) => {
//     if (percentage >= 80) return "text-green-600";
//     if (percentage >= 60) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getPerformanceMessage = (percentage: number) => {
//     if (percentage >= 90) return "Extraordinário! 🌟";
//     if (percentage >= 80) return "Excelente! 🎉";
//     if (percentage >= 70) return "Muito bom! 👏";
//     if (percentage >= 60) return "Bom trabalho! 👍";
//     return "Continue praticando! 💪";
//   };

//   if (isFinished) {
//     return (
//       <div className="min-h-screen p-4">
//         <div className="max-w-md mx-auto pt-8">
//           <Card className="border-0 text-center bg-gradient-to-br from-white via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800">
//             <CardHeader>
//               <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                 <Trophy className="w-8 h-8 text-blue-600" />
//               </div>
//               <CardTitle>FlashCard finalizado! 🎉</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex justify-center items-center gap-1">
//                   <span className="font-medium">Deck:</span>
//                   <span className="font-medium text-primary">{title}</span>
//                 </div>
//                 <div className="flex justify-between items-center font-medium">
//                   <span className="flex items-center gap-2 text-blue-500">
//                     <Target className="w-4 h-4" />
//                     Precisão:
//                   </span>
//                   <span
//                     className={`font-bold text-lg ${getPerformanceColor(
//                       accuracy
//                     )}`}
//                   >
//                     {accuracy}%
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center text-green-600 font-medium">
//                   <span>Acertos:</span>
//                   <span>{correctAnswers}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-red-500 font-medium">
//                   <span>Erros:</span>
//                   <span>{incorrectAnswers}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-orange-500 font-medium">
//                   <span className="flex items-center gap-2">
//                     <Zap className="w-4 h-4" />
//                     Maior sequência:
//                   </span>
//                   <span>{maxStreak}</span>
//                 </div>
//               </div>
//               <div className="dark:bg-zinc-700 p-4 rounded-lg">
//                 <p className="font-medium text-lg">
//                   {getPerformanceMessage(accuracy)}
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 <Button
//                   onClick={() => window.location.reload()}
//                   className="w-full text-white"
//                 >
//                   <RotateCcw className="w-4 h-4 mr-2" />
//                   Estudar Novamente
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => router.back()}
//                   className="w-full"
//                 >
//                   Voltar aos Decks
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Suspense>
//       <div className="bg-background">
//         <header className="mb-2">
//           <BackButton />
//         </header>
//         <div>
//           <div className="max-w-2xl mx-auto">
//             <h1 className="text-2xl text-primary font-bold text-center mb-4">
//               {title}
//             </h1>
//           </div>
//           <div className="flex items-center justify-between mb-3 text-sm font-medium"></div>
//           <p className="text-sm text-gray-600 text-center">
//             Card {currentCardIndex + 1} de {cards.length}
//           </p>
//           <Progress value={progress} className="h-2 my-2" />
//           {/* Stats Row */}
//           <div className="flex justify-between items-center text-sm">
//             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full">
//               <Target />
//               <span className="font-bold">{accuracy}%</span>
//             </div>
//             {streak > 0 && (
//               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full dark:animate-pulse">
//                 <Zap className="w-4 h-4 fill-current" />
//                 <span className="font-bold">{streak}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 pt-12 pb-32">
//           <div className="w-full max-w-2xl mx-auto">
//             <div className="relative h-96" onClick={handleFlip}>
//               <div
//                 className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
//                   isFlipped ? "rotate-y-180" : ""
//                 }`}
//                 style={{
//                   transformStyle: "preserve-3d",
//                   transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
//                 }}
//               >
//                 <Card
//                   className={`absolute inset-0 backface-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-white to-emerald-50 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-900 ${
//                     !isFlipped ? "block" : "hidden"
//                   }`}
//                   style={{ backfaceVisibility: "hidden" }}
//                 >
//                   <CardContent className="h-full flex flex-col items-center justify-center p-2">
//                     <div className="text-2xl font-bold text-center mb-8 text-balance leading-relaxed">
//                       {currentCard.front}
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <RotateCcw className="w-4 h-4" />
//                       Toque para revelar a resposta
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card
//                   className={`absolute inset-0 backface-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-white to-emerald-50 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-900 ${
//                     isFlipped ? "block" : "hidden"
//                   }`}
//                   style={{
//                     backfaceVisibility: "hidden",
//                     transform: "rotateY(180deg)",
//                   }}
//                 >
//                   <CardContent className="h-full flex flex-col items-center justify-center p-8">
//                     <div className="text-sm font-medium text-primary mb-3">
//                       Resposta
//                     </div>
//                     <div className="text-2xl font-bold text-center text-balance leading-relaxed">
//                       {currentCard.back}
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
//                       <RotateCcw className="w-4 h-4" />
//                       Toque para visualizar a pergunta
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             {isFlipped && !answered && (
//               <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
//                 <p className="text-center text-sm font-medium text-muted-foreground mb-4">
//                   Você acertou?
//                 </p>
//                 <div className="flex gap-4">
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="flex-1 gap-2 text-lg border-2 border-rose-300 dark:border-rose-400 hover:bg-rose-50 bg-transparent text-rose-500"
//                     onClick={() => handleAnswer(false)}
//                   >
//                     <X className="w-6 h-6" />
//                     <span className="font-semibold">Errei</span>
//                   </Button>
//                   <Button
//                     size="lg"
//                     className="flex-1 gap-2 text-lg text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
//                     onClick={() => handleAnswer(true)}
//                   >
//                     <Check className="w-6 h-6" />
//                     <span className="font-semibold">Acertei</span>
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Bottom Stats */}
//         <div className="fixed bottom-0 left-0 right-0 bg-zinc-100 border-zinc-100 dark:bg-zinc-800 dark:border-zinc-800 border-t rounded-t-2xl p-6">
//           <div className="flex justify-center gap-8 text-sm">
//             <div className="text-center">
//               <div className="font-medium text-red-600">{incorrectAnswers}</div>
//               <div className="text-gray-500">Erros</div>
//             </div>
//             <div className="text-center">
//               <div className="font-medium text-blue-600">
//                 {cards.length - currentCardIndex}
//               </div>
//               <div className="text-gray-500">Restantes</div>
//             </div>
//             <div className="text-center">
//               <div className="font-medium text-green-600">{correctAnswers}</div>
//               <div className="text-gray-500">Acertos</div>
//             </div>
//           </div>
//         </div>                                                                                                                                  
//       </div>
//     </Suspense>
//   );
// }
