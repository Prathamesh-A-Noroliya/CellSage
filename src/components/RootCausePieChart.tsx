import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { rootCausePieData } from "@/data/mockData";

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"];

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

export default function RootCausePieChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={rootCausePieData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        >
          {rootCausePieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend
          wrapperStyle={{ color: "#94A3B8", fontSize: "11px" }}
          iconSize={8}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
