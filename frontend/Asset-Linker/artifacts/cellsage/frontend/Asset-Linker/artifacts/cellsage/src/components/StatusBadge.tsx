interface StatusBadgeProps {
  value: string;
  type?: "severity" | "status" | "auto";
}

const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  High: { bg: "rgba(239,68,68,0.12)", text: "#EF4444", border: "rgba(239,68,68,0.2)" },
  Medium: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", border: "rgba(245,158,11,0.2)" },
  Low: { bg: "rgba(34,197,94,0.12)", text: "#22C55E", border: "rgba(34,197,94,0.2)" },
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Completed: { bg: "rgba(34,197,94,0.12)", text: "#22C55E", border: "rgba(34,197,94,0.2)" },
  "Under Review": { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", border: "rgba(245,158,11,0.2)" },
  Open: { bg: "rgba(59,130,246,0.12)", text: "#3B82F6", border: "rgba(59,130,246,0.2)" },
};

export default function StatusBadge({ value, type = "auto" }: StatusBadgeProps) {
  let colors = { bg: "rgba(156,163,175,0.12)", text: "#9CA3AF", border: "rgba(156,163,175,0.2)" };

  if (type === "severity" || (type === "auto" && SEVERITY_COLORS[value])) {
    colors = SEVERITY_COLORS[value] ?? colors;
  } else if (type === "status" || (type === "auto" && STATUS_COLORS[value])) {
    colors = STATUS_COLORS[value] ?? colors;
  }

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold"
      style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
      data-testid={`badge-${value.toLowerCase().replace(/\s/g, "-")}`}
    >
      {value}
    </span>
  );
}
