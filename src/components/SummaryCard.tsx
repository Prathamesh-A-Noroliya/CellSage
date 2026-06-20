import ConfidenceBar from "./ConfidenceBar";
import StatusBadge from "./StatusBadge";

interface SummaryCardProps {
  batchId: string;
  failureType: string;
  confidence: number;
  status: string;
  productionLine: string;
  summary?: string;
}

export default function SummaryCard({ batchId, failureType, confidence, status, productionLine, summary }: SummaryCardProps) {
  return (
    <div className="glass-card overflow-hidden card-hover" data-testid="summary-card">
      <div className="flex items-stretch">
        <div className="w-1 flex-shrink-0" style={{ background: "linear-gradient(180deg, #3B82F6, #06B6D4)" }} />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Investigation Summary</span>
              <h3 className="text-base font-bold text-white mt-0.5">Batch {batchId}</h3>
            </div>
            <StatusBadge value={status} type="status" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <span className="text-xs text-muted-foreground block">Failure Type</span>
              <span className="font-medium text-white">{failureType}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Production Line</span>
              <span className="font-medium text-white">{productionLine}</span>
            </div>
          </div>
          {summary && (
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{summary}</p>
          )}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Confidence Score</span>
            </div>
            <ConfidenceBar value={confidence} />
          </div>
        </div>
      </div>
    </div>
  );
}
