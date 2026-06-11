"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardSummary } from "@/lib/types";

const AXIS = "#a1a1aa";
const TOTAL = "#3b82f6"; // blue-500
const FALHAS = "#ef4444"; // red-500

// Formata 'YYYY-MM-DD' -> 'DD/MM' sem fuso (evita deslocar o dia).
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return d && m ? `${d}/${m}` : iso;
}

export function TimelineLine({
  data,
}: {
  data: DashboardSummary["evolucao"];
}) {
  const rows = data.map((d) => ({
    name: shortDate(d.date),
    Auditorias: d.total,
    Falhas: d.falhas,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 4, right: 12, bottom: 4, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: AXIS }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }} />
        <Legend verticalAlign="top" height={28} iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Auditorias" stroke={TOTAL} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Falhas" stroke={FALHAS} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
