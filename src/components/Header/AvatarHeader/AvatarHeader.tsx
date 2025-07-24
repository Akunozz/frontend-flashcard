"use Link";

import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AvatarHeader() {
  const router = useRouter();

  function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = name + '=; Max-Age=0; path=/;';
  }

  function logout() {
    // Limpa cookies
    deleteCookie("name");
    deleteCookie("email");
    deleteCookie("token");
    deleteCookie("role");
    // Limpa localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
    }
    // Redireciona para login
    router.push("/login");
  }
function getCookieValue(cookieName: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp("(^| )" + cookieName + "=([^;]+)")
  );
  if (match) {
    return decodeURIComponent(match[2]);
  }
  return "";
}

const nome = getCookieValue("name");
const email = getCookieValue("email");
const primeiraLetraNome = nome ? nome.charAt(0).toUpperCase() : "";
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-blue-500 text-white text-lg">{primeiraLetraNome}</AvatarFallback>
        </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{nome}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/configuracoes/perfil">
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/configuracoes">
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}