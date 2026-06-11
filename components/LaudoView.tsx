"use client";

import Link from "next/link";
import useSWR from "swr";
import { FindingCard } from "./FindingCard";
import { SeverityBadge } from "./SeverityBadge";
import { api } from "@/lib/api";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function LaudoView({ id }: { id: number }) {
  const { data, error, isLoading } = useSWR(`audit/${id}`, () =>
    api.audits.get(id),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy>
        <div className="h-7 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-48 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
        <p className="text-sm text-red-700 dark:text-red-300">
          Não foi possível carregar este laudo.
        </p>
        <Link href="/" className="text-sm font-medium underline">
          Voltar para análise
        </Link>
      </div>
    );
  }

  const clean = data.findings.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← Nova análise
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Laudo #{data.audit_id}
          </h1>
          <SeverityBadge severity={data.max_severity} />
        </div>
        <div className="flex flex-wrap gap-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Meta label="Achados" value={String(data.n_findings)} />
          <Meta
            label="Métodos"
            value={
              data.findings.length > 0
                ? Array.from(
                    new Set(
                      data.findings.map((f) =>
                        f.source_method === "sast"
                          ? "SAST"
                          : f.source_method === "llm_rag"
                            ? "LLM + RAG"
                            : "SAST + LLM",
                      ),
                    ),
                  ).join(", ")
                : "—"
            }
          />
        </div>
      </div>

      {clean ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          Nenhuma falha de controle de acesso detectada neste código.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.findings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      )}
    </div>
  );
}
