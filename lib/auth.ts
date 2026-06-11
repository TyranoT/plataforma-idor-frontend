// Camada de auth do cliente. O JWT vive em DOIS lugares de propósito:
//  - localStorage: lido pelo cliente API para montar o header Authorization: Bearer.
//  - cookie espelho: lido pelo proxy.ts (servidor) para a checagem otimista de rota.
// O proxy NÃO enxerga localStorage, daí o cookie. A verificação de assinatura é
// do backend; aqui só fazemos checagem otimista (presença + exp).

export const TOKEN_KEY = "idor_token";
export const TOKEN_COOKIE = "idor_token";

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  // 7 dias; o proxy rechecará o exp do próprio JWT a cada request.
  setCookie(TOKEN_COOKIE, token, 60 * 60 * 24 * 7);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  deleteCookie(TOKEN_COOKIE);
}

// Decodifica o payload de um JWT sem verificar assinatura (checagem otimista).
// Retorna null se malformado. Funciona em browser e edge (atob disponível em ambos).
export function decodeJwt(token: string): { exp?: number } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

// Token presente e não expirado? Tolerância de relógio de 10s.
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  if (typeof payload.exp === "number") {
    return payload.exp * 1000 > Date.now() - 10_000;
  }
  // Sem exp no payload: tratamos como válido (checagem otimista).
  return true;
}

export function isAuthenticated(): boolean {
  return isTokenValid(getToken());
}
