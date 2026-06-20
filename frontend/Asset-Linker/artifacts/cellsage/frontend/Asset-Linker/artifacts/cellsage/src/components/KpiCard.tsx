import {
  Search, TrendingUp, AlertTriangle, Clock, Activity, BarChart2, CheckCircle, Zap,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Search, TrendingUp, AlertTriangle, Clock, Activity, BarChart2, CheckCircle, Zap,
};

interface KpiCardProps {
  label: string;
  value: string;
  trend: string;
  icon: string;
  color: string;
}

export default function KpiCard({ label, value, trend, icon, color }: KpiCardProps) {
  const Icon = ICON_MAP[icon] ?? Activity;

  return (
    <div className="glass-card p-5 flex gap-4 items-start card-hover"
      data-testid={`kpi-card-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
        <Icon size={20} color={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </div>
    </div>
  );
}
