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
import type { DashboardSummary } from "@/lib/types";

const AXIS = "#a1a1aa";
const BAR = "#f43f5e"; // rose-500

// Barras horizontais (layout vertical no Recharts).
export function BarByVulnType({
  data,
}: {
  data: DashboardSummary["por_tipo"];
}) {
  const rows = data.map((d) => ({ name: d.vuln_type, n: d.n }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: AXIS }} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(113,113,122,0.1)" }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <Bar dataKey="n" name="Ocorrências" fill={BAR} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
