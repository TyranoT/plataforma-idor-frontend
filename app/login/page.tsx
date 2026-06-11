"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";
import { USE_MOCKS } from "@/lib/config";

// Gera um JWT NÃO-assinado só para destravar a sessão em modo demo/mock,
// enquanto o endpoint de autenticação do backend não existe. Tem exp real,
// então passa pela checagem otimista do proxy e do AuthGuard.
function makeDemoToken(): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "demo",
      name: "Sessão de demonstração",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  );
  return `${header}.${payload}.demo`;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [token, setTokenInput] = useState("");

  function entrar(value: string) {
    if (!value.trim()) return;
    setToken(value.trim());
    router.replace(next);
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-md bg-red-600 text-sm font-bold text-white">
          ID
        </span>
        <span className="text-lg font-semibold">Auditoria IDOR</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          entrar(token);
        }}
        className="flex flex-col gap-3"
      >
        <label
          htmlFor="token"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >
          Token de acesso (JWT)
        </label>
        <input
          id="token"
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Cole seu JWT"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          disabled={!token.trim()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-500"
        >
          Entrar
        </button>
      </form>

      {USE_MOCKS && (
        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <p className="mb-2 text-xs text-zinc-500">
            Backend ainda não conectado — modo demonstração.
          </p>
          <button
            type="button"
            onClick={() => entrar(makeDemoToken())}
            className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-500"
          >
            Entrar com sessão de demonstração
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid flex-1 place-items-center px-4 py-16">
      <Suspense fallback={<div className="text-sm text-zinc-500">Carregando…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
