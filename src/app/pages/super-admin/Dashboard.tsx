import { motion } from "motion/react";
import { StatCard } from "../../components/StatCard";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { 
  Building2, 
  IndianRupee, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowRight,
  Server,
  Terminal,
  Activity as ActivityIcon,
  ShieldCheck,
  Zap,
  Cpu
} from "lucide-react";
import { Link } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { id: "jan", month: "Jan", revenue: 45000 },
  { id: "feb", month: "Feb", revenue: 52000 },
  { id: "mar", month: "Mar", revenue: 61000 },
  { id: "apr", month: "Apr", revenue: 58000 },
  { id: "may", month: "May", revenue: 70000 },
  { id: "jun", month: "Jun", revenue: 85000 },
];

const tenantData = [
  { id: "acme", name: "Acme Corp", revenue: 28500, mrr: 12000 },
  { id: "techflow", name: "TechFlow", revenue: 24200, mrr: 9800 },
  { id: "cloudsync", name: "CloudSync", revenue: 18900, mrr: 8500 },
  { id: "datahub", name: "DataHub", revenue: 13400, mrr: 5200 },
];

const activities = [
  { action: "New tenant registered", tenant: "Acme Corp", time: "2 minutes ago", type: "register" },
  { action: "Plan template created", tenant: "System Control", time: "15 minutes ago", type: "template" },
  { action: "Tenant approved & isolated", tenant: "TechFlow", time: "1 hour ago", type: "approve" },
  { action: "Revenue threshold reached", tenant: "CloudSync", time: "2 hours ago", type: "limit" },
  { action: "New API key generated", tenant: "DataHub", time: "3 hours ago", type: "key" },
];

export function SuperAdminDashboard() {
  const revenueTheme = getCardThemeByIndex(0);
  const tenantVolumeTheme = getCardThemeByIndex(1);
  const activityTheme = getCardThemeByIndex(2);
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "register": return <Users className="w-4 h-4 text-primary" />;
      case "template": return <Zap className="w-4 h-4 text-amber-400" />;
      case "approve": return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "limit": return <TrendingUp className="w-4 h-4 text-rose-400" />;
      case "key": return <Terminal className="w-4 h-4 text-cyan-400" />;
      default: return <Server className="w-4 h-4 text-white" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case "register": return "bg-primary/10 border-primary/20";
      case "template": return "bg-amber-500/10 border-amber-500/20";
      case "approve": return "bg-emerald-500/10 border-emerald-500/20";
      case "limit": return "bg-rose-500/10 border-rose-500/20";
      case "key": return "bg-cyan-500/10 border-cyan-500/20";
      default: return "bg-white/5 border-white/[0.08]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Platform Infrastructure</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5 animate-pulse" />
              Healthy
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Aggregated multi-tenant operations, global database segments, and platform revenue metrics.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/super-admin/tenants">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <span>Manage Tenants</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Active Tenants"
          value="48"
          change="+12%"
          changeType="positive"
          icon={Building2}
          delay={0}
          colorIndex={0}
        />
        <StatCard
          title="Platform Revenue"
          value="₹285K"
          change="+23%"
          changeType="positive"
          icon={IndianRupee}
          delay={0.1}
          colorIndex={1}
        />
        <StatCard
          title="Total Users"
          value="1.2K"
          change="+8%"
          changeType="positive"
          icon={Users}
          delay={0.2}
          colorIndex={2}
        />
        <StatCard
          title="Growth Velocity"
          value="34%"
          change="+5%"
          changeType="positive"
          icon={TrendingUp}
          colorIndex={3}
          delay={0.3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Trend Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`relative p-6 bg-card border ${revenueTheme.border} rounded-2xl flex flex-col justify-between overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${revenueTheme.topAccent} rounded-t-2xl pointer-events-none`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${revenueTheme.bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br ${revenueTheme.bgGlow} rounded-full blur-3xl pointer-events-none`} />
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Aggregated Platform MRR</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Aggregated billing payouts across all isolated client databases.</p>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenueSA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
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
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenueSA)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Tenants Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`relative p-6 bg-card border ${tenantVolumeTheme.border} rounded-2xl flex flex-col justify-between overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${tenantVolumeTheme.topAccent} rounded-t-2xl pointer-events-none`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${tenantVolumeTheme.bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br ${tenantVolumeTheme.bgGlow} rounded-full blur-3xl pointer-events-none`} />
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Top Tenant Volume</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Top-earning companies utilizing the active API gateway.</p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenantData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#71717A" width={80} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0B0F",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    fontSize: 12
                  }}
                />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Activity Logs Stream */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`relative p-6 bg-card border ${activityTheme.border} rounded-2xl overflow-hidden`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${activityTheme.topAccent} rounded-t-2xl pointer-events-none`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${activityTheme.bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -bottom-8 -right-8 w-48 h-48 bg-gradient-to-br ${activityTheme.bgGlow} rounded-full blur-3xl pointer-events-none`} />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-primary" />
              <span>Real-time System Action Feed</span>
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Audit trail of critical tenant events, database allocations, and system approvals.</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.08 }}
              className="flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] rounded-2xl hover:border-white/[0.08] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${getActivityBg(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-none mb-1">{activity.action}</div>
                  <div className="text-[10px] text-muted-foreground font-light flex items-center gap-1.5">
                    <span>Initiated by:</span>
                    <span className="text-primary font-semibold">{activity.tenant}</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground font-light">{activity.time}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
