import { motion } from "motion/react";
import { FileText, Download } from "lucide-react";

const invoices = [
  { id: "INV-1024", customer: "Alice Johnson", amount: "₹99", date: "Apr 1, 2026", status: "paid" },
  { id: "INV-1023", customer: "Bob Smith", amount: "₹299", date: "Apr 1, 2026", status: "paid" },
  { id: "INV-1022", customer: "David Brown", amount: "₹99", date: "Mar 28, 2026", status: "pending" },
];

export function Invoices() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Invoices</h1>
        <p className="text-muted-foreground">View and manage customer invoices</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card border border-indigo-500/20 rounded-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-t-2xl pointer-events-none z-10" />
        {/* Gradient tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/8 via-transparent to-blue-600/5 pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.01] border-b border-white/[0.04]">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Invoice</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <motion.tr
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="py-4 px-6 font-medium">{invoice.id}</td>
                <td className="py-4 px-6">{invoice.customer}</td>
                <td className="py-4 px-6 font-medium">{invoice.amount}</td>
                <td className="py-4 px-6 text-muted-foreground">{invoice.date}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded ${invoice.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-muted rounded-lg">
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
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
