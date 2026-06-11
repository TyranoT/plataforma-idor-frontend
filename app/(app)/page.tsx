"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/CodeEditor";
import { LANGUAGES } from "@/lib/config";
import { api, ApiError } from "@/lib/api";
import type { Language } from "@/lib/types";

const SAMPLE = `@router.get("/faturas/{fatura_id}")
def get_fatura(fatura_id: int, user = Depends(current_user)):
    fatura = db.faturas.get(fatura_id)
    return fatura
`;

export default function AnalisePage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(SAMPLE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empty = code.trim().length === 0;

  async function audit() {
    if (empty || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.audits.create({
        language,
        code,
        source: "web_paste",
      });
      router.push(`/audit/${result.audit_id}`);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível concluir a auditoria. Tente novamente.";
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Auditar endpoint
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cole o código de um endpoint de API. A análise híbrida (SAST + LLM
          ancorada por RAG) procura falhas de controle de acesso — foco em
          IDOR/BOLA.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="language"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Linguagem
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CodeEditor value={code} language={language} onChange={setCode} />

        {error && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            Análise por arquivo único — mais confiável que lógica distribuída
            entre módulos.
          </span>
          <button
            type="button"
            onClick={audit}
            disabled={empty || submitting}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-900"
          >
            {submitting && (
              <span
                className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden
              />
            )}
            {submitting ? "Auditando…" : "Auditar"}
          </button>
        </div>
      </div>
    </div>
  );
}
