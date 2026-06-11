import Link from "next/link";
import { SeverityBadge } from "./SeverityBadge";
import { languageLabel } from "@/lib/config";
import type { AuditListItem } from "@/lib/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sourceLabel(item: AuditListItem): string {
  return item.source === "github_action" ? "GitHub Action" : "Web";
}

export function RecentAuditsTable({ items }: { items: AuditListItem[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Nenhuma auditoria registrada ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <th scope="col" className="px-4 py-3">Origem</th>
            <th scope="col" className="px-4 py-3">Linguagem</th>
            <th scope="col" className="px-4 py-3">Repositório</th>
            <th scope="col" className="px-4 py-3 text-right">Achados</th>
            <th scope="col" className="px-4 py-3">Severidade</th>
            <th scope="col" className="px-4 py-3">Data</th>
            <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/40"
            >
              <td className="px-4 py-3">{sourceLabel(item)}</td>
              <td className="px-4 py-3">{languageLabel(item.language)}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                {item.repo_full_name ?? "—"}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{item.n_findings}</td>
              <td className="px-4 py-3">
                {item.max_severity ? (
                  <SeverityBadge severity={item.max_severity} />
                ) : (
                  <span className="text-xs text-zinc-500">—</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                {formatDate(item.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/audit/${item.id}`}
                  className="rounded font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-offset-zinc-900"
                >
                  Ver laudo
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
