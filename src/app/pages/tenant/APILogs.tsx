import { motion } from "motion/react";
import { Activity } from "lucide-react";

const logs = [
  { method: "POST", endpoint: "/api/subscriptions", status: 200, time: "12:45:23", duration: "124ms" },
  { method: "GET", endpoint: "/api/customers", status: 200, time: "12:44:18", duration: "89ms" },
  { method: "PUT", endpoint: "/api/plans/123", status: 200, time: "12:43:05", duration: "156ms" },
  { method: "DELETE", endpoint: "/api/webhooks/456", status: 204, time: "12:41:32", duration: "67ms" },
];

export function APILogs() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Logs</h1>
        <p className="text-muted-foreground">Monitor API requests and responses</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <table className="w-full font-mono text-sm">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Method</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Endpoint</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Time</th>
              <th className="text-left py-4 px-6 font-medium text-muted-foreground">Duration</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-6">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{log.method}</span>
                </td>
                <td className="py-3 px-6 text-muted-foreground">{log.endpoint}</td>
                <td className="py-3 px-6">
                  <span className="px-2 py-1 bg-success/10 text-success text-xs rounded">{log.status}</span>
                </td>
                <td className="py-3 px-6 text-muted-foreground">{log.time}</td>
                <td className="py-3 px-6 text-muted-foreground">{log.duration}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
