import { BookOpen, Clock, Database, Wifi } from "lucide-react";

interface EvidenceCardProps {
  sopReferences: string[];
  historicalIncidents: string[];
  maintenanceRecords: string[];
  sensorReadings?: string[];
}

function EvidenceSection({
  icon: Icon,
  label,
  items,
  color,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={12} color={color} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EvidenceCard({ sopReferences, historicalIncidents, maintenanceRecords, sensorReadings }: EvidenceCardProps) {
  return (
    <div className="glass-card p-5 card-hover" data-testid="evidence-card">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-4">Evidence Sources</span>
      <EvidenceSection icon={BookOpen} label="SOP References" items={sopReferences} color="#3B82F6" />
      <EvidenceSection icon={Database} label="Historical Incidents" items={historicalIncidents} color="#A78BFA" />
      <EvidenceSection icon={Clock} label="Maintenance Records" items={maintenanceRecords} color="#F59E0B" />
      {sensorReadings && sensorReadings.length > 0 && (
        <EvidenceSection icon={Wifi} label="Sensor Readings" items={sensorReadings} color="#22C55E" />
      )}
    </div>
  );
}
