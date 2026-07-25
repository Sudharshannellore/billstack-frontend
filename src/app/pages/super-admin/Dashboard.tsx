import { motion } from "motion/react";
import { StatCard } from "../../components/StatCard";
import { Building2, DollarSign, TrendingUp, Users } from "lucide-react";
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
  { action: "New tenant registered", tenant: "Acme Corp", time: "2 minutes ago" },
  { action: "Plan template created", tenant: "System", time: "15 minutes ago" },
  { action: "Tenant approved", tenant: "TechFlow", time: "1 hour ago" },
  { action: "Revenue threshold reached", tenant: "CloudSync", time: "2 hours ago" },
  { action: "New API key generated", tenant: "DataHub", time: "3 hours ago" },
];

export function SuperAdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
        <p className="text-muted-foreground">Monitor your multi-tenant billing platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tenants"
          value="48"
          change="+12%"
          changeType="positive"
          icon={Building2}
          delay={0}
        />
        <StatCard
          title="Platform Revenue"
          value="$285K"
          change="+23%"
          changeType="positive"
          icon={DollarSign}
          delay={0.1}
        />
        <StatCard
          title="Total Users"
          value="1,248"
          change="+8%"
          changeType="positive"
          icon={Users}
          delay={0.2}
        />
        <StatCard
          title="Growth Rate"
          value="34%"
          change="+5%"
          changeType="positive"
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#A1A1AA" />
              <YAxis stroke="#A1A1AA" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#16161D",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-6">Top Tenants by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenantData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#A1A1AA" />
              <YAxis type="category" dataKey="name" stroke="#A1A1AA" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#16161D",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-card border border-border rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-input-background rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.tenant}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{activity.time}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
