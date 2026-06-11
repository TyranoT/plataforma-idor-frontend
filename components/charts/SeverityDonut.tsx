"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_HEIGHT } from "@/components/charts/ChartCard";
import { severityStyles } from "@/lib/config";
import type { DashboardSummary } from "@/lib/types";

// Cor SEMPRE do mapa de severidade (config.ts). Nunca hardcode.
export function SeverityDonut({
  data,
}: {
  data: DashboardSummary["por_severidade"];
}) {
  const rows = data.map((d) => ({
    name: severityStyles[d.severity].label,
    n: d.n,
    color: severityStyles[d.severity].dot,
  }));
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <PieChart>
        <Pie
          data={rows}
          dataKey="n"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {rows.map((row) => (
            <Cell key={row.name} fill={row.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
          labelStyle={{ color: "#18181b" }}
        />
        <Legend
          verticalAlign="bottom"
          height={28}
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
