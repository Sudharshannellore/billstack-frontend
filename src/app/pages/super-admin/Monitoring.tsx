import { motion } from "motion/react";
import { Activity } from "lucide-react";

const metrics = [
  { name: "API Response Time", value: "124ms", status: "healthy" },
  { name: "Database Connections", value: "45/100", status: "healthy" },
  { name: "Error Rate", value: "0.02%", status: "healthy" },
  { name: "Uptime", value: "99.98%", status: "healthy" },
];

export function Monitoring() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Monitoring</h1>
        <p className="text-muted-foreground">Platform health and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-card border border-border rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{metric.name}</span>
              <span className="w-2 h-2 bg-success rounded-full"></span>
            </div>
            <div className="text-3xl font-bold">{metric.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
