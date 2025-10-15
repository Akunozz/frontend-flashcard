"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  GraduationCap,
  BookOpen,
  BookCopy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { reqLogin } from "@/hooks/login/reqLogin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";

// ----------------- Schema (Zod) -----------------
const loginSchema = z.object({
  email: z.email("E-mail inválido."),
  password: z
    .string()
    .nonempty("Informe a senha.")
    .min(6, "A senha deve ter ao menos 6 caracteres."),
  role: z.enum(["STUDENT", "PROFESSOR"], {
    error: "Selecione o perfil de acesso.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
// ------------------------------------------------

export function LoginForm() {
  const router = useRouter();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "STUDENT",
    },
    shouldUnregister: false,
    mode: "onSubmit",
  });
  const role = watch("role");
  const currentTab = role === "STUDENT" ? "aluno" : "professor";

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password, role } = data;
    const response = await reqLogin(email, password, role);
    const userRole = response.user?.role;
    const userId = response.user?.id;
    const userName = response.user?.name;

    if (response.access_token && userRole) {
      try {
        const cookieResponse = await fetch("/api/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: response.access_token,
            role: userRole,
            id: userId,
            name: userName,
            email,
          }),
        });

        if (!cookieResponse.ok) {
          throw new Error("Erro ao definir o cookie");
        }

        if (userRole === "PROFESSOR") {
          toast.success("Login realizado com sucesso!");
          router.push("/professor");
        }
        if (userRole === "STUDENT") {
          toast.success("Login realizado com sucesso!");
          router.push("/student");
        }
      } catch (err: any) {
        toast.error(err?.message || "Erro ao definir sessão.");
      }
    } else {
      toast.error(response.error || response.message || "Erro ao fazer login.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl">
          <BookCopy className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-emerald-500">
            FlashCards
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-2 dark:text-gray-300">
            Aprenda de Forma Divertida
          </p>
        </div>
      </div>
      <Tabs
        value={currentTab}
        onValueChange={(v) =>
          setValue("role", v === "aluno" ? "STUDENT" : "PROFESSOR", {
            shouldValidate: true,
          })
        }
        className="w-full"
      >
        <TabsList className="mb-4 w-full grid grid-cols-2 h-11">
          <TabsTrigger
            value="aluno"
            className="flex items-center gap-2 rounded-lg font-semibold text-base data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-emerald-600 dark:data-[state=active]:text-white"
          >
            <GraduationCap className="w-4 h-4" />
            Aluno
          </TabsTrigger>
          <TabsTrigger
            value="professor"
            className="flex items-center gap-2 rounded-lg font-semibold text-base data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-emerald-600 dark:data-[state=active]:text-white"
          >
            <BookOpen className="w-4 h-4" />
            Professor
          </TabsTrigger>
        </TabsList>

        {/* Login ALUNO */}
        <TabsContent value="aluno">
          <div className="overflow-hidden rounded-2xl shadow-2xl bg-white to-card pb-6">
            <div className="bg-gradient-to-r from-primary to-emerald-700 text-center p-6 mb-6 dark:text-white">
              <h2 className="text-2xl font-bold text-white font-serif">
                Bem-vindo, Estudante!
              </h2>
              <p className="text-white/90 font-medium mt-1">
                Desbloqueie seu conhecimento com flashcards
              </p>
            </div>

            <form className="px-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-1">
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
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-600 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 relative">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type={senhaVisivel ? "text" : "password"}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500 pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setSenhaVisivel((v) => !v)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-primary transition-colors"
                    aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {senhaVisivel ? <Eye /> : <EyeOff />}
                  </button>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-red-600 text-xs mt-1"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* {(errors.root?.message || errors.role) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  {errors.root?.message && (
                    <p className="text-red-600 text-sm font-medium">
                      {errors.root.message}
                    </p>
                  )}
                  {errors.role && (
                    <p className="text-red-600 text-sm font-medium">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              )} */}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-emerald-700 text-white hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-semibold text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Entrando...
                  </span>
                ) : (
                  "Começar a Aprender"
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-muted-foreground text-sm">
                  Não tem conta?{" "}
                  <a href="/cadastro" className="text-primary font-semibold">
                    Cadastre-se aqui
                  </a>
                </p>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Login PROFESSOR */}
        <TabsContent value="professor" className="mt-0">
          <div className="overflow-hidden rounded-2xl shadow-2xl bg-white to-card border-0 pb-6">
            <div className="bg-gradient-to-br from-primary to-emerald-700 text-center p-6 mb-6">
              <h2 className="text-2xl font-bold text-white font-serif">
                Bem-vindo, Professor!
              </h2>
              <p className="text-white/90 font-medium mt-1">
                Crie e gerencie flashcards para seus alunos
              </p>
            </div>

            <form className="px-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="email-prof"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email
                  </Label>
                  <Input
                    id="email-prof"
                    type="email"
                    placeholder="professor@escola.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "email-error-2" : undefined
                    }
                    className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p id="email-error-2" className="text-red-600 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 relative">
                  <Label
                    htmlFor="password-prof"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Senha
                  </Label>
                  <Input
                    id="password-prof"
                    type={senhaVisivel ? "text" : "password"}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error-2" : undefined
                    }
                    className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500 pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setSenhaVisivel((v) => !v)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-primary transition-colors"
                    aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {senhaVisivel ? <Eye /> : <EyeOff />}
                  </button>
                  {errors.password && (
                    <p
                      id="password-error-2"
                      className="text-red-600 text-xs mt-1"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* {(errors.root?.message || errors.role) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  {errors.root?.message && (
                    <p className="text-red-600 text-sm font-medium">
                      {errors.root.message}
                    </p>
                  )}
                  {errors.role && (
                    <p className="text-red-600 text-sm font-medium">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              )} */}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-emerald-700 text-white hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-semibold text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Entrando...
                  </span>
                ) : (
                  "Acessar Painel"
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-muted-foreground text-sm">
                  Não tem conta?{" "}
                  <a
                    href="/cadastro"
                    className="text-primary font-semibold hover:text-accent transition-colors"
                  >
                    Cadastre-se aqui
                  </a>
                </p>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
