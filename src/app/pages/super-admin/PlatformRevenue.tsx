import { motion } from "motion/react";
import { DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { id: "oct", month: "Oct", platform: 42000, commission: 4200 },
  { id: "nov", month: "Nov", platform: 51000, commission: 5100 },
  { id: "dec", month: "Dec", platform: 58000, commission: 5800 },
  { id: "jan", month: "Jan", platform: 67000, commission: 6700 },
  { id: "feb", month: "Feb", platform: 74000, commission: 7400 },
  { id: "mar", month: "Mar", platform: 85000, commission: 8500 },
];

export function PlatformRevenue() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Revenue</h1>
        <p className="text-muted-foreground">Track platform earnings and commissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-card border border-border rounded-xl">
          <div className="text-3xl font-bold mb-1">$285K</div>
          <div className="text-sm text-muted-foreground">Total Platform Revenue</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-card border border-border rounded-xl">
          <div className="text-3xl font-bold mb-1">$28.5K</div>
          <div className="text-sm text-muted-foreground">Commission Earned</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-card border border-border rounded-xl">
          <div className="text-3xl font-bold mb-1">10%</div>
          <div className="text-sm text-muted-foreground">Avg Commission Rate</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-card border border-border rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="platformGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" />
            <Tooltip contentStyle={{ backgroundColor: "#16161D", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
            <Area type="monotone" dataKey="platform" stroke="#8B5CF6" strokeWidth={2} fill="url(#platformGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
