"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_HEIGHT } from "@/components/charts/ChartCard";
import { languageLabel } from "@/lib/config";
import type { DashboardSummary } from "@/lib/types";

const AXIS = "#a1a1aa"; // zinc-400
const BAR = "#3b82f6"; // blue-500

export function BarByLanguage({
  data,
}: {
  data: DashboardSummary["por_linguagem"];
}) {
  const rows = data.map((d) => ({ name: languageLabel(d.language), n: d.n }));
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={rows} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: AXIS }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(113,113,122,0.1)" }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
          labelStyle={{ color: "#18181b" }}
        />
        <Bar dataKey="n" name="Achados" fill={BAR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
