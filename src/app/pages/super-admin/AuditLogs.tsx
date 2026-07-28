import { motion, AnimatePresence } from "motion/react";
import {
  FileSearch,
  Filter,
  Search,
  ShieldCheck,
  FileText,
  Terminal,
  Settings,
  UserCog,
  Globe,
  Lock,
  Eye,
  Clock,
  Download
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";

const allLogs = [
  { id: "log_001", action: "Tenant Approved", user: "admin@billstack.com", tenant: "Acme Corp", time: "2 hours ago", category: "tenant", severity: "success" },
  { id: "log_002", action: "Plan Template Created", user: "admin@billstack.com", tenant: "System", time: "5 hours ago", category: "template", severity: "info" },
  { id: "log_003", action: "Global Resource Updated", user: "admin@billstack.com", tenant: "System", time: "1 day ago", category: "resource", severity: "info" },
  { id: "log_004", action: "Tenant Settings Modified", user: "admin@billstack.com", tenant: "TechFlow", time: "2 days ago", category: "tenant", severity: "warning" },
  { id: "log_005", action: "API Key Revoked", user: "admin@billstack.com", tenant: "DataHub", time: "3 days ago", category: "security", severity: "warning" },
  { id: "log_006", action: "Failed Login Attempt", user: "unknown@external.io", tenant: "System", time: "4 days ago", category: "security", severity: "error" },
  { id: "log_007", action: "Database Backup Triggered", user: "system@billstack.com", tenant: "System", time: "5 days ago", category: "system", severity: "info" },
  { id: "log_008", action: "Tenant Suspended", user: "admin@billstack.com", tenant: "BadActor Inc", time: "6 days ago", category: "tenant", severity: "error" },
];

const categories = ["all", "tenant", "template", "resource", "security", "system"];

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  tenant: { icon: UserCog, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  template: { icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  resource: { icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  security: { icon: Lock, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  system: { icon: Terminal, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
};

const severityConfig: Record<string, { label: string; classes: string }> = {
  success: { label: "Success", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  info: { label: "Info", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  warning: { label: "Warning", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  error: { label: "Error", classes: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

function exportLogsToCsv(logs: typeof allLogs) {
  const headers = ["Event", "Category", "Performed By", "Tenant", "Severity", "When"];
  const rows = logs.map(log => [log.action, log.category, log.user, log.tenant, log.severity, log.time]);
  const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows]
    .map(row => row.map(escapeCell).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "audit-logs-export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function AuditLogs() {
  const theme = getCardThemeByIndex(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = allLogs.filter(log => {
    const matchesCategory = activeCategory === "all" || log.category === activeCategory;
    const matchesSearch = search === "" || 
      log.action.toLowerCase().includes(search.toLowerCase()) || 
      log.tenant.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-2">
            <FileSearch className="w-7 h-7 text-primary" />
            Audit Log Stream
          </h1>
          <p className="text-muted-foreground text-sm mb-2">Chronological record of every system action, access event, and admin operation.</p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Logs are cryptographically hashed and cannot be edited or deleted</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2">
            <Clock className="w-4 h-4" />
            <span>Auto-refreshes every 30s</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              exportLogsToCsv(filtered);
              toast.success("Audit logs exported", { description: `${filtered.length} log entries exported to CSV.` });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.06] hover:border-primary/40 rounded-xl text-sm font-semibold text-white transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </motion.button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by action, tenant, or user..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/[0.06] focus:border-primary/40 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white/[0.02] border border-white/[0.05] text-muted-foreground hover:text-white hover:border-white/[0.12]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <motion.div className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden`}>
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none z-10`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -bottom-10 -right-10 w-56 h-56 bg-gradient-to-br ${theme.bgGlow} rounded-full blur-3xl pointer-events-none`} />
        <div className="relative z-10 border-b border-white/[0.04] px-6 py-3 bg-white/[0.01]">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {filtered.length} events found
          </span>
        </div>
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04] text-left text-xs font-semibold text-muted-foreground">
                <th className="py-3 pl-6 pr-4">Event</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Performed By</th>
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 pl-4 pr-6">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence>
                {filtered.map((log, idx) => {
                  const catCfg = categoryConfig[log.category];
                  const sevCfg = severityConfig[log.severity];
                  const CatIcon = catCfg?.icon ?? FileSearch;
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="hover:bg-white/[0.01] transition-colors text-xs text-white font-medium"
                    >
                      <td className="py-4 pl-6 pr-4 font-semibold">{log.action}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${catCfg?.bg}`}>
                          <CatIcon className={`w-3 h-3 ${catCfg?.color}`} />
                          <span className={catCfg?.color}>{log.category}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">{log.user}</td>
                      <td className="py-4 px-4 text-muted-foreground">{log.tenant}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sevCfg?.classes}`}>
                          {sevCfg?.label}
                        </span>
                      </td>
                      <td className="py-4 pl-4 pr-6 text-muted-foreground">{log.time}</td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}