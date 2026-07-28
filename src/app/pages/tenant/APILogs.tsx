import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Download, Eye, Clock, Hash } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { exportToCsv } from "../../components/exportToCsv";
import { EmptyState } from "../../components/EmptyState";

interface ApiLog {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  status: number;
  time: string;
  duration: string;
  traceId: string;
  requestHeaders: Record<string, string>;
  requestPayload: string;
  responseHeaders: Record<string, string>;
  responsePayload: string;
}

const logs: ApiLog[] = [
  {
    id: "log_1", method: "POST", endpoint: "/api/subscriptions", status: 200, time: "12:45:23", duration: "124ms",
    traceId: "trc_8f2a1c",
    requestHeaders: { "Content-Type": "application/json", Authorization: "Bearer sk_live_***" },
    requestPayload: '{ "customerId": "cus_123", "planId": "plan_1_2" }',
    responseHeaders: { "Content-Type": "application/json" },
    responsePayload: '{ "id": "sub_9812", "status": "active" }',
  },
  {
    id: "log_2", method: "GET", endpoint: "/api/customers", status: 200, time: "12:44:18", duration: "89ms",
    traceId: "trc_1b93de",
    requestHeaders: { Authorization: "Bearer sk_live_***" },
    requestPayload: "—",
    responseHeaders: { "Content-Type": "application/json" },
    responsePayload: '{ "data": [ ...128 customers ] }',
  },
  {
    id: "log_3", method: "PUT", endpoint: "/api/plans/123", status: 200, time: "12:43:05", duration: "156ms",
    traceId: "trc_4c7f21",
    requestHeaders: { "Content-Type": "application/json", Authorization: "Bearer sk_test_***" },
    requestPayload: '{ "price": 129900 }',
    responseHeaders: { "Content-Type": "application/json" },
    responsePayload: '{ "id": "plan_123", "price": 129900 }',
  },
  {
    id: "log_4", method: "DELETE", endpoint: "/api/webhooks/456", status: 204, time: "12:41:32", duration: "67ms",
    traceId: "trc_ad3e90",
    requestHeaders: { Authorization: "Bearer sk_live_***" },
    requestPayload: "—",
    responseHeaders: {},
    responsePayload: "—",
  },
  {
    id: "log_5", method: "POST", endpoint: "/api/usage/events", status: 429, time: "12:40:11", duration: "12ms",
    traceId: "trc_ee109a",
    requestHeaders: { "Content-Type": "application/json", Authorization: "Bearer sk_test_***" },
    requestPayload: '{ "event": "api_call", "units": 5 }',
    responseHeaders: { "Content-Type": "application/json", "Retry-After": "30" },
    responsePayload: '{ "error": "rate_limit_exceeded" }',
  },
  {
    id: "log_6", method: "POST", endpoint: "/api/invoices/finalize", status: 500, time: "12:38:47", duration: "342ms",
    traceId: "trc_77c1aa",
    requestHeaders: { "Content-Type": "application/json", Authorization: "Bearer sk_live_***" },
    requestPayload: '{ "invoiceId": "inv_1024" }',
    responseHeaders: { "Content-Type": "application/json" },
    responsePayload: '{ "error": "internal_server_error" }',
  },
];

function statusTone(status: number) {
  if (status >= 500) return "bg-rose-500/10 text-rose-500";
  if (status >= 400) return "bg-amber-500/10 text-amber-500";
  return "bg-success/10 text-success";
}

export function APILogs() {
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inspecting, setInspecting] = useState<ApiLog | null>(null);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (methodFilter !== "all" && log.method !== methodFilter) return false;
      if (statusFilter === "2xx" && log.status >= 300) return false;
      if (statusFilter === "4xx" && (log.status < 400 || log.status >= 500)) return false;
      if (statusFilter === "5xx" && log.status < 500) return false;
      if (query.trim() && !`${log.endpoint} ${log.traceId}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [query, methodFilter, statusFilter]);

  const handleExport = () => {
    exportToCsv(
      filtered,
      ["Method", "Endpoint", "Status", "Time", "Duration", "Trace ID"],
      (l) => [l.method, l.endpoint, l.status, l.time, l.duration, l.traceId],
      "api-logs-export.csv",
    );
    toast.success("API logs exported", { description: `${filtered.length} logs exported to CSV.` });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Logs</h1>
          <p className="text-muted-foreground">Monitor API requests and responses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="px-5 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export Logs</span>
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoint or trace id…"
            className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none">
          <option value="all">All methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none">
          <option value="all">All statuses</option>
          <option value="2xx">2xx Success</option>
          <option value="4xx">4xx Client Error</option>
          <option value="5xx">5xx Server Error</option>
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <table className="w-full font-mono text-sm">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Method</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Endpoint</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Time</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Duration</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Trace ID</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, index) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setInspecting(log)}
              >
                <td className="py-3 px-6">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{log.method}</span>
                </td>
                <td className="py-3 px-6 text-muted-foreground">{log.endpoint}</td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 text-xs rounded ${statusTone(log.status)}`}>{log.status}</span>
                </td>
                <td className="py-3 px-6 text-muted-foreground">{log.time}</td>
                <td className="py-3 px-6 text-muted-foreground">{log.duration}</td>
                <td className="py-3 px-6 text-muted-foreground text-xs">{log.traceId}</td>
                <td className="py-3 px-6 text-right">
                  <button onClick={(e) => { e.stopPropagation(); setInspecting(log); }} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState title="No logs match your filters" description="Try adjusting search or filters." />
        )}
      </motion.div>

      {/* Request/Response Inspector */}
      <Dialog open={!!inspecting} onOpenChange={(open) => !open && setInspecting(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-base">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{inspecting?.method}</span>
              <span>{inspecting?.endpoint}</span>
            </DialogTitle>
            <DialogDescription className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{inspecting?.traceId}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{inspecting?.duration}</span>
            </DialogDescription>
          </DialogHeader>
          {inspecting && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Request Headers</div>
                <pre className="bg-muted/20 border border-border rounded-lg p-3 text-xs overflow-x-auto">{JSON.stringify(inspecting.requestHeaders, null, 2)}</pre>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Request Payload</div>
                <pre className="bg-muted/20 border border-border rounded-lg p-3 text-xs overflow-x-auto">{inspecting.requestPayload}</pre>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Response Headers</div>
                <pre className="bg-muted/20 border border-border rounded-lg p-3 text-xs overflow-x-auto">{JSON.stringify(inspecting.responseHeaders, null, 2)}</pre>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Response Payload</div>
                <pre className={`border rounded-lg p-3 text-xs overflow-x-auto ${inspecting.status >= 400 ? "bg-rose-500/5 border-rose-500/20" : "bg-muted/20 border-border"}`}>{inspecting.responsePayload}</pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
