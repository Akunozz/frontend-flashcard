"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { reqLogin } from "@/hooks/reqLogin/reqLogin";
import logo from "@/assets/logo.png";
import Image from "next/image";
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
    console.log(res);
    const userRole = res.user?.role;
    const userId = res.user?.id;
    const userName = res.user?.name;
    if (res.access_token && userRole) {
      try {
        // Define cookie chamando a rota criada anteriormente
        const cookieResponse = await fetch("/api/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: res.access_token,
            role: userRole,
            id: userId,
            name: userName,
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Tabs
        defaultValue="aluno"
        onValueChange={(v) => setRole(v === "aluno" ? "STUDENT" : "PROFESSOR")}
      >
        <TabsList className="mb-4 w-full grid grid-cols-2">
          <TabsTrigger value="aluno">Aluno</TabsTrigger>
          <TabsTrigger value="professor">Professor</TabsTrigger>
        </TabsList>
        <TabsContent value="aluno">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8 w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Bem-vindo</h1>
                    <p className="text-muted-foreground text-balance">
                      Faça login como Aluno
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin size-4" /> Entrando...
                      </span>
                    ) : (
                      "Login como Aluno"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm mt-4">
                  Não tem conta?{" "}
                  <a href="/cadastro" className="underline underline-offset-4">
                    Cadastra-se
                  </a>
                </div>
              </form>
              <div className="bg-muted relative hidden md:block">
                <Image
                  src={logo}
                  alt="Logo"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="professor">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8 w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Bem-vindo</h1>
                    <p className="text-muted-foreground text-balance">
                      Faça login como Professor
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin size-4" /> Entrando...
                      </span>
                    ) : (
                      "Login como Professor"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm mt-4">
                  Não tem conta?{" "}
                  <a href="/cadastro" className="underline underline-offset-4">
                    Cadastra-se
                  </a>
                </div>
              </form>
              <div className="bg-muted relative hidden md:block">
                <Image
                  src={logo}
                  alt="Image"
                  width={500}
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  );
}
