import { AlertCircle, Shield } from "lucide-react";

interface RecommendationCardProps {
  correctiveActions: string[];
  preventiveActions: string[];
}

export default function RecommendationCard({ correctiveActions, preventiveActions }: RecommendationCardProps) {
  return (
    <div className="glass-card p-5 card-hover" data-testid="recommendation-card">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-4">Recommendations</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <AlertCircle size={13} color="#EF4444" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#EF4444" }}>Corrective Actions</span>
          </div>
          <ul className="space-y-2">
            {correctiveActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                <span className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.15)" }}>
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Shield size={13} color="#22C55E" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#22C55E" }}>Preventive Actions</span>
          </div>
          <ul className="space-y-2">
            {preventiveActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                <span className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "rgba(34,197,94,0.08)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.15)" }}>
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
