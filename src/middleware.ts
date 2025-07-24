import { NextRequest, NextResponse } from "next/server";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Permitir acesso livre à página de login e cadastro
  if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/cadastro")) {
    return NextResponse.next();
  }

  // Verifica se o token está presente no cookie
  const token = request.cookies.get("token")?.value || "";

  // Se não houver token, redireciona para /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decodifica o token para pegar o role
  const payload = parseJwt(token);
  const role = payload?.role;

  // Impede que student acesse /professor
  if (role === "STUDENT" && request.nextUrl.pathname.startsWith("/professor")) {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // Impede que professor acesse /student
  if (role === "PROFESSOR" && request.nextUrl.pathname.startsWith("/student")) {
    return NextResponse.redirect(new URL("/professor", request.url));
  }

  // Se houver token e permissão, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
