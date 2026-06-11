"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { USE_MOCKS } from "@/lib/config";

type Mode = "login" | "register";

const inputClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalid =
    !email.trim() || (mode === "register" ? password.length < 8 : !password);

  async function entrar() {
    if (invalid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const credentials = { email: email.trim(), password };
      const { access_token } =
        mode === "login"
          ? await api.auth.login(credentials)
          : await api.auth.register(credentials);
      setToken(access_token);
      router.replace(next);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível entrar. Tente novamente.",
      );
      setSubmitting(false);
    }
  }

  async function entrarDemo() {
    const { access_token } = await api.auth.login({
      email: "demo@demo",
      password: "demo",
    });
    setToken(access_token);
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
          entrar();
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "register" ? "Mínimo de 8 caracteres" : "Sua senha"
            }
            className={inputClass}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={invalid || submitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-500"
        >
          {submitting && (
            <span
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
          )}
          {mode === "login" ? "Entrar" : "Criar conta e entrar"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError(null);
        }}
        className="mt-3 text-xs font-medium text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
      >
        {mode === "login"
          ? "Não tem conta? Criar uma"
          : "Já tem conta? Entrar"}
      </button>

      {USE_MOCKS && (
        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <p className="mb-2 text-xs text-zinc-500">
            Backend não configurado — modo demonstração.
          </p>
          <button
            type="button"
            onClick={entrarDemo}
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
