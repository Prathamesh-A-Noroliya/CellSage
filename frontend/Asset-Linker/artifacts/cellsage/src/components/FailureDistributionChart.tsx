import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { failureDistributionData } from "@/data/mockData";

const tooltipStyle = {
  contentStyle: {
    background: "rgba(11,18,32,0.95)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    backdropFilter: "blur(12px)",
  },
  itemStyle: { color: "#93C5FD" },
  labelStyle: { color: "#94A3B8" },
};

export default function FailureDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={failureDistributionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94A3B8", fontSize: 10 }}
          axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={45}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
        <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Count">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
