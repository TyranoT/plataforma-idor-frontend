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
import type { DashboardSummary } from "@/lib/types";

const AXIS = "#a1a1aa";
const BAR = "#8b5cf6"; // violet-500

export function BarByModel({ data }: { data: DashboardSummary["por_modelo"] }) {
  const rows = data.map((d) => ({ name: d.model, n: d.n }));
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={rows} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: AXIS }} tickLine={false} axisLine={false} interval={0} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(113,113,122,0.1)" }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
          labelStyle={{ color: "#18181b" }}
        />
        <Bar dataKey="n" name="Código testado" fill={BAR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
