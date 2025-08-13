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

export default function Cadastro() {
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center space-y-6 mb-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl bounce-in">
          <UserPlus className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-foreground font-serif mb-2">
            Criar Conta
          </h1>
          <p className="text-muted-foreground text-xl font-medium">
            Junte-se à comunidade
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Preencha os dados para começar
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-center py-8">
          <h2 className="text-2xl font-bold text-white font-serif mb-2">
            Comece sua Jornada
          </h2>
          <p className="text-emerald-100 font-medium">
            Todos os campos são obrigatórios
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-3">
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
                  className="h-14 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors text-base"
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
                  className="h-14 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors text-base"
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
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-14 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors text-base"
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
                    className="h-14 border-2 border-slate-200 focus:border-emerald-400 rounded-xl transition-colors text-base"
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
