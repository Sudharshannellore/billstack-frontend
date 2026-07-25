import { motion } from "motion/react";
import { FileSearch } from "lucide-react";

const logs = [
  { action: "Tenant Approved", user: "admin@billstack.com", tenant: "Acme Corp", time: "2 hours ago" },
  { action: "Plan Template Created", user: "admin@billstack.com", tenant: "System", time: "5 hours ago" },
  { action: "Global Resource Updated", user: "admin@billstack.com", tenant: "System", time: "1 day ago" },
  { action: "Tenant Settings Modified", user: "admin@billstack.com", tenant: "System", time: "2 days ago" },
];

export function AuditLogs() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">Track all platform actions and changes</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Action</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">User</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tenant</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Time</th>
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
                <td className="py-4 px-6 font-medium">{log.action}</td>
                <td className="py-4 px-6 text-muted-foreground">{log.user}</td>
                <td className="py-4 px-6 text-muted-foreground">{log.tenant}</td>
                <td className="py-4 px-6 text-muted-foreground">{log.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}