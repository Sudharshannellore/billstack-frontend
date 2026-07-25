import { motion } from "motion/react";
import { StatCard } from "../../components/StatCard";
import { IndianRupee, Users, Repeat, TrendingUp, CreditCard, Activity } from "lucide-react";
import {
  LineChart,
  Line,
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
  { id: "pro", name: "Pro", value: 45, color: "#8B5CF6" },
  { id: "business", name: "Business", value: 30, color: "#06B6D4" },
  { id: "enterprise", name: "Enterprise", value: 15, color: "#10B981" },
  { id: "free", name: "Free", value: 10, color: "#A1A1AA" },
];

const recentSubscriptions = [
  { customer: "Alice Johnson", plan: "Pro", amount: "₹29/mo", status: "active" },
  { customer: "Bob Smith", plan: "Business", amount: "₹99/mo", status: "active" },
  { customer: "Carol White", plan: "Enterprise", amount: "₹299/mo", status: "trial" },
  { customer: "David Brown", plan: "Pro", amount: "₹29/mo", status: "active" },
];

export function TenantDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30"
        >
          Create Plan
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          title="API Calls"
          value="2.4M"
          change="+32%"
          changeType="positive"
          icon={Activity}
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 p-6 bg-card border border-border rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg">
                Week
              </button>
              <button className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-primary hover:text-white transition-colors">
                Month
              </button>
              <button className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-primary hover:text-white transition-colors">
                Year
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#A1A1AA" />
              <YAxis stroke="#A1A1AA" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#16161D",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-6">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {planDistribution.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: plan.color }}
                  />
                  <span className="text-sm text-muted-foreground">{plan.name}</span>
                </div>
                <span className="text-sm font-medium">{plan.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-card border border-border rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-6">Recent Subscriptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Plan
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentSubscriptions.map((sub, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">{sub.customer}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{sub.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        sub.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}