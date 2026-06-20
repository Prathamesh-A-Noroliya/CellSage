import AppShell from "@/components/AppShell";
import FailureDistributionChart from "@/components/FailureDistributionChart";
import RootCausePieChart from "@/components/RootCausePieChart";
import InvestigationTrendChart from "@/components/InvestigationTrendChart";
import { CheckCircle2, Circle, AlertTriangle, TrendingUp, Activity } from "lucide-react";

const TOP_CARDS = [
  { label: "Most Common Failure", value: "Capacity Failure", icon: AlertTriangle, color: "#EF4444" },
  { label: "Dominant Root Cause", value: "Process Deviation", icon: TrendingUp, color: "#F59E0B" },
  { label: "Average Confidence", value: "87%", icon: Activity, color: "#22C55E" },
  { label: "High Severity Cases", value: "14", icon: AlertTriangle, color: "#EF4444" },
];

const AGENT_STATUS = [
  { label: "Orchestrator Agent", status: "active" },
  { label: "RAG Retrieval Agent", status: "completed" },
  { label: "Sensor Analysis Agent", status: "completed" },
  { label: "Historical Analysis Agent", status: "completed" },
  { label: "Root Cause Agent", status: "completed" },
  { label: "Report Agent", status: "ready" },
];

const CONFIDENCE_BREAKDOWN = [
  { label: "SOP Match", value: 94 },
  { label: "Sensor Anomaly Match", value: 89 },
  { label: "Historical Similarity", value: 87 },
  { label: "Maintenance Correlation", value: 92 },
];

const RISK_SIGNALS = [
  { label: "Humidity Deviation", severity: "High" },
  { label: "Coating Drift", severity: "High" },
  { label: "Maintenance Delay", severity: "Medium" },
  { label: "Historical Similarity", severity: "Strong" },
];

function SectionCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className="glass-card p-5 card-hover animate-slide-up" style={{ animationDelay: `${delay}s` }}>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function Analytics() {
  return (
    <AppShell title="Analytics" subtitle="Visual intelligence for failure patterns, root-cause categories, investigation trends, and confidence signals">
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Manufacturing Analytics</h2>
          <p className="text-xs text-muted-foreground">Visual intelligence for failure patterns, root-cause categories, investigation trends, agent activity, and confidence signals.</p>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {TOP_CARDS.map(({ label, value, icon: Icon, color }, i) => (
            <div key={label} className="glass-card p-4 flex items-center gap-3 card-hover animate-slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-base font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Failure Distribution" delay={0.1}>
            <FailureDistributionChart />
          </SectionCard>
          <SectionCard title="Root Cause Categories" delay={0.2}>
            <RootCausePieChart />
          </SectionCard>
          <SectionCard title="Investigation Trends" delay={0.3}>
            <InvestigationTrendChart />
          </SectionCard>
        </div>

        {/* Bottom row: Agent Status + Confidence + Risk Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Agent Status */}
          <SectionCard title="Agent Status" delay={0.4}>
            <div className="space-y-3">
              {AGENT_STATUS.map(({ label, status }) => (
                <div key={label} className="flex items-center gap-3">
                  {status === "active" ? (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  ) : status === "completed" ? (
                    <CheckCircle2 size={14} color="#22C55E" />
                  ) : (
                    <Circle size={14} color="#94A3B8" />
                  )}
                  <span className="text-xs text-white flex-1">{label}</span>
                  <span className={`text-[10px] font-semibold ${
                    status === "active" ? "text-blue-400" : status === "completed" ? "text-green-400" : "text-muted-foreground"
                  }`}>
                    {status === "active" ? "Active" : status === "completed" ? "Completed" : "Ready"}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Confidence Breakdown */}
          <SectionCard title="Confidence Breakdown" delay={0.5}>
            <div className="space-y-3">
              {CONFIDENCE_BREAKDOWN.map(({ label, value }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white">{label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: value >= 90 ? "#22C55E" : value >= 80 ? "#F59E0B" : "#EF4444" }}>
                      {value}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full animate-fill" style={{ width: `${value}%`, background: value >= 90 ? "#22C55E" : value >= 80 ? "#F59E0B" : "#EF4444" }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Risk Signals */}
          <SectionCard title="Manufacturing Risk Signals" delay={0.6}>
            <div className="space-y-3">
              {RISK_SIGNALS.map(({ label, severity }) => {
                const color = severity === "High" || severity === "Strong" ? "#EF4444" : severity === "Medium" ? "#F59E0B" : "#22C55E";
                return (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-white">{label}</span>
                    <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                      {severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
