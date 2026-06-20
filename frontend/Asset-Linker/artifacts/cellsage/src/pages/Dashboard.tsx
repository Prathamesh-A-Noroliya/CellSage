import { Link } from "wouter";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import SummaryCard from "@/components/SummaryCard";
import RootCauseCard from "@/components/RootCauseCard";
import EvidenceCard from "@/components/EvidenceCard";
import RecommendationCard from "@/components/RecommendationCard";
import ConfidenceBar from "@/components/ConfidenceBar";
import { kpiData, mockInvestigation } from "@/data/mockData";
import { Plus, FileText } from "lucide-react";

function TimelineDot({ active }: { active: boolean }) {
  return (
    <div className="flex items-center">
      {active ? (
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "#3B82F6", boxShadow: "0 0 8px rgba(59,130,246,0.5)" }} />
      ) : (
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }} />
      )}
      <div className="w-8 h-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

export default function Dashboard() {
  const inv = mockInvestigation;

  return (
    <AppShell title="Dashboard" subtitle="Executive overview of active investigations, root causes, confidence, and recommended actions">
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Manufacturing Investigation Command Center</h2>
            <p className="text-xs text-muted-foreground">Executive overview of active investigations, root causes, confidence, and recommended actions.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/investigation" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white btn-glow"
              style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>
              <Plus size={13} />
              New Investigation
            </Link>
            <Link href="/report" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 hover:bg-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#FFFFFF" }}>
              <FileText size={13} />
              Generate Report
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} trend={kpi.trend} icon={kpi.icon} color={kpi.color} />
          ))}
        </div>

        {/* Main content — 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* Current Priority Investigation */}
            <div className="glass-card p-5 card-hover animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Priority Investigation</span>
                <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.2)" }}>
                  Completed
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Batch ID</p>
                  <p className="text-lg font-bold text-white">{inv.batchId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Failure Type</p>
                  <p className="text-sm font-semibold text-white">{inv.failureType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Severity</p>
                  <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                    style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                    High
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Primary Cause</p>
                <p className="text-sm font-semibold text-white">Electrode coating thickness variation</p>
                <p className="text-xs text-[#64748B] mt-1">Evidence Chain Strength: Strong</p>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <ConfidenceBar value={91} size="sm" />
              </div>
              {/* Mini timeline */}
              <div className="flex items-center gap-1 mt-4">
                {["Query Received", "Evidence Retrieved", "Root Cause Identified", "Report Generated"].map((step, i, arr) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                      <TimelineDot active={i <= 2} />
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{step}</span>
                    </div>
                    {i < arr.length - 1 && <div className="w-4 h-px mt-[-18px]" style={{ background: "rgba(255,255,255,0.08)" }} />}
                  </div>
                ))}
              </div>
            </div>

            <RootCauseCard rootCause={inv.rootCause} severity={inv.severity} impact={inv.impact} contributingFactors={inv.contributingFactors} />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <SummaryCard batchId={inv.batchId} failureType={inv.failureType} confidence={inv.confidence} status={inv.status} productionLine={inv.productionLine} summary={inv.summary} />
            <EvidenceCard sopReferences={inv.sopReferences} historicalIncidents={inv.historicalIncidents} maintenanceRecords={inv.maintenanceRecords} sensorReadings={inv.sensorReadings} />
            <RecommendationCard correctiveActions={inv.correctiveActions} preventiveActions={inv.preventiveActions} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
