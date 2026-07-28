import { motion, AnimatePresence } from "motion/react";
import { Plus, Users, Mail, MoreVertical, Edit, Trash2, Clock, IndianRupee, CheckCircle, Download, MessageSquare, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";

const initialCustomers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    plan: "Pro",
    mrr: "$99",
    status: "active",
    joined: "Jan 15, 2026",
    ltv: "₹4,200",
    lastActive: "2 hours ago",
    healthScore: "healthy" as const,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@company.com",
    plan: "Business",
    mrr: "$299",
    status: "active",
    joined: "Feb 3, 2026",
    ltv: "₹11,800",
    lastActive: "1 day ago",
    healthScore: "healthy" as const,
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@startup.io",
    plan: "Enterprise",
    mrr: "$999",
    status: "trial",
    joined: "Mar 20, 2026",
    ltv: "₹2,900",
    lastActive: "3 days ago",
    healthScore: "at-risk" as const,
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@tech.com",
    plan: "Pro",
    mrr: "$99",
    status: "active",
    joined: "Jan 28, 2026",
    ltv: "₹1,050",
    lastActive: "3 weeks ago",
    healthScore: "churned" as const,
  },
];

const healthScoreStyles: Record<string, { dot: string; label: string }> = {
  healthy: { dot: "bg-emerald-500", label: "Healthy" },
  "at-risk": { dot: "bg-amber-500", label: "At Risk" },
  churned: { dot: "bg-rose-500", label: "Churned" },
};

function exportCustomersToCsv(customers: typeof initialCustomers) {
  const headers = ["Name", "Email", "Plan", "MRR", "Status", "Joined", "LTV", "Last Active", "Health"];
  const rows = customers.map(c => [c.name, c.email, c.plan, c.mrr, c.status, c.joined, c.ltv, c.lastActive, c.healthScore]);
  const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows]
    .map(row => row.map(escapeCell).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "customers-export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function Customers() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [customersList] = useState(initialCustomers);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customers</h1>
          <p className="text-muted-foreground">Manage your customer base</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              exportCustomersToCsv(customersList);
              toast.success("Customers exported", { description: `${customersList.length} customers exported to CSV.` });
            }}
            className="px-5 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tenant/customers/create")}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Customer</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "1,284", icon: Users },
          { label: "Active Customers", value: "892", icon: CheckCircle },
          { label: "Trial Customers", value: "48", icon: Clock },
          { label: "Total MRR", value: "₹34.6K", icon: IndianRupee },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const theme = getCardThemeByIndex(i);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden p-4 bg-card border ${theme.border} rounded-2xl flex items-center gap-3`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
              {/* Glow orb */}
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${theme.orb10} rounded-full blur-2xl pointer-events-none`} />
              <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${theme.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${theme.iconColor}`} />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`relative bg-card border ${getCardThemeByIndex(5).border} rounded-2xl overflow-hidden animate-fadeIn`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(5).topAccent} rounded-t-2xl pointer-events-none z-10`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(5).bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${getCardThemeByIndex(5).orb5} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.01] border-b border-white/[0.04]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Plan
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  MRR
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Joined
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  LTV
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Last Active
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customersList.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {customer.name}
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${healthScoreStyles[customer.healthScore].dot}`}
                            title={healthScoreStyles[customer.healthScore].label}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {customer.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium">{customer.mrr}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${customer.status === "active"
                        ? "bg-success/10 text-success"
                        : customer.status === "trial"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{customer.joined}</td>
                  <td className="py-4 px-6 font-medium">{customer.ltv}</td>
                  <td className="py-4 px-6 text-muted-foreground">{customer.lastActive}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toast("Opening message composer...", { description: `Compose a message to ${customer.name}.` })}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Message customer"
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toast(`Viewing ${customer.name}'s details...`)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                      <div className="relative inline-block">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowMenu(showMenu === customer.id ? null : customer.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                      <AnimatePresence>
                        {showMenu === customer.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
                          >
                            <button className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive">
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      </div>
                    </div>
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
