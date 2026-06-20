import { useState, useEffect, useMemo } from "react";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { getHistory } from "@/services/api";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Database, AlertTriangle, TrendingUp, Clock } from "lucide-react";

type SortField = "date" | "confidence";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 5;

const FILTER_CHIPS = ["All", "Completed", "Under Review", "High Severity", "Medium Severity"];

interface HistoryRow {
  id: number;
  batchId: string;
  issue: string;
  rootCause: string;
  confidence: number;
  severity: string;
  date: string;
  status: string;
}

function parseConfidence(conf: string | number): number {
  if (typeof conf === "number") return conf;
  return parseInt(String(conf).replace("%", "").trim(), 10) || 0;
}

function inferSeverity(confidence: number): string {
  return confidence >= 85 ? "High" : "Medium";
}

function inferBatchId(query: string, id: number): string {
  const m = query?.match(/EV-\d{4}/i);
  return m ? m[0].toUpperCase() : `INV-${id}`;
}

function inferStatus(confidence: number): string {
  return confidence >= 70 ? "Completed" : "Under Review";
}

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 80 ? "#22C55E" : value >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <span className="text-xs font-bold tabular-nums" style={{ color }} data-testid={`confidence-${value}`}>
      {value}%
    </span>
  );
}

export default function History() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setLoading(true);
    getHistory()
      .then((data: any) => {
        const investigations = data?.investigations ?? data ?? [];
        const mapped: HistoryRow[] = investigations.map((r: any) => {
          const conf = parseConfidence(r.confidence);
          return {
            id: r.id,
            batchId: inferBatchId(r.query ?? "", r.id),
            issue: r.query ?? "Unknown",
            rootCause: r.root_cause ?? "",
            confidence: conf,
            severity: inferSeverity(conf),
            date: r.created_at ? r.created_at.slice(0, 10) : "",
            status: inferStatus(conf),
          };
        });
        setRows(mapped);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRecords = rows.length;
  const highSeverity = rows.filter((r) => r.severity === "High").length;
  const avgConfidence = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.confidence, 0) / rows.length)
    : 0;
  const underReview = rows.filter((r) => r.status === "Under Review").length;

  const SUMMARY_CARDS = [
    { label: "Total Records", value: String(totalRecords), icon: Database, color: "#3B82F6" },
    { label: "High Severity", value: String(highSeverity), icon: AlertTriangle, color: "#EF4444" },
    { label: "Average Confidence", value: `${avgConfidence}%`, icon: TrendingUp, color: "#22C55E" },
    { label: "Under Review", value: String(underReview), icon: Clock, color: "#F59E0B" },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = rows.filter(
      (r) =>
        !q ||
        r.batchId.toLowerCase().includes(q) ||
        r.issue.toLowerCase().includes(q) ||
        r.rootCause.toLowerCase().includes(q) ||
        r.severity.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
    if (filter === "Completed") result = result.filter((r) => r.status === "Completed");
    if (filter === "Under Review") result = result.filter((r) => r.status === "Under Review");
    if (filter === "High Severity") result = result.filter((r) => r.severity === "High");
    if (filter === "Medium Severity") result = result.filter((r) => r.severity === "Medium");
    return result;
  }, [rows, search, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = a.date.localeCompare(b.date);
      } else {
        cmp = a.confidence - b.confidence;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={12} className="text-muted-foreground" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="text-blue-400" />
    ) : (
      <ChevronDown size={12} className="text-blue-400" />
    );
  };

  return (
    <AppShell title="History" subtitle="Historical Investigation Library">
      <div className="p-6 space-y-5">
        {/* Summary mini cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUMMARY_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-4 flex items-center gap-3 card-hover">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}12`, border: `1px solid ${color}25` }}
              >
                <Icon size={16} color={color} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold text-white">{loading ? "—" : value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              placeholder="Search by batch ID, issue, root cause, severity, or status..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              data-testid="input-search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip}
                className={`text-xs px-3 py-2 rounded-xl font-medium transition-all duration-300 ${
                  filter === chip ? "text-white" : "text-muted-foreground hover:text-white"
                }`}
                style={
                  filter === chip
                    ? { background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }
                }
                onClick={() => {
                  setFilter(chip);
                  setPage(1);
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "700px" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Batch ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Root Cause
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort("confidence")}
                    data-testid="th-confidence"
                  >
                    <div className="flex items-center gap-1">
                      Confidence <SortIcon field="confidence" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Severity
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort("date")}
                    data-testid="th-date"
                  >
                    <div className="flex items-center gap-1">
                      Date <SortIcon field="date" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                      Loading investigations...
                    </td>
                  </tr>
                )}
                {!loading && pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                      {rows.length === 0
                        ? "No investigations found. Run an investigation to see results here."
                        : "No investigations match your search."}
                    </td>
                  </tr>
                )}
                {!loading &&
                  pageRows.map((row, i) => (
                    <tr
                      key={row.id}
                      className="row-hover transition-colors"
                      style={{
                        borderBottom:
                          i < pageRows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      }}
                      data-testid={`row-history-${row.batchId}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-blue-400 text-xs">{row.batchId}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white max-w-[180px] truncate">{row.issue}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {row.rootCause}
                      </td>
                      <td className="px-4 py-3">
                        <ConfidenceBadge value={row.confidence} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge value={row.severity} type="severity" />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{row.date}</td>
                      <td className="px-4 py-3">
                        <StatusBadge value={row.status} type="status" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-xs text-muted-foreground">
              {loading
                ? "Loading..."
                : sorted.length === 0
                ? "0 results"
                : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
                    safePage * PAGE_SIZE,
                    sorted.length
                  )} of ${sorted.length}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.04]"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#FFFFFF" }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                data-testid="button-prev-page"
              >
                Previous
              </button>
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {safePage} of {totalPages}
              </span>
              <button
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/[0.04]"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#FFFFFF" }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                data-testid="button-next-page"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}