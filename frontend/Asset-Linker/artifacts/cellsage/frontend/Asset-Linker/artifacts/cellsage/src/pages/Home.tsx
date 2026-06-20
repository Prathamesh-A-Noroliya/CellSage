import { Link } from "wouter";
import { ArrowRight, Search, BookOpen, History, FileText, Cpu, Shield, Zap, Activity, Database } from "lucide-react";

const FEATURES = [
  { icon: Search, title: "Root Cause Analysis", description: "AI-assisted investigation workflows identify manufacturing failure causes with explainable evidence.", color: "#3B82F6" },
  { icon: BookOpen, title: "RAG Knowledge Retrieval", description: "Retrieve relevant SOPs, maintenance records, sensor logs, and historical incidents instantly.", color: "#A78BFA" },
  { icon: History, title: "Historical Failure Analysis", description: "Compare current failures against previous EV battery production issues and recurring defect patterns.", color: "#F59E0B" },
  { icon: FileText, title: "Automated Investigation Reports", description: "Generate structured reports with findings, evidence, confidence scores, and recommended actions.", color: "#22C55E" },
];

const TRUST_BADGES = [
  { icon: Database, label: "RAG Retrieval" },
  { icon: Zap, label: "Multi-Agent Reasoning" },
  { icon: Shield, label: "SOP Evidence" },
  { icon: Activity, label: "Manufacturing Intelligence" },
];

const PIPELINE = [
  { icon: Search, label: "Ask Question", desc: "Describe a manufacturing failure" },
  { icon: BookOpen, label: "Retrieve Evidence", desc: "RAG searches SOPs & records" },
  { icon: Activity, label: "Analyze Sensors", desc: "Check real-time sensor data" },
  { icon: History, label: "Compare History", desc: "Match historical incidents" },
  { icon: Zap, label: "Identify Root Cause", desc: "AI pinpoints the failure driver" },
  { icon: FileText, label: "Generate Report", desc: "Export evidence-backed report" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 70%)", animation: "bg-move 20s ease-in-out infinite" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)", animation: "bg-move 20s ease-in-out infinite reverse" }} />

      {/* Top nav */}
      <header className="flex items-center justify-between px-6 sm:px-8 h-16 glass-nav relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.15))", border: "1px solid rgba(59,130,246,0.25)" }}>
            <Cpu size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">CellSage AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/investigation" className="hover:text-white transition-colors duration-300" data-testid="link-nav-investigation">Investigation</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors duration-300" data-testid="link-nav-dashboard">Dashboard</Link>
          <Link href="/history" className="hover:text-white transition-colors duration-300" data-testid="link-nav-history">History</Link>
          <Link href="/report" className="hover:text-white transition-colors duration-300" data-testid="link-nav-report">Reports</Link>
        </nav>
        <Link href="/investigation" className="px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold text-white btn-glow"
          style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
          data-testid="button-hero-cta-nav">
          Start Investigation
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 sm:px-8 pt-20 sm:pt-24 pb-16 sm:pb-20 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold mb-5 animate-slide-up animate-slide-up-d1"
              style={{ background: "rgba(59,130,246,0.10)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Agentic AI for EV Battery Manufacturing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight animate-slide-up animate-slide-up-d2">
              <span className="text-gradient">CellSage AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#94A3B8] font-medium mb-3 animate-slide-up animate-slide-up-d3">
              Agentic AI Investigator for EV Battery Manufacturing
            </p>
            <p className="text-sm text-[#64748B] leading-relaxed mb-8 max-w-md animate-slide-up animate-slide-up-d4">
              Turn scattered SOPs, sensor logs, maintenance records, and historical failure reports into explainable root-cause intelligence within minutes.
            </p>
            <div className="flex flex-wrap gap-3 mb-7 animate-slide-up animate-slide-up-d5">
              <Link href="/investigation" className="flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl text-sm font-semibold text-white btn-glow"
                style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)", boxShadow: "0 4px 24px rgba(59,130,246,0.3)" }}
                data-testid="button-start-investigation">
                Start Investigation
                <ArrowRight size={15} />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/[0.06]"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)", color: "#FFFFFF" }}
                data-testid="button-view-dashboard">
                View Dashboard
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 animate-slide-up animate-slide-up-d5">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Icon size={10} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — hero card + floating mini cards in clean flex column */}
          <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {/* Floating mini stat cards — above hero card, never overlapping */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
              <div className="glass-card-strong px-3 py-2 rounded-xl hero-float" style={{ animationDelay: "0.5s", boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(59,130,246,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}>
                <p className="text-[10px] text-muted-foreground">Confidence</p>
                <p className="text-sm font-bold" style={{ color: "#22C55E" }}>91%</p>
              </div>
              <div className="glass-card-strong px-3 py-2 rounded-xl hero-float" style={{ animationDelay: "1s", boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(59,130,246,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}>
                <p className="text-[10px] text-muted-foreground">Evidence Sources</p>
                <p className="text-sm font-bold" style={{ color: "#3B82F6" }}>5</p>
              </div>
              <div className="glass-card-strong px-3 py-2 rounded-xl hero-float" style={{ animationDelay: "1.5s", boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(59,130,246,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}>
                <p className="text-[10px] text-muted-foreground">Root Cause</p>
                <p className="text-sm font-bold" style={{ color: "#A78BFA" }}>Found</p>
              </div>
            </div>

            {/* Main hero card — 3D depth */}
            <div className="hero-card-3d p-5 sm:p-6 rounded-2xl animate-slide-up animate-slide-up-d3"
              style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-green-400">Investigation Completed</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  High Severity
                </span>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Batch ID</p>
                <p className="text-xl font-bold text-white">EV-1024</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs text-muted-foreground mb-1">Failure Type</p>
                  <p className="text-xs font-semibold text-white">Capacity Testing Failure</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs text-muted-foreground mb-1">Evidence Sources</p>
                  <p className="text-xs font-semibold text-white">5 references found</p>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Primary Root Cause</p>
                <p className="text-sm font-semibold text-white">Electrode coating thickness variation</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Evidence Chain</p>
                <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono" style={{ color: "#94A3B8" }}>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">SOP-001</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">Sensor</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">Maint</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">History</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">AI Confidence Score</span>
                  <span className="text-sm font-bold" style={{ color: "#22C55E" }}>91%</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full animate-fill" style={{ width: "91%", background: "linear-gradient(90deg, #22C55E, #34D399)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Investigation Pipeline */}
      <section className="px-6 sm:px-8 py-16 sm:py-20 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">AI Investigation Pipeline</h2>
          <p className="text-sm text-muted-foreground">From question to evidence-backed report in seconds</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className="glass-card card-hover p-4 w-full text-center flex flex-col items-center gap-2 animate-slide-up"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <Icon size={18} color="#3B82F6" />
                </div>
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{desc}</p>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="hidden lg:block h-px w-3 mt-3" style={{ background: "rgba(59,130,246,0.2)" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-8 py-16 sm:py-20 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Platform Capabilities</h2>
          <p className="text-sm text-muted-foreground">Enterprise-grade AI investigation for battery manufacturing</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, color }, i) => (
            <div key={title} className="glass-card card-hover p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon size={18} color={color} />
              </div>
              <div className="w-8 h-0.5 rounded-full mb-3" style={{ background: color, opacity: 0.4 }} />
              <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 sm:px-8 py-8 text-center text-xs text-muted-foreground relative z-10"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="mb-1">CellSage AI — Agentic AI for EV Battery Manufacturing</p>
        <p className="text-[10px] text-[#64748B]">Built for enterprise manufacturing intelligence</p>
      </footer>
    </div>
  );
}
