import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { investigationTrendData } from "@/data/mockData";

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

export default function InvestigationTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={investigationTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="url(#trendStroke)"
          strokeWidth={2.5}
          fill="url(#trendGradient)"
          dot={{ fill: "#3B82F6", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
          name="Investigations"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
