import { motion } from "motion/react";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const usageData = [
  { id: "apr6", date: "Apr 6", apiCalls: 12400, storage: 45 },
  { id: "apr7", date: "Apr 7", apiCalls: 15200, storage: 48 },
  { id: "apr8", date: "Apr 8", apiCalls: 13800, storage: 52 },
  { id: "apr9", date: "Apr 9", apiCalls: 18900, storage: 55 },
  { id: "apr10", date: "Apr 10", apiCalls: 16500, storage: 58 },
  { id: "apr11", date: "Apr 11", apiCalls: 21200, storage: 61 },
  { id: "apr12", date: "Apr 12", apiCalls: 19800, storage: 64 },
];

export function Usage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Usage</h1>
        <p className="text-muted-foreground">Track resource consumption</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-card border border-border rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-6">API Calls (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" />
            <Tooltip contentStyle={{ backgroundColor: "#16161D", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }} />
            <Line type="monotone" dataKey="apiCalls" stroke="#8B5CF6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
