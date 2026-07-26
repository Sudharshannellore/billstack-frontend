import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Database, 
  Cpu, 
  Clock, 
  ArrowUpRight, 
  Terminal, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Pause,
  Server
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

// Mock usage data with multiple metrics
const usageHistory = [
  { date: "Jul 19", apiCalls: 12400, storage: 45, compute: 12 },
  { date: "Jul 20", apiCalls: 15200, storage: 48, compute: 14 },
  { date: "Jul 21", apiCalls: 18900, storage: 52, compute: 19 },
  { date: "Jul 22", apiCalls: 24500, storage: 55, compute: 22 },
  { date: "Jul 23", apiCalls: 21200, storage: 58, compute: 18 },
  { date: "Jul 24", apiCalls: 28900, storage: 61, compute: 26 },
  { date: "Jul 25", apiCalls: 32400, storage: 64, compute: 30 },
];

const initialEvents = [
  { id: "evt_9381", event: "api_call", customer: "Acme Corp", units: 50, status: "success", time: "Just now" },
  { id: "evt_9380", event: "storage_upload", customer: "TechFlow Ltd", units: 120, status: "success", time: "2 min ago" },
  { id: "evt_9379", event: "compute_job", customer: "Alice Johnson", units: 8, status: "success", time: "5 min ago" },
  { id: "evt_9378", event: "api_call", customer: "DevTools Inc", units: 10, status: "error", time: "8 min ago" },
  { id: "evt_9377", event: "api_call", customer: "DataHub co", units: 25, status: "success", time: "12 min ago" },
];

export function Usage() {
  const [selectedMetric, setSelectedMetric] = useState<"apiCalls" | "storage" | "compute">("apiCalls");
  const [events, setEvents] = useState(initialEvents);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time event ingestion
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const customers = ["Acme Corp", "TechFlow Ltd", "Alice Johnson", "DevTools Inc", "DataHub co"];
      const eventsList = ["api_call", "storage_upload", "compute_job"];
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomEvent = eventsList[Math.floor(Math.random() * eventsList.length)];
      const randomUnits = randomEvent === "api_call" ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 200) + 5;
      const randomStatus = Math.random() > 0.05 ? "success" : "error";
      const randomId = "evt_" + Math.floor(Math.random() * 9000 + 1000);

      const newEvent = {
        id: randomId,
        event: randomEvent,
        customer: randomCustomer,
        units: randomUnits,
        status: randomStatus,
        time: "Just now"
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getMetricDetails = () => {
    switch (selectedMetric) {
      case "apiCalls":
        return {
          title: "API Gateway Requests",
          color: "#8B5CF6",
          gradient: "from-primary/20 to-primary/0",
          total: "1,53,500 units",
          quota: "10,00,000 max quota"
        };
      case "storage":
        return {
          title: "Cloud Disk Storage",
          color: "#06B6D4",
          gradient: "from-cyan-500/20 to-cyan-500/0",
          total: "64 GB",
          quota: "100 GB max quota"
        };
      case "compute":
        return {
          title: "vCPU/Memory Compute Hours",
          color: "#10B981",
          gradient: "from-emerald-500/20 to-emerald-500/0",
          total: "157 Hrs",
          quota: "500 Hrs max quota"
        };
    }
  };

  const currentDetails = getMetricDetails();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Resource Usage</h1>
          <p className="text-muted-foreground text-sm">Monitor meter units, evaluate consumption aggregates, and review event ingestion logs.</p>
        </div>
      </div>

      {/* Tabs Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: "apiCalls" as const,
            title: "API Calls",
            value: "1,53,500",
            percent: "15.3% used",
            quotaValue: 15.3,
            icon: Activity,
            color: "text-primary border-primary bg-primary/5",
            barColor: "bg-primary"
          },
          {
            id: "storage" as const,
            title: "Storage Utilized",
            value: "64.2 GB",
            percent: "64.2% used",
            quotaValue: 64.2,
            icon: Database,
            color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/5",
            barColor: "bg-cyan-400"
          },
          {
            id: "compute" as const,
            title: "Compute Hours",
            value: "157.8 Hrs",
            percent: "31.5% used",
            quotaValue: 31.5,
            icon: Cpu,
            color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
            barColor: "bg-emerald-400"
          }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedMetric === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id)}
              whileHover={{ y: -3 }}
              className={`p-6 border rounded-2xl text-left transition-all duration-300 ${
                isSelected 
                  ? `${tab.color} border-2 shadow-lg shadow-black/20`
                  : "bg-card border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.01]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{tab.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">{tab.value}</h3>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                  <span>Usage quota limit</span>
                  <span>{tab.percent}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${tab.barColor}`} 
                    style={{ width: `${tab.quotaValue}%` }}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Main chart section */}
      <motion.div
        layout
        className="relative p-6 bg-card border border-violet-500/20 rounded-2xl space-y-6 overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-t-2xl pointer-events-none" />
        {/* Gradient tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/8 via-transparent to-indigo-600/5 pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{currentDetails.title}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/[0.08] font-light">
                  {currentDetails.total}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground font-light mt-0.5">Ingestion intervals aggregated by day.</p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{currentDetails.quota}</span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={usageHistory}>
              <defs>
                <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentDetails.color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={currentDetails.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0B0B0F", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  borderRadius: "12px",
                  fontSize: 12
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke={currentDetails.color} 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#usageGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Real-time Ingestion Logs Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card border border-emerald-500/20 rounded-2xl p-6 overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-2xl pointer-events-none" />
        {/* Gradient tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/8 via-transparent to-teal-600/5 pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <span>Live Event Ingestion Stream</span>
                </h3>
                <p className="text-xs text-muted-foreground font-light mt-0.5">Real-time usage API payload logs routed to the billing coordinator.</p>
              </div>
            </div>

            <button 
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isLive 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-white/5 border-white/[0.08] text-muted-foreground"
              }`}
            >
              {isLive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs font-semibold text-muted-foreground">
                  <th className="pb-3 pl-4">Event ID</th>
                  <th className="pb-3">Event Name</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3 pr-4">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                <AnimatePresence initial={false}>
                  {events.map((event) => (
                    <motion.tr 
                      key={event.id}
                      layoutId={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="hover:bg-white/[0.01] transition-colors text-xs text-white font-medium"
                    >
                      <td className="py-4 pl-4 font-mono text-muted-foreground">{event.id}</td>
                      <td className="py-4">
                        <span className="font-semibold text-white bg-white/[0.02] border border-white/[0.05] px-2 py-0.5 rounded-md font-mono">
                          {event.event}
                        </span>
                      </td>
                      <td className="py-4">{event.customer}</td>
                      <td className="py-4 font-bold">{event.units} units</td>
                      <td className="py-4 text-muted-foreground">{event.time}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          event.status === "success" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {event.status === "success" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{event.status === "success" ? "200 OK" : "400 BAD"}</span>
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
