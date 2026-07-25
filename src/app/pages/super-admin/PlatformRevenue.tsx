import { motion } from "motion/react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Percent,
  ArrowUpRight,
  CalendarDays
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, Legend
} from "recharts";
import { useState } from "react";

const revenueData = [
  { month: "Oct", platform: 42000, commission: 4200 },
  { month: "Nov", platform: 51000, commission: 5100 },
  { month: "Dec", platform: 58000, commission: 5800 },
  { month: "Jan", platform: 67000, commission: 6700 },
  { month: "Feb", platform: 74000, commission: 7400 },
  { month: "Mar", platform: 85000, commission: 8500 },
];

const topTenants = [
  { name: "Acme Corp", revenue: 28400, color: "#8B5CF6" },
  { name: "TechFlow", revenue: 19200, color: "#06B6D4" },
  { name: "DataHub", revenue: 15800, color: "#10B981" },
  { name: "CloudSync", revenue: 12600, color: "#F59E0B" },
  { name: "FinTrack", revenue: 8900, color: "#F43F5E" },
];

const kpis = [
  { label: "Platform Revenue", value: "$285K", trend: "+18.3%", up: true, icon: DollarSign, color: "primary", glow: "primary/20" },
  { label: "Commission Earned", value: "$28.5K", trend: "+18.3%", up: true, icon: Percent, color: "violet-400", glow: "violet-500/20" },
  { label: "Active Tenants", value: "38", trend: "+4", up: true, icon: Building2, color: "cyan-400", glow: "cyan-500/20" },
  { label: "Avg Commission Rate", value: "10%", trend: "Stable", up: null, icon: TrendingUp, color: "emerald-400", glow: "emerald-500/20" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e0e16] border border-white/[0.06] rounded-xl px-4 py-3 shadow-xl text-xs">
        <div className="text-muted-foreground mb-1.5 font-semibold">{label}</div>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-white font-bold capitalize">{entry.dataKey}:</span>
            <span className="text-muted-foreground">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PlatformRevenue() {
  const [period, setPeriod] = useState<"6m" | "3m">("6m");
  const data = period === "6m" ? revenueData : revenueData.slice(-3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Platform Revenue</h1>
          <p className="text-muted-foreground text-sm">Track platform-wide earnings, commissions, and tenant contribution breakdowns.</p>
        </div>
        <div className="flex items-center gap-1.5">
          {(["3m", "6m"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                period === p
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white/[0.02] border border-white/[0.06] text-muted-foreground hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative p-5 bg-card border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${kpi.glow} rounded-full blur-xl opacity-40`} />
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl bg-${kpi.color}/10 border border-${kpi.color}/20 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 ${
                  kpi.up === true ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  kpi.up === false ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                  "bg-white/5 text-muted-foreground border border-white/[0.06]"
                }`}>
                  {kpi.up === true && <ArrowUpRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-0.5">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 p-6 bg-card border border-white/[0.06] rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Platform billings vs. commission</p>
            </div>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="platGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" stroke="#3f3f50" tick={{ fill: "#71717a", fontSize: 10 }} />
              <YAxis stroke="#3f3f50" tick={{ fill: "#71717a", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="platform" stroke="#8B5CF6" strokeWidth={2} fill="url(#platGrad)" />
              <Area type="monotone" dataKey="commission" stroke="#06B6D4" strokeWidth={2} fill="url(#commGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-2 text-xs"><span className="w-3 h-0.5 rounded-full bg-primary inline-block" /><span className="text-muted-foreground">Platform</span></div>
            <div className="flex items-center gap-2 text-xs"><span className="w-3 h-0.5 rounded-full bg-cyan-400 inline-block" /><span className="text-muted-foreground">Commission</span></div>
          </div>
        </motion.div>

        {/* Top Tenants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-card border border-white/[0.06] rounded-2xl"
        >
          <h3 className="text-sm font-bold text-white mb-5">Top Revenue Tenants</h3>
          <div className="space-y-4">
            {topTenants.map((t, i) => {
              const pct = (t.revenue / topTenants[0].revenue) * 100;
              return (
                <div key={t.name}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-semibold text-white">{t.name}</span>
                    <span className="text-muted-foreground font-mono">${t.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.07, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: t.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
