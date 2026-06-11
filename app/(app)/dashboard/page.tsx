"use client";

import useSWR from "swr";
import { MetricCard } from "@/components/MetricCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarByLanguage } from "@/components/charts/BarByLanguage";
import { BarByModel } from "@/components/charts/BarByModel";
import { SeverityDonut } from "@/components/charts/SeverityDonut";
import { BarByVulnType } from "@/components/charts/BarByVulnType";
import { TimelineLine } from "@/components/charts/TimelineLine";
import { RecentAuditsTable } from "@/components/RecentAuditsTable";
import { api } from "@/lib/api";

function formatDuration(ms: number | null): string {
  if (ms === null) return "—";
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`;
}

export default function DashboardPage() {
  const summary = useSWR("dashboard/summary", () => api.dashboard.summary());
  const audits = useSWR("dashboard/audits", () => api.audits.list(1, 8));

  if (summary.error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        Não foi possível carregar as métricas do dashboard.
      </div>
    );
  }

  const data = summary.data;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Visão agregada das auditorias — avulsas e de commits.
        </p>
      </header>

      {/* Cartões de métrica */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.isLoading || !data ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[88px] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))
        ) : (
          <>
            <MetricCard label="Auditorias" value={data.total_auditorias} />
            <MetricCard
              label="% com IDOR"
              value={`${Math.round(data.taxa_idor * 100)}%`}
            />
            <MetricCard
              label="Falhas críticas"
              value={data.criticas}
              hint="severidade crítica"
            />
            <MetricCard
              label="Tempo médio"
              value={formatDuration(data.tempo_medio_ms)}
              hint="por análise"
            />
          </>
        )}
      </div>

      {/* Gráficos */}
      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="Falhas por linguagem" empty={data.por_linguagem.length === 0}>
              <BarByLanguage data={data.por_linguagem} />
            </ChartCard>
            <ChartCard title="Falhas por modelo de IA" empty={data.por_modelo.length === 0}>
              <BarByModel data={data.por_modelo} />
            </ChartCard>
            <ChartCard title="Distribuição por severidade" empty={data.por_severidade.length === 0}>
              <SeverityDonut data={data.por_severidade} />
            </ChartCard>
            <ChartCard title="Tipos de vulnerabilidade mais comuns" empty={data.por_tipo.length === 0}>
              <BarByVulnType data={data.por_tipo} />
            </ChartCard>
          </div>
          <ChartCard title="Evolução no tempo" empty={data.evolucao.length === 0}>
            <TimelineLine data={data.evolucao} />
          </ChartCard>
        </>
      )}

      {/* Tabela de auditorias recentes */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Auditorias recentes
        </h2>
        {audits.isLoading || !audits.data ? (
          <div className="h-40 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        ) : (
          <RecentAuditsTable items={audits.data.items} />
        )}
      </section>
    </div>
  );
}
