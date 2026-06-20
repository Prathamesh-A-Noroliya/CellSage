import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  Search,
  LayoutDashboard,
  BarChart3,
  History,
  FileText,
  Menu,
  Cpu,
  Zap,
  Database,
  Activity,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Investigation", icon: Search, path: "/investigation" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "History", icon: History, path: "/history" },
  { label: "Reports", icon: FileText, path: "/report" },
];

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = () => (
    <div className="flex flex-col h-full glass-sidebar">
      <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.15))", border: "1px solid rgba(59,130,246,0.25)" }}>
            <Cpu size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">CellSage AI</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground ml-11 uppercase tracking-widest">Agentic Manufacturing AI</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = location === path || (path !== "/" && location.startsWith(path));
          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                active ? "nav-active text-white" : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
              }`}
              onClick={() => setSidebarOpen(false)}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <Icon size={16} className={active ? "text-blue-400" : ""} />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t mx-3 mb-3 rounded-xl" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-muted-foreground">System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] text-muted-foreground">Mock API Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[10px] text-muted-foreground">Evidence Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617]">
      <div className="app-bg" />
      <div className="bg-grid bg-noise" />

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 flex-shrink-0 z-10">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex-shrink-0 z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 z-10">
        {/* Navbar */}
        <header className="flex items-center h-16 px-6 flex-shrink-0 glass-nav">
          <button className="md:hidden mr-3 text-muted-foreground hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-white">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle || "AI Manufacturing Investigator"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "rgba(59,130,246,0.12)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Zap size={10} />
              Agentic RAG
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "rgba(34,197,94,0.12)", color: "#86EFAC", border: "1px solid rgba(34,197,94,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Mock API Ready
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "rgba(6,182,212,0.12)", color: "#67E8F9", border: "1px solid rgba(6,182,212,0.2)" }}>
              <Activity size={10} />
              EV Manufacturing
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
