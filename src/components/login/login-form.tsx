"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { Loader2, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { reqLogin } from "@/hooks/login/reqLogin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// ----------------- Schema (Zod) -----------------
const loginSchema = z.object({
  email: z
    .email("E-mail inválido."),
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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
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
            email,
          }),
        });

        if (!cookieResponse.ok) {
          throw new Error("Erro ao definir o cookie");
        }

        if (userRole === "PROFESSOR") {
          toast.success("Login realizado com sucesso!");
          router.push("/professor");
        } else if (userRole === "STUDENT") {
          toast.success("Login realizado com sucesso!");
          router.push("/student");
        }
      } catch (err) {
        console.error(err);
        setError("root", { message: "Erro ao definir sessão." });
      }
    } else {
      setError("root", { message: res.error || "Erro ao fazer login." });
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md sm:rounded-2xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-3xl font-black text-foreground font-serif">
            FlashCards
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg font-medium dark:text-white">
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
        <TabsList className="mb-2 sm:mb-6 w-full grid grid-cols-2 h-9 sm:h-12 bg-slate-100 dark:bg-emerald-950 rounded-xl sm:p-1">
          <TabsTrigger
            value="aluno"
            className="flex items-center gap-2 rounded-lg font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-700 data-[state=active]:shadow-sm data-[state=active]:text-white"
          >
            <GraduationCap className="w-4 h-4" />
            Aluno
          </TabsTrigger>
          <TabsTrigger
            value="professor"
            className="flex items-center gap-2 rounded-lg font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-700 data-[state=active]:shadow-sm data-[state=active]:text-white"
          >
            <BookOpen className="w-4 h-4" />
            Professor
          </TabsTrigger>
        </TabsList>

        {/* Login ALUNO */}
        <TabsContent value="aluno" className="mt-0">
          <div
            className="overflow-hidden rounded-2xl shadow-xl 
            bg-gradient-to-b from-white via-green-50 to-green-100
            dark:from-green-200 dark:via-green-100 dark:to-green-200 pb-4"
          >
            <div className="gradient-bg text-center p-4 mb-6">
              <h2 className="text-2xl font-bold text-white font-serif">
                Bem-vindo, Estudante!
              </h2>
              <p className="text-emerald-100 font-medium">
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

                <div className="space-y-1">
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
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                    {...register("password")}
                  />
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
                className="w-full h-12 gradient-bg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 rounded-xl font-semibold text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2 text-white">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Entrando...
                  </span>
                ) : (
                  <span className="text-white">Começar a Aprender</span>
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
          </div>
        </TabsContent>

        {/* Login PROFESSOR */}
        <TabsContent value="professor" className="mt-0">
          <div
            className="overflow-hidden rounded-2xl shadow-xl 
            bg-gradient-to-b from-white via-green-50 to-green-100
            dark:from-green-200 dark:via-green-100 dark:to-green-200 pb-4"
          >
            <div className="gradient-bg text-center p-4 mb-6">
              <h2 className="text-2xl font-bold text-white font-serif">
                Bem-vindo, Professor!
              </h2>
              <p className="text-emerald-100 font-medium">
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

                <div className="space-y-1">
                  <Label
                    htmlFor="password-prof"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Senha
                  </Label>
                  <Input
                    id="password-prof"
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error-2" : undefined
                    }
                    className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                    {...register("password")}
                  />
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
                className="w-full h-12 gradient-bg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 rounded-xl font-semibold text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2 text-white">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Entrando...
                  </span>
                ) : (
                  <span className="text-white">Acessar Painel</span>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
