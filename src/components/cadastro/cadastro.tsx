"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { reqCadastro } from "@/hooks/login/reqCadastro";
import {
  BookOpen,
  GraduationCap,
  UserPlus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Cadastro({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await reqCadastro(
      name,
      email,
      password,
      role as "STUDENT" | "PROFESSOR"
    );
    if (res.message) {
      setSuccess(res.message);
      setEmail("");
      setName("");
      setPassword("");
      setRole("STUDENT");
    } else {
      setError(res.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 sm:gap-8", className)} {...props}>
      {/* Header with branding */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md sm:rounded-2xl flex items-center justify-center shadow-lg">
          <UserPlus className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-3xl font-black text-foreground font-serif">
            Criar Conta
          </h1>
          <p className="text-sm text-slate-500">
            Preencha os dados para começar
          </p>
        </div>
      </div>

      <Card
        className="overflow-hidden border-0 shadow-xl 
                bg-gradient-to-b from-white via-green-50 to-green-100
                dark:from-green-200 dark:via-green-100 dark:to-green-200"
      >
        <div className="gradient-bg text-center p-4 rounded-2xl">
          <h2 className="text-2xl font-bold text-white font-serif">
            Comece sua Jornada
          </h2>
          <p className="text-emerald-100 font-medium">
            Todos os campos são obrigatórios
          </p>
        </div>

        <CardContent className="p-0">
          <form className="px-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="text-base font-semibold text-slate-700"
                >
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 border-2 border-green-300 dark:border-green-900 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-2 border-green-300 dark:border-green-900 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 border-2 border-green-300 dark:border-green-900 dark:bg-green-50 focus:border-emerald-500 
                      rounded-xl dark:text-black focus:ring-0 dark:focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="role"
                  className="text-base font-semibold text-slate-700"
                >
                  Tipo de Usuário
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger
                    id="role"
                    className="h-12 border-2 border-green-300 dark:border-green-900 dark:bg-green-50 focus:border-emerald-500 
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
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <p className="text-emerald-600 font-medium">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 gradient-bg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl font-semibold text-lg"
            >
              Criar Conta
            </Button>

            <div className="text-center pt-4">
              <p className="text-slate-600">
                Já tem uma conta?{" "}
                <a
                  href="/login"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors underline"
                >
                  Faça login aqui
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
