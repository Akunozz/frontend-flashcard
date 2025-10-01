"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  GraduationCap,
  UserPlus,
  Loader2,
} from "lucide-react";
import { reqCadastro } from "@/hooks/login/reqCadastro";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ----------------- Schema (Zod) -----------------
const cadastroSchema = z.object({
  name: z.string().min(1, "Informe seu nome.").min(3, "Nome muito curto."),
  email: z.email("E-mail inválido."),
  password: z
    .string()
    .min(1, "Informe a senha.")
    .min(6, "A senha deve ter ao menos 6 caracteres."),
  role: z.enum(["STUDENT", "PROFESSOR"], {
    error: "Selecione o tipo de usuário.",
  }),
});
type CadastroValues = z.infer<typeof cadastroSchema>;
// ------------------------------------------------

export default function Cadastro() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CadastroValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });

  const onSubmit = async (data: CadastroValues) => {
    const { name, email, password, role } = data;
    const res = await reqCadastro(name, email, password, role);
    if (res.message) {
      toast.success(res.message || "Conta criada com sucesso!");
      reset({ name: "", email: "", password: "", role: "STUDENT" });
      router.push("/login");
    } else {
      toast.error(res.error || "Erro ao criar a conta.");
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
          <UserPlus className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent dark:text-white">
            Criar Conta
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg font-medium mt-2 dark:text-zinc-200">
            Preencha os dados para começar
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl shadow-2xl bg-white to-card border-2 border-border dark:border-none pb-6">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-center p-6 mb-6 dark:text-white">
          <h2 className="text-2xl font-bold text-white font-serif">
            Comece sua Jornada
          </h2>
          <p className="text-white/90 font-medium mt-1">
            Preencha todos os campos
          </p>
        </div>

        <form className="px-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Nome */}
            <div className="space-y-1">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700"
              >
                Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                {...register("name")}
              />
              {errors.name && (
                <p id="name-error" className="text-red-600 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-base font-semibold text-slate-700"
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

            {/* Senha */}
            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-base font-semibold text-slate-700"
              >
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="*******"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="text-red-600 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Tipo de usuário */}
            <div className="space-y-1">
              <Label
                htmlFor="role"
                className="text-base font-semibold text-slate-700"
              >
                Tipo de Usuário
              </Label>

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="STUDENT"
                  >
                    <SelectTrigger
                      id="role"
                      className="h-12 border-2 border-zinc-500 dark:border-zinc-700 dark:bg-green-50 focus:border-emerald-500 
                        rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="STUDENT" className="rounded-lg h-12">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-5 h-5 text-emerald-600" />
                          <span className="text-base">Aluno</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PROFESSOR" className="rounded-lg h-12">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-emerald-600" />
                          <span className="text-base">Professor</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Erros/Sucesso */}
          {/* {(errors.root?.message || success) && (
            <>
              {errors.root?.message && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 font-medium">
                    {errors.root.message}
                  </p>
                </div>
              )}
              {success && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <p className="text-emerald-600 font-medium">{success}</p>
                </div>
              )}
            </>
          )} */}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-semibold text-base"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando...
              </span>
            ) : (
              "Criar Conta"
            )}
          </Button>

          <div className="text-center pt-2">
            <p className="text-muted-foreground text-sm">
              Já tem uma conta?{" "}
              <a
                href="/login"
                className="text-primary font-semibold hover:text-accent transition-colors"
              >
                Faça login aqui
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
