"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, GraduationCap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { reqLogin } from "@/hooks/login/reqLogin";
import { useRouter } from "next/navigation";
import type { ILogin } from "@/Interfaces/ILogin";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState<ILogin["email"]>("");
  const [password, setPassword] = useState<ILogin["password"]>("");
  const [role, setRole] = useState<ILogin["role"]>("STUDENT");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    const res = await reqLogin(email, password, role);
    const userRole = res.user?.role;
    const userId = res.user?.id;
    const userName = res.user?.name;
    if (res.access_token && userRole) {
      try {
        const cookieResponse = await fetch("/api/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: res.access_token,
            role: userRole,
            id: userId,
            name: userName,
            email: email,
          }),
        });

        if (!cookieResponse.ok) {
          throw new Error("Erro ao definir o cookie");
        }
        if (userRole === "PROFESSOR") {
          router.push("/professor");
        } else if (userRole === "STUDENT") {
          router.push("/student");
        }
      } catch (err) {
        setError("Erro ao definir sessão");
        console.error(err);
      }
    } else {
      setError(res.error || "Erro ao fazer login");
    }
    setIsPending(false);
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      {/* Header with branding */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground font-serif">
            FlashCards
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Aprenda de Forma Inteligente
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="aluno"
        onValueChange={(v) => setRole(v === "aluno" ? "STUDENT" : "PROFESSOR")}
        className="w-full"
      >
        <TabsList className="mb-6 w-full grid grid-cols-2 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <TabsTrigger
            value="aluno"
            className="flex items-center gap-2 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <GraduationCap className="w-4 h-4" />
            Aluno
          </TabsTrigger>
          <TabsTrigger
            value="professor"
            className="flex items-center gap-2 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            Professor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aluno" className="mt-0">
          <Card className="overflow-hidden border-0 shadow-xl bg-zinc-100 dark:bg-white backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="gradient-bg p-6 text-center">
                <h2 className="text-2xl font-bold text-white font-serif">
                  Bem-vindo, Estudante!
                </h2>
                <p className="text-emerald-100 font-medium">
                  Desbloqueie seu conhecimento com flashcards envolventes
                </p>
              </div>

              <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 gradient-bg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 rounded-xl font-semibold text-lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      Entrando...
                    </span>
                  ) : (
                    "Começar a Aprender"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-slate-600 text-sm">
                    Não tem conta?{" "}
                    <a
                      href="/cadastro"
                      className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                      Cadastre-se aqui
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professor" className="mt-0">
          <Card className="overflow-hidden border-0 shadow-xl bg-zinc-100 dark:bg-white backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="gradient-bg p-6 text-center">
                <h2 className="text-2xl font-bold text-white font-serif">
                  Bem-vindo, Professor!
                </h2>
                <p className="text-emerald-100 font-medium">
                  Crie e gerencie flashcards para seus alunos
                </p>
              </div>

              <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="professor@escola.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 gradient-bg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 rounded-xl font-semibold text-lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      Entrando...
                    </span>
                  ) : (
                    "Acessar Painel"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-slate-600 text-sm">
                    Não tem conta?{" "}
                    <a
                      href="/cadastro"
                      className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                      Cadastre-se aqui
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-xs text-slate-500 space-y-1">
        <p>Ao continuar, você concorda com nossos</p>
        <div className="space-x-4">
          <a
            href="#"
            className="underline hover:text-emerald-600 transition-colors"
          >
            Termos de Serviço
          </a>
          <a
            href="#"
            className="underline hover:text-emerald-600 transition-colors"
          >
            Política de Privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
