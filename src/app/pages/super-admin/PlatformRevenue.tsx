import { motion } from "motion/react";
import { 
  IndianRupee,
  TrendingUp,
  Building2,
  Percent,
  CalendarDays
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import { useState } from "react";
import { StatCard } from "../../components/StatCard";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { formatMoney } from "../../components/currency";

const revenueData = [
  { month: "Oct", platform: 42000, commission: 4200 },
  { month: "Nov", platform: 51000, commission: 5100 },
  { month: "Dec", platform: 58000, commission: 5800 },
  { month: "Jan", platform: 67000, commission: 6700 },
  { month: "Feb", platform: 74000, commission: 7400 },
  { month: "Mar", platform: 85000, commission: 8500 },
];

const revenueRecognitionData = [
  { month: "Oct", recognized: 145000, deferred: 62000 },
  { month: "Nov", recognized: 158000, deferred: 66000 },
  { month: "Dec", recognized: 167000, deferred: 71000 },
  { month: "Jan", recognized: 178000, deferred: 76000 },
  { month: "Feb", recognized: 188000, deferred: 81000 },
  { month: "Mar", recognized: 198000, deferred: 87000 },
];

const recognitionStats = [
  { label: "Recognized Revenue (This Month)", value: "₹198K" },
  { label: "Deferred Revenue", value: "₹87K" },
  { label: "Recognition Rate", value: "69%" },
];

const topTenants = [
  { name: "Acme Corp", revenue: 28400, color: "#8B5CF6" },
  { name: "TechFlow", revenue: 19200, color: "#06B6D4" },
  { name: "DataHub", revenue: 15800, color: "#10B981" },
  { name: "CloudSync", revenue: 12600, color: "#F59E0B" },
  { name: "FinTrack", revenue: 8900, color: "#F43F5E" },
];

const kpis = [
  { label: "Platform Revenue",    value: "₹285K",  trend: "+18.3%", up: true,  icon: IndianRupee },
  { label: "Commission Earned",   value: "₹28.5K", trend: "+18.3%", up: true,  icon: Percent },
  { label: "Active Tenants",      value: "38",     trend: "+4",     up: true,  icon: Building2 },
  { label: "Avg Commission Rate", value: "10%",    trend: "Stable", up: null,  icon: TrendingUp },
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
            <span className="text-muted-foreground">{formatMoney(entry.value, "INR", { compact: true })}</span>
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
        {kpis.map((kpi, i) => (
          <StatCard
            key={kpi.label}
            title={kpi.label}
            value={kpi.value}
            change={kpi.trend}
            changeType={kpi.up === true ? "positive" : kpi.up === false ? "negative" : "neutral"}
            icon={kpi.icon}
            delay={i * 0.07}
            colorIndex={i}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`relative lg:col-span-2 p-6 bg-card border ${getCardThemeByIndex(0).border} rounded-2xl overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(0).topAccent} rounded-t-2xl pointer-events-none`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(0).bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -top-6 -right-6 w-36 h-36 ${getCardThemeByIndex(0).orb10} rounded-full blur-3xl pointer-events-none`} />
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
          className={`relative p-6 bg-card border ${getCardThemeByIndex(1).border} rounded-2xl overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(1).topAccent} rounded-t-2xl pointer-events-none`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(1).bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -bottom-8 -right-8 w-36 h-36 ${getCardThemeByIndex(1).orb5} rounded-full blur-3xl pointer-events-none`} />
          <h3 className="text-sm font-bold text-white mb-5">Top Revenue Tenants</h3>
          <div className="space-y-4">
            {topTenants.map((t, i) => {
              const pct = (t.revenue / topTenants[0].revenue) * 100;
              return (
                <div key={t.name}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-semibold text-white">{t.name}</span>
                    <span className="text-muted-foreground font-mono">{formatMoney(t.revenue, "INR", { compact: true })}</span>
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

      {/* Revenue Recognition (ASC 606) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className={`relative p-6 bg-card border ${getCardThemeByIndex(2).border} rounded-2xl overflow-hidden`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-2xl pointer-events-none`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(2).bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -top-8 -left-8 w-40 h-40 ${getCardThemeByIndex(2).orb10} rounded-full blur-3xl pointer-events-none`} />

        <div className="mb-6">
          <h3 className="text-sm font-bold text-white">Revenue Recognition</h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Deferred revenue reflects prepaid annual subscriptions recognized proportionally over the contract term (ASC 606).
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {recognitionStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="text-xs text-muted-foreground mb-1.5">{s.label}</div>
              <div className="text-xl font-extrabold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueRecognitionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="month" stroke="#3f3f50" tick={{ fill: "#71717a", fontSize: 10 }} />
            <YAxis stroke="#3f3f50" tick={{ fill: "#71717a", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
              formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <Bar dataKey="recognized" stackId="rev" fill="#10B981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="deferred" stackId="rev" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
