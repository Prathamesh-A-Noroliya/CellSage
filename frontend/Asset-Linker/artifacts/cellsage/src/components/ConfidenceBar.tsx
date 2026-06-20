interface ConfidenceBarProps {
  value: number;
  showLabel?: boolean;
  height?: number;
  size?: "sm" | "md" | "lg";
}

export default function ConfidenceBar({ value, showLabel = true, height = 6, size = "md" }: ConfidenceBarProps) {
  const color =
    value >= 80 ? "#22C55E" : value >= 60 ? "#F59E0B" : "#EF4444";

  const labelSize = size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex items-center gap-2" data-testid="confidence-bar">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", height }}
      >
        <div
          className="h-full rounded-full animate-fill"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className={`font-bold tabular-nums ${labelSize}`} style={{ color }}>
          {value}%
        </span>
      )}
    </div>
  );
}
