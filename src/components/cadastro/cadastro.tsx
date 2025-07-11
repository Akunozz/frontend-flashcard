"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reqCadastro } from "@/hooks/reqLogin/reqCadastro";

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
    const res = await reqCadastro(name, email, password, role as "STUDENT" | "PROFESSOR");
    if (res.token) {
      setSuccess("Cadastro realizado com sucesso!");
      setEmail(""); setName(""); setPassword(""); setRole("STUDENT");
    } else {
      setError(res.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role">Tipo de usuário</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Aluno</SelectItem>
                  <SelectItem value="PROFESSOR">Professor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button type="submit" className="w-full">Cadastrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
