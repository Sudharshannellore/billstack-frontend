import { motion } from "motion/react";
import { StatCard } from "../../components/StatCard";
import { 
  IndianRupee, 
  Users, 
  Repeat, 
  TrendingUp, 
  CreditCard, 
  Activity, 
  ArrowUpRight, 
  ArrowRight,
  Sparkles,
  Zap,
  Calendar
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { id: "mon", date: "Mon", revenue: 4200 },
  { id: "tue", date: "Tue", revenue: 3800 },
  { id: "wed", date: "Wed", revenue: 5100 },
  { id: "thu", date: "Thu", revenue: 4600 },
  { id: "fri", date: "Fri", revenue: 6200 },
  { id: "sat", date: "Sat", revenue: 5800 },
  { id: "sun", date: "Sun", revenue: 4900 },
];

const planDistribution = [
  { id: "pro", name: "Pro Plan", value: 45, color: "#8B5CF6" },
  { id: "business", name: "Business Plan", value: 30, color: "#06B6D4" },
  { id: "enterprise", name: "Enterprise Custom", value: 15, color: "#10B981" },
  { id: "free", name: "Free Tier", value: 10, color: "#71717A" },
];

const recentSubscriptions = [
  { customer: "Alice Johnson", plan: "Pro Plan", amount: "₹2,999/mo", status: "active", email: "alice@example.com" },
  { customer: "Bob Smith", plan: "Business Plan", amount: "₹9,999/mo", status: "active", email: "bob@company.com" },
  { customer: "Carol White", plan: "Enterprise Custom", amount: "₹29,999/mo", status: "trial", email: "carol@startup.io" },
  { customer: "David Brown", plan: "Pro Plan", amount: "₹2,999/mo", status: "active", email: "david@tech.com" },
];

export function TenantDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      {/* Upper Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Business Dashboard</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Live Feed
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Here's your aggregated SaaS performance and billing lifecycle operations.</p>
        </div>

        <Link to="/tenant/plans/create">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary-dark hover:to-violet-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Create New Plan</span>
          </motion.button>
        </Link>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Monthly Revenue"
          value="₹34,680"
          change="+18%"
          changeType="positive"
          icon={IndianRupee}
          delay={0}
        />
        <StatCard
          title="Active Customers"
          value="1,284"
          change="+12%"
          changeType="positive"
          icon={Users}
          delay={0.1}
        />
        <StatCard
          title="Active Subscriptions"
          value="892"
          change="+8%"
          changeType="positive"
          icon={Repeat}
          delay={0.2}
        />
        <StatCard
          title="MRR Growth"
          value="23%"
          change="+5%"
          changeType="positive"
          icon={TrendingUp}
          delay={0.3}
        />
        <StatCard
          title="Conversion Rate"
          value="3.8%"
          change="+1.2%"
          changeType="positive"
          icon={CreditCard}
          delay={0.4}
        />
        <StatCard
          title="API Events Ingested"
          value="2.4M"
          change="+32%"
          changeType="positive"
          icon={Activity}
          delay={0.5}
        />
      </div>

      {/* Charts Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative lg:col-span-8 p-6 bg-card border border-violet-500/20 rounded-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 to-purple-500 rounded-t-2xl pointer-events-none" />
          {/* Gradient tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent pointer-events-none" />
          {/* Glow orb */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Operations Overview</h3>
              <p className="text-xs text-muted-foreground font-light mt-0.5">Aggregated billing collections over the past week.</p>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
              <button className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg shadow-md">
                Week
              </button>
              <button className="px-3 py-1.5 text-muted-foreground hover:text-white text-xs font-semibold rounded-lg">
                Month
              </button>
              <button className="px-3 py-1.5 text-muted-foreground hover:text-white text-xs font-semibold rounded-lg">
                Year
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
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
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </div>
        </motion.div>

        {/* Plan Share (Pie Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative lg:col-span-4 p-6 bg-card border border-cyan-500/20 rounded-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-sky-500 rounded-t-2xl pointer-events-none" />
          {/* Gradient tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-transparent pointer-events-none" />
          {/* Glow orb */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
          <div>
            <h3 className="text-lg font-bold text-white">Active Plan Share</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Allocation by subscriber contracts.</p>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center relative my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {planDistribution.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active Profiles</span>
              <span className="text-lg font-extrabold text-white">892</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between text-xs border-b border-white/[0.02] pb-1.5 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: plan.color }}
                  />
                  <span className="text-muted-foreground font-medium">{plan.name}</span>
                </div>
                <span className="font-bold text-white">{plan.value}%</span>
              </div>
            ))}
          </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative p-6 bg-card border border-emerald-500/20 rounded-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl pointer-events-none" />
        {/* Gradient tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/8 via-transparent to-transparent pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Active Subscriptions</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">Real-time listing of incoming customer plan provisions.</p>
          </div>
          <Link to="/tenant/subscriptions" className="flex items-center gap-1 text-xs text-primary font-bold hover:underline">
            <span>Manage all subscriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs font-semibold text-muted-foreground">
                <th className="pb-3 pl-4">Customer</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Subscribed Plan</th>
                <th className="pb-3">Billing Value</th>
                <th className="pb-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSubscriptions.map((sub, index) => (
                <tr
                  key={index}
                  className="border-b border-white/[0.02] last:border-b-0 hover:bg-white/[0.01] transition-colors text-xs text-white font-medium animate-fadeIn"
                >
                  <td className="py-4 pl-4 flex items-center gap-3 font-semibold">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center font-bold text-[11px]">
                      {sub.customer.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span>{sub.customer}</span>
                  </td>
                  <td className="py-4 text-muted-foreground">{sub.email}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-4 font-bold">{sub.amount}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider border ${
                        sub.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}