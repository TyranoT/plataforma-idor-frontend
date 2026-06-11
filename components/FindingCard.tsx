import { CodeBlock } from "./CodeBlock";
import { SeverityBadge } from "./SeverityBadge";
import type { Finding, SourceMethod } from "@/lib/types";

const METHOD_LABEL: Record<SourceMethod, string> = {
  sast: "SAST",
  llm_rag: "LLM + RAG",
  ambos: "SAST + LLM",
};

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-300 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

export function FindingCard({ finding }: { finding: Finding }) {
  const {
    vuln_type,
    owasp_id,
    cwe_id,
    severity,
    line_start,
    line_end,
    code_excerpt,
    explanation,
    suggested_fix,
    source_method,
    confidence,
    sources,
  } = finding;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold">{vuln_type}</h3>
        <SeverityBadge severity={severity} />
        {owasp_id && <MetaBadge>OWASP {owasp_id}</MetaBadge>}
        {cwe_id && <MetaBadge>{cwe_id}</MetaBadge>}
        <MetaBadge>{METHOD_LABEL[source_method]}</MetaBadge>
        {typeof confidence === "number" && (
          <span className="ml-auto text-xs text-zinc-600 dark:text-zinc-400">
            confiança {Math.round(confidence * 100)}%
          </span>
        )}
      </header>

      {code_excerpt && (
        <div className="flex flex-col gap-1.5">
          {line_start && (
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {line_end && line_end !== line_start
                ? `Linhas ${line_start}–${line_end}`
                : `Linha ${line_start}`}
            </span>
          )}
          <CodeBlock
            code={code_excerpt}
            startLine={line_start ?? 1}
            highlightStart={line_start}
            highlightEnd={line_end}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Explicação
        </h4>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {explanation}
        </p>
      </div>

      {suggested_fix && (
        <div className="flex flex-col gap-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Correção sugerida
          </h4>
          <pre className="overflow-x-auto rounded-lg border border-emerald-200 bg-emerald-50 p-3 font-mono text-[13px] leading-relaxed text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
            <code>{suggested_fix}</code>
          </pre>
        </div>
      )}

      {sources.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Fontes
          </h4>
          <ul className="flex flex-col gap-2">
            {sources.map((s) => (
              <li
                key={s.chunk_id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950/40"
              >
                {s.source_url ? (
                  <a
                    href={s.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-700 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    {s.title}
                  </a>
                ) : (
                  <span className="font-medium">{s.title}</span>
                )}
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  “{s.excerpt}”
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
