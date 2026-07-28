import { motion } from "motion/react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
} from "lucide-react";

// Mock service list, mirroring super-admin/Monitoring.tsx
const services = [
  { name: "API Gateway", status: "operational", uptime: "99.99%" },
  { name: "Billing Engine", status: "operational", uptime: "99.98%" },
  { name: "Auth Service", status: "operational", uptime: "100.00%" },
  { name: "Webhook Dispatcher", status: "degraded", uptime: "98.62%" },
  { name: "Usage Processor", status: "operational", uptime: "99.95%" },
  { name: "Invoice Generator", status: "operational", uptime: "99.97%" },
];

const statusConfig = {
  operational: { label: "Operational", icon: CheckCircle2, color: "text-emerald-400", dot: "bg-emerald-400" },
  degraded: { label: "Degraded", icon: AlertTriangle, color: "text-amber-400", dot: "bg-amber-400" },
  outage: { label: "Outage", icon: XCircle, color: "text-rose-400", dot: "bg-rose-400" },
};

const incidents = [
  { date: "Apr 10, 2026", title: "Elevated API latency", status: "resolved", duration: "23 minutes" },
  { date: "Feb 22, 2026", title: "Webhook Dispatcher delivery delays", status: "resolved", duration: "1 hour 12 minutes" },
  { date: "Jan 05, 2026", title: "Invoice Generator brief outage", status: "resolved", duration: "8 minutes" },
];

// Build a deterministic 30-day uptime strip per service. A couple of services
// get one or two "amber" incident days to line up with the history above.
function buildUptimeDays(serviceName: string): Array<"operational" | "degraded" | "outage"> {
  const days: Array<"operational" | "degraded" | "outage"> = Array.from({ length: 30 }, () => "operational");

  if (serviceName === "Webhook Dispatcher") {
    days[6] = "degraded"; // ~Feb 22 area
    days[3] = "degraded"; // current ongoing blip
  }
  if (serviceName === "Invoice Generator") {
    days[24] = "degraded";
  }
  if (serviceName === "API Gateway") {
    days[19] = "degraded"; // Apr 10 latency event
  }

  return days;
}

const dayBarColor: Record<string, string> = {
  operational: "bg-emerald-400/80",
  degraded: "bg-amber-400/80",
  outage: "bg-rose-400/80",
};

const overallDegraded = services.some((s) => s.status !== "operational");

export function StatusPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-foreground font-sans relative overflow-hidden">
      {/* Background decorations, consistent with Landing.tsx */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 sm:py-20">
        {/* Header / logo mark */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl tracking-tighter">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">BillStack</span>
            <span className="text-[10px] text-primary font-semibold tracking-widest uppercase">System Status</span>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-8 flex items-center gap-3"
        >
          <Activity className="w-7 h-7 text-primary" />
          BillStack System Status
        </motion.h1>

        {/* Overall status banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`flex items-center gap-3 rounded-2xl border px-5 py-4 mb-10 ${
            overallDegraded
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-emerald-500/10 border-emerald-500/20"
          }`}
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-2.5 h-2.5 rounded-full ${overallDegraded ? "bg-amber-400" : "bg-emerald-400"}`}
          />
          <span className={`text-sm font-bold ${overallDegraded ? "text-amber-400" : "text-emerald-400"}`}>
            {overallDegraded ? "Some Systems Experiencing Issues" : "All Systems Operational"}
          </span>
        </motion.div>

        {/* Services list */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden mb-12"
        >
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <h2 className="text-sm font-bold text-white">Service Components</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {services.map((svc, i) => {
              const cfg = statusConfig[svc.status as keyof typeof statusConfig];
              const Icon = cfg.icon;
              const days = buildUptimeDays(svc.name);
              return (
                <motion.div
                  key={svc.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05 }}
                  className="px-6 py-5"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      <span className="text-sm font-semibold text-white">{svc.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {svc.uptime} uptime last 90 days
                      </span>
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </div>
                    </div>
                  </div>

                  {/* 30-day uptime strip */}
                  <div className="flex items-center gap-[3px]">
                    {days.map((day, idx) => (
                      <div
                        key={idx}
                        title={day}
                        className={`h-5 flex-1 rounded-sm ${dayBarColor[day]}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
                    <span>30 days ago</span>
                    <span>Today</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Past Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-sm font-bold text-white mb-4">Past Incidents</h2>
          <div className="space-y-3">
            {incidents.map((incident, i) => (
              <div
                key={incident.title}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 rounded-xl bg-white/[0.01] border border-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-28 shrink-0">{incident.date}</span>
                  <span className="text-sm text-white font-medium">{incident.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolved
                  </span>
                  <span className="text-muted-foreground">Duration: {incident.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/[0.04] text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BillStack. This page is updated automatically as service health changes.</p>
        </div>
      </div>
    </div>
  );
}
