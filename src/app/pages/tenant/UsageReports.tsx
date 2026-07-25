import { motion } from "motion/react";
import { Activity } from "lucide-react";

export function UsageReports() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Usage Reports</h1>
        <p className="text-muted-foreground">Analyze resource consumption patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-card border border-border rounded-xl">
          <div className="text-3xl font-bold mb-1">2.4M</div>
          <div className="text-sm text-muted-foreground">API Calls (This Month)</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-card border border-border rounded-xl">
          <div className="text-3xl font-bold mb-1">156 GB</div>
          <div className="text-sm text-muted-foreground">Storage Used</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-card border border-border rounded-xl">
          <div className="text-3xl font-bold mb-1">1,284</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
