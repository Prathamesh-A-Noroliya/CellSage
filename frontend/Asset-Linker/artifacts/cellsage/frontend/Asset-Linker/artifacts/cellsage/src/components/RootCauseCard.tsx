import StatusBadge from "./StatusBadge";

interface RootCauseCardProps {
  rootCause: string;
  severity: string;
  impact: string;
  contributingFactors: string[];
}

export default function RootCauseCard({ rootCause, severity, impact, contributingFactors }: RootCauseCardProps) {
  return (
    <div className="glass-card p-5 card-hover" data-testid="root-cause-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Root Cause Analysis</span>
        <StatusBadge value={severity} type="severity" />
      </div>
      <p className="text-sm font-semibold text-white leading-snug mb-3">{rootCause}</p>
      <div className="mb-3">
        <span className="text-xs text-muted-foreground block mb-1">Impact</span>
        <p className="text-xs text-[#94A3B8] leading-relaxed">{impact}</p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground block mb-2">Contributing Factors</span>
        <div className="flex flex-wrap gap-1.5">
          {contributingFactors.map((factor, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-lg"
              style={{ background: "rgba(245,158,11,0.08)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.15)" }}>
              {factor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
