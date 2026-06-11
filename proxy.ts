import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE, isTokenValid } from "@/lib/auth";

// Next.js 16: o antigo middleware agora se chama Proxy. Faz APENAS a checagem
// otimista do JWT (presença + exp) lida do cookie espelho — a verificação de
// assinatura é responsabilidade do backend. Defesa em profundidade junto do
// <AuthGuard> client.

// Rotas que exigem sessão. O resto é público (ex.: /login).
const PROTECTED = ["/", "/audit", "/dashboard"];

function isProtected(pathname: string): boolean {
  if (pathname === "/") return true;
  return PROTECTED.some((p) => p !== "/" && pathname.startsWith(p));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const valid = isTokenValid(token);

  // Já logado tentando ver /login -> manda pra home.
  if (pathname === "/login" && valid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rota protegida sem token válido -> login, preservando o destino.
  if (isProtected(pathname) && !valid) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Roda em tudo, menos assets estáticos e arquivos do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
