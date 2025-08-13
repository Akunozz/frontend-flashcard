"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addAluno } from "@/hooks/turma/reqTurma";
import { toast } from "sonner";

interface EntrarTurmaProps {
  studentId: string;
}

export default function EntrarTurma({ studentId }: EntrarTurmaProps) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log("id aluno:", studentId);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const turmaAluno = await addAluno(token, studentId);
      toast.success("Você entrou na turma com sucesso!");
    } catch (err: any) {
      setError(err?.message || "Erro ao entrar na turma");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <label htmlFor="token">Código da turma</label>
      <Input
        id="token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Digite o código da turma"
        required
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Entrando..." : "Entrar na turma"}
      </Button>
    </form>
  );
}
