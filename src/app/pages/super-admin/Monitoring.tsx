import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Server, 
  Database, 
  Zap, 
  Globe,
  Clock,
  RefreshCw,
  ArrowUpRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getCardThemeByIndex } from "../../components/cardThemes";

const metrics = [
  { name: "API Response Time", value: "124ms",  raw: 124,   target: 200, unit: "ms",    status: "healthy", icon: Zap },
  { name: "DB Connections",    value: "45/100", raw: 45,    target: 100, unit: "conns", status: "healthy", icon: Database },
  { name: "Error Rate",        value: "0.02%",  raw: 0.02,  target: 1,   unit: "%",     status: "healthy", icon: AlertTriangle },
  { name: "Uptime",            value: "99.98%", raw: 99.98, target: 100, unit: "%",     status: "healthy", icon: Server },
];

const services = [
  { name: "API Gateway", status: "operational", latency: "62ms" },
  { name: "Billing Engine", status: "operational", latency: "38ms" },
  { name: "Auth Service", status: "operational", latency: "21ms" },
  { name: "Webhook Dispatcher", status: "degraded", latency: "340ms" },
  { name: "Usage Processor", status: "operational", latency: "88ms" },
  { name: "Invoice Generator", status: "operational", latency: "112ms" },
];

const generateData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${(i + 1) * 5}m`,
    response: Math.floor(100 + Math.random() * 80),
    errors: Math.floor(Math.random() * 5),
  }));
};

const statusConfig = {
  operational: { label: "Operational", icon: CheckCircle2, color: "text-emerald-400", dot: "bg-emerald-400" },
  degraded: { label: "Degraded", icon: AlertTriangle, color: "text-amber-400", dot: "bg-amber-400" },
  outage: { label: "Outage", icon: XCircle, color: "text-rose-400", dot: "bg-rose-400" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e0e16] border border-white/[0.06] rounded-xl px-4 py-3 shadow-xl text-xs">
        <div className="text-muted-foreground mb-1.5 font-mono">T-{label} ago</div>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-white font-semibold">{entry.value}{entry.dataKey === "response" ? "ms" : " errs"}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Monitoring() {
  const [chartData, setChartData] = useState(generateData());
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 300);
      setChartData(generateData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            <Activity className="w-7 h-7 text-primary" />
            Platform Monitoring
          </h1>
          <p className="text-muted-foreground text-sm">Live health metrics across all platform services and infrastructure components.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
          <motion.span
            animate={{ opacity: pulsing ? 1 : [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-400"
          />
          <span>Live — All Systems Go</span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          const pct = Math.min((metric.raw / metric.target) * 100, 100);
          const theme = getCardThemeByIndex(i);
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`relative p-5 bg-card border ${theme.border} rounded-2xl overflow-hidden group transition-all duration-300`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
              {/* Glow orb */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${theme.orb10} rounded-full blur-xl pointer-events-none`} />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="relative z-10 text-2xl font-black text-white mb-1">{metric.value}</div>
              <div className="relative z-10 text-xs text-muted-foreground mb-3">{metric.name}</div>
              {/* Mini bar */}
              <div className="relative z-10 w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((metric.raw / metric.target) * 100, 100)}%` }}
                  transition={{ delay: i * 0.07 + 0.3, duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${theme.topAccent} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Response Time Chart + Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`relative lg:col-span-2 p-6 bg-card border ${getCardThemeByIndex(2).border} rounded-2xl overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-2xl pointer-events-none`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(2).bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -top-6 -right-6 w-36 h-36 ${getCardThemeByIndex(2).orb10} rounded-full blur-3xl pointer-events-none`} />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Response Time & Errors</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 60 minutes</p>
            </div>
            <RefreshCw
              className={`w-4 h-4 text-muted-foreground cursor-pointer transition-transform ${pulsing ? "rotate-180" : ""}`}
              onClick={() => setChartData(generateData())}
            />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="time" stroke="#3f3f50" tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis stroke="#3f3f50" tick={{ fill: "#71717a", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="response" stroke="#8B5CF6" strokeWidth={2} fill="url(#responseGrad)" />
              <Area type="monotone" dataKey="errors" stroke="#f43f5e" strokeWidth={2} fill="url(#errorGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Service Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`relative p-6 bg-card border ${getCardThemeByIndex(3).border} rounded-2xl overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(3).topAccent} rounded-t-2xl pointer-events-none`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(3).bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -bottom-8 -right-8 w-36 h-36 ${getCardThemeByIndex(3).orb5} rounded-full blur-3xl pointer-events-none`} />
          <h3 className="text-sm font-bold text-white mb-5">Service Status</h3>
          <div className="space-y-3">
            {services.map((svc, i) => {
              const cfg = statusConfig[svc.status as keyof typeof statusConfig];
              return (
                <motion.div
                  key={svc.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.07] transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className="text-xs font-semibold text-white">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{svc.latency}</span>
                    <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
