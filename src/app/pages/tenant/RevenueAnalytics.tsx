import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Sparkles, 
  Download,
  Percent,
  Layers,
  ChevronDown,
  DollarSign
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { getCardThemeByIndex } from "../../components/cardThemes";

const timeRanges = ["Last 7 Days", "Last 30 Days", "Last 12 Months", "All Time"];

const revenueHistoryData = [
  { month: "Jan", gross: 24000, net: 19800, expenses: 4200 },
  { month: "Feb", gross: 29000, net: 24200, expenses: 4800 },
  { month: "Mar", gross: 35000, net: 29800, expenses: 5200 },
  { month: "Apr", gross: 32000, net: 27100, expenses: 4900 },
  { month: "May", gross: 42000, net: 35900, expenses: 6100 },
  { month: "Jun", gross: 48000, net: 41200, expenses: 6800 },
  { month: "Jul", gross: 55000, net: 47500, expenses: 7500 },
];

const planRevenueData = [
  { name: "SaaS Pro", value: 18400, color: "#8B5CF6" },
  { name: "Enterprise Custom", value: 15200, color: "#10B981" },
  { name: "Credits Wallet", value: 8900, color: "#F59E0B" },
  { name: "Data Bundles", value: 5000, color: "#06B6D4" },
];

const cohortRetentionData = [
  { month: "Month 0", "Jan 2026": 100, "Feb 2026": 100, "Mar 2026": 100 },
  { month: "Month 1", "Jan 2026": 92, "Feb 2026": 90, "Mar 2026": 94 },
  { month: "Month 2", "Jan 2026": 87, "Feb 2026": 84, "Mar 2026": 89 },
  { month: "Month 3", "Jan 2026": 83, "Feb 2026": 79, "Mar 2026": 85 },
];

const cohortColors: Record<string, string> = {
  "Jan 2026": "#8B5CF6",
  "Feb 2026": "#10B981",
  "Mar 2026": "#06B6D4",
};

const invoiceLogs = [
  { id: "INV-0098", customer: "Acme Corp", plan: "Enterprise Custom", amount: "₹15,200", status: "paid", date: "Jul 24, 2026" },
  { id: "INV-0097", customer: "TechFlow Ltd", plan: "SaaS Pro", amount: "₹2,999", status: "paid", date: "Jul 23, 2026" },
  { id: "INV-0096", customer: "Alice Johnson", plan: "Credits Wallet", amount: "₹5,000", status: "paid", date: "Jul 22, 2026" },
  { id: "INV-0095", customer: "DevTools Inc", plan: "SaaS Pro", amount: "₹2,999", status: "failed", date: "Jul 20, 2026" },
  { id: "INV-0094", customer: "DataHub co", plan: "Data Bundles", amount: "₹1,200", status: "refunded", date: "Jul 18, 2026" },
];

export function RevenueAnalytics() {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [activeMetricTab, setActiveMetricTab] = useState<"gross" | "net">("gross");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Revenue Analytics</h1>
          <p className="text-muted-foreground text-sm">Monitor gross collections, net income, churn variables, and active invoicing.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRange === range 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Gross Revenue",
            value: "₹2,65,000",
            change: "+14.2%",
            isPositive: true,
            icon: IndianRupee,
          },
          {
            title: "Net Income",
            value: "₹2,26,900",
            change: "+16.8%",
            isPositive: true,
            icon: ArrowUpRight,
          },
          {
            title: "Average LTV",
            value: "₹34,800",
            change: "-2.4%",
            isPositive: false,
            icon: Layers,
          },
          {
            title: "Revenue Churn",
            value: "1.82%",
            change: "-0.4%",
            isPositive: true, // Lower churn is positive
            icon: Percent,
          },
          {
            title: "Monthly Churn Rate",
            value: "2.3%",
            change: "-0.6%",
            isPositive: true, // Churn trending down is positive
            icon: TrendingDown,
          },
          {
            title: "LTV:CAC Ratio",
            value: "4.2x",
            change: "Healthy SaaS benchmark is 3x+",
            isPositive: true,
            icon: Layers,
            isCaption: true,
          }
        ].map((card, idx) => {
          const Icon = card.icon;
          const theme = getCardThemeByIndex(idx);
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden ${theme.bgClass} border ${theme.border} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-[150px]`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
              {/* Glow orb */}
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${theme.bgGlow} rounded-full blur-2xl pointer-events-none`} />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                </div>
              </div>

              <div className="relative z-10 flex items-end justify-between mt-4">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{card.value}</h3>
                  {card.isCaption ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-muted-foreground font-light">{card.change}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1">
                      {card.title === "Monthly Churn Rate" ? (
                        // Churn decreasing is the positive direction, so a DOWN arrow is styled green here.
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : card.isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className={`text-xs font-bold ${card.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {card.change}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-light">vs last month</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Main Revenue Chart (Area) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative lg:col-span-8 bg-card border ${getCardThemeByIndex(0).border} rounded-2xl p-6 flex flex-col justify-between overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(0).topAccent} rounded-t-2xl pointer-events-none z-10`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(0).bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -top-6 -right-6 w-36 h-36 ${getCardThemeByIndex(0).orb10} rounded-full blur-3xl pointer-events-none`} />
          
          <div className="relative z-10 w-full h-full flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Performance Over Time</h3>
              <p className="text-xs text-muted-foreground font-light mt-0.5">Comparing gross revenue, net collections, and processing expenses.</p>
            </div>

            <div className="flex items-center bg-white/[0.02] border border-white/[0.08] rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveMetricTab("gross")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeMetricTab === "gross" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                Gross
              </button>
              <button
                onClick={() => setActiveMetricTab("net")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeMetricTab === "net" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                }`}
              >
                Net
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueHistoryData}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
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
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              {activeMetricTab === "gross" ? (
                <>
                  <Area type="monotone" dataKey="gross" name="Gross Revenue" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGross)" />
                  <Area type="monotone" dataKey="expenses" name="Gateway Fees & Processing" stroke="#EF4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorExpenses)" />
                </>
              ) : (
                <Area type="monotone" dataKey="net" name="Net Profit" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNet)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Plan Share breakdown (Pie Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`relative lg:col-span-4 bg-card border ${getCardThemeByIndex(1).border} rounded-2xl p-6 flex flex-col justify-between overflow-hidden`}
        >
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(1).topAccent} rounded-t-2xl pointer-events-none z-10`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(1).bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -bottom-8 -right-8 w-36 h-36 ${getCardThemeByIndex(1).orb5} rounded-full blur-3xl pointer-events-none`} />
          
          <div className="relative z-10 w-full h-full flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Revenue Share</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Top-earning products & models this month.</p>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center my-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planRevenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {planRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Share</span>
              <span className="text-lg font-extrabold text-white">₹47.5k</span>
            </div>
          </div>

          <div className="space-y-3">
            {planRevenueData.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between border-b border-white/[0.02] pb-2 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-xs font-medium text-white">{plan.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">₹{plan.value.toLocaleString()}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {Math.round((plan.value / 47500) * 100)}% share
                  </span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction log / Recent Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`relative bg-card border ${getCardThemeByIndex(2).border} rounded-2xl p-6 overflow-hidden`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-2xl pointer-events-none z-10`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(2).bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${getCardThemeByIndex(2).orb5} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white font-sans">Recent Billing Transactions</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Audit log of client transactions managed by your gateway integrations.</p>
          </div>
          <button className="flex items-center gap-1 text-xs text-primary font-bold hover:underline">
            <span>View all invoices</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs font-semibold text-muted-foreground">
                <th className="pb-3 pl-4">Invoice ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoiceLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className="border-b border-white/[0.02] last:border-b-0 hover:bg-white/[0.01] transition-colors text-xs text-white font-medium"
                >
                  <td className="py-4 pl-4 font-mono text-muted-foreground">{log.id}</td>
                  <td className="py-4">{log.customer}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] text-muted-foreground rounded-lg">
                      {log.plan}
                    </span>
                  </td>
                  <td className="py-4 font-bold">{log.amount}</td>
                  <td className="py-4 text-muted-foreground">{log.date}</td>
                  <td className="py-4 pr-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      log.status === "paid" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : log.status === "failed" 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </motion.div>

      {/* Customer Cohort Retention */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`relative bg-card border ${getCardThemeByIndex(3).border} rounded-2xl p-6 overflow-hidden`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(3).topAccent} rounded-t-2xl pointer-events-none z-10`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(3).bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -top-6 -right-6 w-40 h-40 ${getCardThemeByIndex(3).orb10} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Customer Cohort Retention</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Retention percentage by months since signup, tracked across recent signup cohorts.</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cohortRetentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} domain={[60, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0B0F",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  fontSize: 12
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              {Object.keys(cohortColors).map((cohort) => (
                <Line
                  key={cohort}
                  type="monotone"
                  dataKey={cohort}
                  name={cohort}
                  stroke={cohortColors[cohort]}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}
