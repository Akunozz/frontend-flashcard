export default function ProfessorDashboardPage(){
  return <div>Dashboard do Professor - Em construção</div>;
}

// "use client";

// import { useParams, useRouter } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useReviewsByDeck } from "@/hooks/review/reqReview";
// import { useGetDeckById } from "@/hooks/decks/reqDeck";
// import { useCardsFromDeck } from "@/hooks/deckSession/reqDeckSession";
// import Loader from "@/components/loading/loader";
// import {
//   ArrowLeft,
//   Award,
//   CheckCircle2,
//   TrendingDown,
//   TrendingUp,
//   XCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
// import { Badge } from "@/components/ui/badge";
// import { useMemo } from "react";

// export default function DeckDashboardPage() {
//   const params = useParams();
//   const router = useRouter();
//   const deckId = Number(params.id);
//   const { data: deck, isLoading: loadingDeck } = useGetDeckById(deckId);
//   const {
//     data: cardStats = [],
//     isLoading: loadingStats,
//     isError,
//     error,
//   } = useReviewsByDeck(deckId);
//   const { data: cards = [], isLoading: loadingCards } =
//     useCardsFromDeck(deckId);

//   const stats = useMemo(() => {
//     if (!cardStats.length) return null;

//     const totalCorrect = cardStats.reduce((sum, stat) => sum + stat.correct, 0);
//     const totalIncorrect = cardStats.reduce(
//       (sum, stat) => sum + stat.incorrect,
//       0
//     );
//     const totalAttempts = totalCorrect + totalIncorrect;
//     const successRate =
//       totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

//     const sortedByDifficulty = [...cardStats].sort((a, b) => {
//       const aRate =
//         a.correct + a.incorrect > 0 ? a.correct / (a.correct + a.incorrect) : 0;
//       const bRate =
//         b.correct + b.incorrect > 0 ? b.correct / (b.correct + b.incorrect) : 0;
//       return aRate - bRate;
//     });

//     const mostDifficult = sortedByDifficulty.slice(0, 3);
//     const easiest = sortedByDifficulty.slice(-3).reverse();

//     return {
//       totalCorrect,
//       totalIncorrect,
//       totalAttempts,
//       successRate,
//       mostDifficult,
//       easiest,
//     };
//   }, [cardStats]);

//   const chartData = useMemo(() => {
//     return cardStats.map((stat) => {
//       const card = cards.find((c) => c.id === stat.cardId);
//       return {
//         cardId: stat.cardId,
//         name: card?.front.slice(0, 20) || `Card ${stat.cardId}`,
//         correct: stat.correct,
//         incorrect: stat.incorrect,
//         total: stat.correct + stat.incorrect,
//       };
//     });
//   }, [cardStats, cards]);

//   const chartConfig = {
//     correct: {
//       label: "Corretas",
//       color: "hsl(var(--chart-1))",
//     },
//     incorrect: {
//       label: "Incorretas",
//       color: "hsl(var(--chart-2))",
//     },
//   };

//   if (loadingDeck || loadingStats || loadingCards) return <Loader />;

//   if (isError) {
//     return (
//       <div className="container mx-auto p-6">
//         <div className="text-destructive font-medium">
//           {error?.message || "Erro ao buscar estatísticas."}
//         </div>
//       </div>
//     );
//   }

//   if (!cardStats.length) {
//     return (
//       <div className="container mx-auto p-6 space-y-6">
//         <Button variant="ghost" onClick={() => router.back()} className="mb-4">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Voltar
//         </Button>
//         <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10">
//           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
//             <Award className="w-8 h-8 text-primary" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">
//             Nenhuma estatística disponível
//           </h3>
//           <p className="text-muted-foreground text-sm text-center">
//             Os alunos ainda não estudaram este deck
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" onClick={() => router.back()}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Voltar
//         </Button>
//       </div>

//       {/* Title */}
//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//           Estatísticas do Deck
//         </h1>
//         <p className="text-muted-foreground">
//           {deck?.title || "Carregando..."}
//         </p>
//       </div>

//       {/* Overview Stats */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="border-2 bg-gradient-to-br from-green-500/10 to-green-600/5">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Corretas
//             </CardTitle>
//             <CheckCircle2 className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">
//               {stats?.totalCorrect || 0}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Respostas corretas
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="border-2 bg-gradient-to-br from-red-500/10 to-red-600/5">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Incorretas
//             </CardTitle>
//             <XCircle className="h-4 w-4 text-red-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">
//               {stats?.totalIncorrect || 0}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Respostas incorretas
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="border-2 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total de Tentativas
//             </CardTitle>
//             <Award className="h-4 w-4 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">
//               {stats?.totalAttempts || 0}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Respostas totais
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="border-2 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Taxa de Acerto
//             </CardTitle>
//             <TrendingUp className="h-4 w-4 text-purple-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-purple-600">
//               {stats?.successRate.toFixed(1)}%
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">Média geral</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Chart */}
//       <Card className="border-2">
//         <CardHeader>
//           <CardTitle>Desempenho por Card</CardTitle>
//           <CardDescription>
//             Comparação de respostas corretas e incorretas
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer config={chartConfig} className="h-[400px] w-full">
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="name"
//                 tickLine={false}
//                 tickMargin={10}
//                 axisLine={false}
//                 tickFormatter={(value) => value.slice(0, 15)}
//               />
//               <YAxis />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Bar
//                 dataKey="correct"
//                 fill="var(--color-chart-1)"
//                 radius={[4, 4, 0, 0]}
//               />
//               <Bar
//                 dataKey="incorrect"
//                 fill="var(--color-chart-2)"
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>

//       {/* Detailed Stats */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Most Difficult Cards */}
//         <Card className="border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingDown className="h-5 w-5 text-red-600" />
//               Cards Mais Difíceis
//             </CardTitle>
//             <CardDescription>Cards com menor taxa de acerto</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {stats?.mostDifficult.map((stat) => {
//               const card = cards.find((c) => c.id === stat.cardId);
//               const total = stat.correct + stat.incorrect;
//               const rate = total > 0 ? (stat.correct / total) * 100 : 0;

//               return (
//                 <div
//                   key={stat.cardId}
//                   className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-500/5 to-red-600/5 border border-red-200/20"
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-sm truncate">
//                       {card?.front || `Card ${stat.cardId}`}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {stat.correct} corretas / {stat.incorrect} incorretas
//                     </p>
//                   </div>
//                   <Badge
//                     variant={rate < 50 ? "destructive" : "secondary"}
//                     className="ml-2"
//                   >
//                     {rate.toFixed(0)}%
//                   </Badge>
//                 </div>
//               );
//             })}
//           </CardContent>
//         </Card>

//         {/* Easiest Cards */}
//         <Card className="border-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-green-600" />
//               Cards Mais Fáceis
//             </CardTitle>
//             <CardDescription>Cards com maior taxa de acerto</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {stats?.easiest.map((stat) => {
//               const card = cards.find((c) => c.id === stat.cardId);
//               const total = stat.correct + stat.incorrect;
//               const rate = total > 0 ? (stat.correct / total) * 100 : 0;

//               return (
//                 <div
//                   key={stat.cardId}
//                   className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/5 to-green-600/5 border border-green-200/20"
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-sm truncate">
//                       {card?.front || `Card ${stat.cardId}`}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {stat.correct} corretas / {stat.incorrect} incorretas
//                     </p>
//                   </div>
//                   <Badge
//                     variant={rate >= 70 ? "default" : "secondary"}
//                     className="ml-2 bg-green-600"
//                   >
//                     {rate.toFixed(0)}%
//                   </Badge>
//                 </div>
//               );
//             })}
//           </CardContent>
//         </Card>
//       </div>

//       {/* All Cards Table */}
//       <Card className="border-2">
//         <CardHeader>
//           <CardTitle>Todos os Cards</CardTitle>
//           <CardDescription>
//             Estatísticas detalhadas de cada card
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             {chartData.map((data) => {
//               const rate =
//                 data.total > 0 ? (data.correct / data.total) * 100 : 0;
//               return (
//                 <div
//                   key={data.cardId}
//                   className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-primary/50 transition-colors bg-gradient-to-r from-card to-secondary/10"
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium truncate">{data.name}</p>
//                     <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
//                       <span className="flex items-center gap-1">
//                         <CheckCircle2 className="h-3 w-3 text-green-600" />
//                         {data.correct}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <XCircle className="h-3 w-3 text-red-600" />
//                         {data.incorrect}
//                       </span>
//                       <span>Total: {data.total}</span>
//                     </div>
//                   </div>
//                   <Badge
//                     variant={
//                       rate >= 70
//                         ? "default"
//                         : rate >= 50
//                         ? "secondary"
//                         : "destructive"
//                     }
//                     className="ml-4"
//                   >
//                     {rate.toFixed(0)}%
//                   </Badge>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
