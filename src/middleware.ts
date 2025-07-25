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
  const token = request.cookies.get("token")?.value || "";
  const payload = token ? parseJwt(token) : null;
  const role = payload?.role;

  // Se estiver acessando /login ou /cadastro e já tiver token e role, redireciona para a página correta
  if ((request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/cadastro")) && token && role) {
    if (role === "STUDENT") {
      return NextResponse.redirect(new URL("/student", request.url));
    }
    if (role === "PROFESSOR") {
      return NextResponse.redirect(new URL("/professor", request.url));
    }
  }

  // Se não houver token, redireciona para /login (exceto se já estiver em /login ou /cadastro)
  if (!token && !(request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/cadastro"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
