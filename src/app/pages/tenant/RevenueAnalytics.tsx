import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { id: "oct", month: "Oct", revenue: 18500 },
  { id: "nov", month: "Nov", revenue: 22100 },
  { id: "dec", month: "Dec", revenue: 25600 },
  { id: "jan", month: "Jan", revenue: 28900 },
  { id: "feb", month: "Feb", revenue: 31200 },
  { id: "mar", month: "Mar", revenue: 34680 },
];

export function RevenueAnalytics() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Revenue Analytics</h1>
        <p className="text-muted-foreground">Track revenue performance over time</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-card border border-border rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-6">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" />
            <Tooltip contentStyle={{ backgroundColor: "#16161D", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
            <Bar dataKey="revenue" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
