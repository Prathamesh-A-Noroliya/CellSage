import { useState } from "react";
import AppShell from "@/components/AppShell";
import ChatBox, { ChatMessage } from "@/components/ChatBox";
import SummaryCard from "@/components/SummaryCard";
import RootCauseCard from "@/components/RootCauseCard";
import EvidenceCard from "@/components/EvidenceCard";
import RecommendationCard from "@/components/RecommendationCard";
import ConfidenceBar from "@/components/ConfidenceBar";
import StatusBadge from "@/components/StatusBadge";
import { investigateQuery } from "@/services/api";
import { mockInvestigation } from "@/data/mockData";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";

const SOURCE_CHIPS = ["SOP", "Sensor Log", "Maintenance", "Historical Failure", "Quality Record"];
const CHIP_COLORS: Record<string, string> = {
  SOP: "#3B82F6", "Sensor Log": "#22C55E", Maintenance: "#F59E0B", "Historical Failure": "#A78BFA", "Quality Record": "#EC4899",
};

const AGENT_STATUS = [
  { label: "Orchestrator Agent", status: "completed" },
  { label: "RAG Retrieval Agent", status: "completed" },
  { label: "Sensor Analysis Agent", status: "completed" },
  { label: "Root Cause Agent", status: "completed" },
  { label: "Report Agent", status: "ready" },
];

export default function Investigation() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [investigated, setInvestigated] = useState(false);
  const [investigationData, setInvestigationData] = useState<any>(null);

  const handleSend = async (query: string) => {
    setMessages(prev => [...prev, { role: "user", content: query }]);
    setIsLoading(true);
    try {
      const result = await investigateQuery(query);

      console.log("Backend Result:", result);

      setInvestigationData(result);

      const inv = result || mockInvestigation;
      const response: React.ReactNode = (
        <div className="space-y-3 w-full">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <Sparkles size={10} className="inline mr-1" />
            AI Investigation Report — Batch {inv.batchId}
          </div>
          <SummaryCard batchId={inv.batchId} failureType={inv.failureType} confidence={inv.confidence} status={inv.status} productionLine={inv.productionLine} summary={inv.summary} />
          <RootCauseCard rootCause={inv.rootCause} severity={inv.severity} impact={inv.impact} contributingFactors={inv.contributingFactors} />
          <EvidenceCard sopReferences={inv.sopReferences} historicalIncidents={inv.historicalIncidents} maintenanceRecords={inv.maintenanceRecords} sensorReadings={inv.sensorReadings} />
          <RecommendationCard correctiveActions={inv.correctiveActions} preventiveActions={inv.preventiveActions} />
        </div>
      );
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setInvestigated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inv = investigationData || mockInvestigation;

  return (
    <AppShell title="Investigation" subtitle="AI Investigation Workspace">
      <div className="flex h-full" style={{ height: "calc(100vh - 64px)" }}>
        {/* Chat area */}
        <div className="flex-1 min-w-0 flex flex-col border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <ChatBox messages={messages} onSend={handleSend} isLoading={isLoading} suggestedQuery="Why did Batch EV-1024 fail capacity testing?" />
        </div>

        {/* Insights panel */}
        <div className="hidden lg:flex flex-col w-80 flex-shrink-0 overflow-y-auto glass-sidebar border-l" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Investigation Intelligence Panel</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Batch ID</span>
                <span className="text-xs font-bold text-white">{investigated ? inv.batchId : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Failure Type</span>
                <span className="text-xs font-medium text-white text-right max-w-32">{investigated ? inv.failureType : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Severity</span>
                {investigated ? <StatusBadge value={inv.severity} type="severity" /> : <span className="text-xs text-muted-foreground">—</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                {investigated ? <StatusBadge value={inv.status} type="status" /> : <span className="text-xs text-muted-foreground">—</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Evidence Count</span>
                <span className="text-xs font-bold text-white">{investigated ? inv.evidenceSources.length : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Recommended Actions</span>
                <span className="text-xs font-bold text-white">{investigated ? inv.correctiveActions.length + inv.preventiveActions.length : "—"}</span>
              </div>
            </div>
            {investigated && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Confidence Score</span>
                </div>
                <ConfidenceBar value={inv.confidence} />
              </div>
            )}
          </div>

          {/* Agent Status */}
          {investigated && (
            <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Agent Status</p>
              <div className="space-y-2">
                {AGENT_STATUS.map(({ label, status }) => (
                  <div key={label} className="flex items-center gap-2">
                    {status === "completed" ? (
                      <CheckCircle2 size={12} color="#22C55E" />
                    ) : (
                      <Circle size={12} color="#94A3B8" />
                    )}
                    <span className="text-xs text-white flex-1">{label}</span>
                    <span className={`text-[10px] font-semibold ${status === "completed" ? "text-green-400" : "text-muted-foreground"}`}>
                      {status === "completed" ? "Done" : "Ready"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Sources */}
          {investigated && (
            <div className="p-5">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Evidence Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {SOURCE_CHIPS.map(chip => (
                  <span key={chip} className="text-xs px-2 py-1 rounded-lg font-medium"
                    style={{ background: `${CHIP_COLORS[chip]}12`, color: CHIP_COLORS[chip], border: `1px solid ${CHIP_COLORS[chip]}25` }}>
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Primary Cause</p>
                <p className="text-xs text-white leading-relaxed">Coating Thickness Variation in Electrode Preparation Stage</p>
              </div>
            </div>
          )}

          {!investigated && (
            <div className="p-5 flex flex-col items-center justify-center h-full text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Sparkles size={18} className="text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Start an investigation by asking about a failed EV battery batch.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
