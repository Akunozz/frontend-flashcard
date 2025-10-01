// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import {
//   ChevronLeft,
//   RotateCcw,
//   CheckCircle2,
//   XCircle,
//   Frown,
//   Meh,
//   Smile,
// } from "lucide-react";
// import type { ICard } from "@/Interfaces/ICard";
// import type { IDeckSession } from "@/Interfaces/IDeckSession";
// //import { submitReview } from "@/hooks/deckSession/reqDeckSession";
// import { cn } from "@/lib/utils";

// interface StudySessionProps {
//   session: IDeckSession;
//   cards: ICard[];
//   onComplete: () => void;
//   onBack: () => void;
// }

// export function StudySession({
//   session,
//   cards,
//   onComplete,
//   onBack,
// }: StudySessionProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const currentCard = cards[currentIndex];
//   const progress = (reviewedCards.size / cards.length) * 100;

//   useEffect(() => {
//     setIsFlipped(false);
//   }, [currentIndex]);

//   const handleReview = async (quality: number) => {
//     if (!currentCard || isSubmitting) return;

//     setIsSubmitting(true);
//     try {
//       await submitReview(session.id, currentCard.id!, quality);
//       setReviewedCards((prev) => new Set(prev).add(currentCard.id!));

//       if (currentIndex < cards.length - 1) {
//         setCurrentIndex((prev) => prev + 1);
//       } else {
//         onComplete();
//       }
//     } catch (error) {
//       console.error("[v0] Failed to submit review:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//   };

//   if (!currentCard) {
//     return (
//       <Card>
//         <CardContent className="flex flex-col items-center justify-center py-12">
//           <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
//           <h3 className="mb-2 text-2xl font-semibold">Sessão Concluída!</h3>
//           <p className="mb-6 text-muted-foreground">
//             Você revisou {reviewedCards.size} de {cards.length} cards
//           </p>
//           <Button onClick={onBack}>Voltar aos Decks</Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-3xl space-y-6">
//       {/* Header with progress */}
//       <div className="space-y-2">
//         <div className="flex items-center justify-between">
//           <Button variant="ghost" size="sm" onClick={onBack}>
//             <ChevronLeft className="mr-2 h-4 w-4" />
//             Voltar
//           </Button>
//           <Badge variant="secondary">
//             {currentIndex + 1} / {cards.length}
//           </Badge>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div>

//       {/* Flashcard */}
//       <Card className="min-h-[400px]">
//         <CardHeader>
//           <CardTitle className="text-center text-sm font-medium text-muted-foreground">
//             {isFlipped ? "Resposta" : "Pergunta"}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="flex min-h-[300px] items-center justify-center p-8">
//           <div
//             className={cn(
//               "w-full cursor-pointer text-center transition-all duration-300",
//               isFlipped && "animate-fade-in-up"
//             )}
//             onClick={handleFlip}
//           >
//             {currentCard.imageUrl && !isFlipped && (
//               <img
//                 src={currentCard.imageUrl || "/placeholder.svg"}
//                 alt="Card visual"
//                 className="mx-auto mb-4 max-h-48 rounded-lg object-contain"
//               />
//             )}
//             <p className="text-balance text-2xl font-medium leading-relaxed">
//               {isFlipped ? currentCard.back : currentCard.front}
//             </p>
//           </div>
//         </CardContent>
//         <CardFooter className="justify-center">
//           <Button variant="outline" size="sm" onClick={handleFlip}>
//             <RotateCcw className="mr-2 h-4 w-4" />
//             Virar Card
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* Review buttons */}
//       {isFlipped && (
//         <Card className="animate-fade-in-up">
//           <CardHeader>
//             <CardTitle className="text-center text-sm font-medium">
//               Como você avalia seu conhecimento?
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-3 md:grid-cols-5">
//               <Button
//                 variant="outline"
//                 className="flex flex-col gap-2 py-6 hover:border-destructive hover:bg-destructive/10 bg-transparent"
//                 onClick={() => handleReview(0)}
//                 disabled={isSubmitting}
//               >
//                 <XCircle className="h-6 w-6 text-destructive" />
//                 <span className="text-xs">Não lembrei</span>
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex flex-col gap-2 py-6 hover:border-orange-500 hover:bg-orange-500/10 bg-transparent"
//                 onClick={() => handleReview(1)}
//                 disabled={isSubmitting}
//               >
//                 <Frown className="h-6 w-6 text-orange-500" />
//                 <span className="text-xs">Difícil</span>
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex flex-col gap-2 py-6 hover:border-yellow-500 hover:bg-yellow-500/10 bg-transparent"
//                 onClick={() => handleReview(2)}
//                 disabled={isSubmitting}
//               >
//                 <Meh className="h-6 w-6 text-yellow-500" />
//                 <span className="text-xs">Médio</span>
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex flex-col gap-2 py-6 hover:border-primary hover:bg-primary/10 bg-transparent"
//                 onClick={() => handleReview(3)}
//                 disabled={isSubmitting}
//               >
//                 <Smile className="h-6 w-6 text-primary" />
//                 <span className="text-xs">Bom</span>
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex flex-col gap-2 py-6 hover:border-green-600 hover:bg-green-600/10 bg-transparent"
//                 onClick={() => handleReview(4)}
//                 disabled={isSubmitting}
//               >
//                 <CheckCircle2 className="h-6 w-6 text-green-600" />
//                 <span className="text-xs">Fácil</span>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
