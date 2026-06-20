const ArrowDown = () => (
  <div className="flex justify-center my-3">
    <div className="flex flex-col items-center">
      <div className="w-px h-5" style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.4), rgba(6,182,212,0.2))" }} />
      <div style={{
        width: 0, height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "6px solid rgba(59,130,246,0.5)",
      }} />
    </div>
  </div>
);

function Section({
  label,
  bg,
  border,
  children,
}: {
  label: string;
  bg: string;
  border: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4 transition-all duration-300 hover:border-blue-400/30"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
      <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: border }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
      style={{ backgroundColor: `${color}10`, color, border: `1px solid ${color}25` }}>
      {children}
    </span>
  );
}

function AgentCard({ label }: { label: string }) {
  return (
    <div className="rounded-lg px-3 py-2 text-xs font-medium text-center transition-all duration-300 hover:scale-105"
      style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(6,182,212,0.08))",
        border: "1px solid rgba(59,130,246,0.20)",
        color: "#93C5FD",
      }}>
      {label}
    </div>
  );
}

export default function ArchitectureDiagram() {
  return (
    <div className="glass-card p-6 space-y-0"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

      {/* User Layer */}
      <Section label="User Interaction Layer" bg="rgba(59,130,246,0.05)" border="#3B82F6">
        <div className="flex flex-wrap gap-2">
          {["Ask Question", "Dashboard", "History", "Download Report"].map(l => (
            <Chip key={l} color="#3B82F6">{l}</Chip>
          ))}
        </div>
      </Section>
      <ArrowDown />

      {/* Query */}
      <Section label="Manufacturing Engineer Query" bg="rgba(167,139,250,0.05)" border="#A78BFA">
        <div className="rounded-xl px-4 py-3 text-sm font-mono"
          style={{ background: "rgba(167,139,250,0.08)", color: "#C4B5FD", border: "1px solid rgba(167,139,250,0.15)" }}>
          "Why did Batch EV-1024 fail capacity testing?"
        </div>
      </Section>
      <ArrowDown />

      {/* Agent Layer */}
      <Section label="Agent Orchestration Layer" bg="rgba(59,130,246,0.05)" border="#3B82F6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            "Orchestrator Agent",
            "RAG Retrieval Agent",
            "Sensor Analysis Agent",
            "Historical Analysis Agent",
            "Root Cause Agent",
            "Report Generation Agent",
          ].map(a => <AgentCard key={a} label={a} />)}
        </div>
      </Section>
      <ArrowDown />

      {/* Data + RAG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Section label="Data Sources" bg="rgba(34,197,94,0.05)" border="#22C55E">
          <ul className="space-y-1">
            {[
              "SOPs & Work Instructions",
              "Maintenance Logs",
              "Production / Sensor Data",
              "Quality Reports",
              "Historical Failure Reports",
            ].map(s => (
              <li key={s} className="flex items-center gap-2 text-xs" style={{ color: "#86EFAC" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#22C55E", boxShadow: "0 0 4px rgba(34,197,94,0.4)" }} />
                {s}
              </li>
            ))}
          </ul>
        </Section>
        <Section label="RAG Pipeline" bg="rgba(245,158,11,0.05)" border="#F59E0B">
          <div className="flex flex-col gap-2">
            {["Document Ingestion", "Text Chunking", "Embeddings", "Vector Store"].map((step, i, arr) => (
              <div key={step} className="flex flex-col items-start">
                <Chip color="#F59E0B">{step}</Chip>
                {i < arr.length - 1 && (
                  <div className="ml-3 mt-1 flex items-center gap-1">
                    <div className="w-px h-2" style={{ background: "#F59E0B40" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>
      <ArrowDown />

      {/* Infrastructure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Section label="Data & Storage" bg="rgba(239,68,68,0.05)" border="#EF4444">
          <div className="flex flex-wrap gap-2">
            {["PostgreSQL", "File Storage", "ChromaDB"].map(s => (
              <Chip key={s} color="#F87171">{s}</Chip>
            ))}
          </div>
        </Section>
        <Section label="Tools & Services" bg="rgba(167,139,250,0.05)" border="#A78BFA">
          <div className="flex flex-wrap gap-2">
            {["Llama 3.1", "LangChain", "Pandas", "Plotly"].map(s => (
              <Chip key={s} color="#C4B5FD">{s}</Chip>
            ))}
          </div>
        </Section>
      </div>
      <ArrowDown />

      {/* Output */}
      <Section label="Output" bg="rgba(34,197,94,0.08)" border="#22C55E">
        <div className="flex flex-wrap gap-2">
          {["Root Cause", "Evidence & References", "Recommended Actions", "Confidence Score", "Investigation Report"].map(o => (
            <Chip key={o} color="#22C55E">{o}</Chip>
          ))}
        </div>
      </Section>

      <p className="text-xs text-muted-foreground text-center pt-5">
        CellSage AI turns scattered manufacturing data and documents into actionable intelligence using Agentic AI and RAG.
      </p>
    </div>
  );
}
