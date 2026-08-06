import { motion, AnimatePresence } from "motion/react";
import { Plus, Users, Mail, MoreVertical, Edit, Trash2, IndianRupee, CheckCircle, Clock, Download, MessageSquare, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { StatCard } from "../../components/StatCard";
import { DataTable, type DataTableColumn } from "../../components/DataTable";
import { exportToCsv } from "../../components/exportToCsv";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import type { CustomerSegment } from "../../types/common";

export const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  high_value: "High Value",
  enterprise: "Enterprise",
  trial: "Trial",
  inactive: "Inactive",
  churn_risk: "Churn Risk",
};

export const initialCustomers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    plan: "Pro",
    mrr: "₹99",
    status: "active",
    joined: "Jan 15, 2026",
    ltv: "₹4,200",
    lastActive: "2 hours ago",
    healthScore: "healthy" as const,
    segments: ["high_value"] as CustomerSegment[],
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@company.com",
    plan: "Business",
    mrr: "₹299",
    status: "active",
    joined: "Feb 3, 2026",
    ltv: "₹11,800",
    lastActive: "1 day ago",
    healthScore: "healthy" as const,
    segments: ["enterprise", "high_value"] as CustomerSegment[],
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@startup.io",
    plan: "Enterprise",
    mrr: "₹999",
    status: "trial",
    joined: "Mar 20, 2026",
    ltv: "₹2,900",
    lastActive: "3 days ago",
    healthScore: "at-risk" as const,
    segments: ["trial", "churn_risk"] as CustomerSegment[],
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@tech.com",
    plan: "Pro",
    mrr: "₹99",
    status: "active",
    joined: "Jan 28, 2026",
    ltv: "₹1,050",
    lastActive: "3 weeks ago",
    healthScore: "churned" as const,
    segments: ["inactive", "churn_risk"] as CustomerSegment[],
  },
];

type Customer = (typeof initialCustomers)[number];

const healthScoreStyles: Record<string, { dot: string; label: string }> = {
  healthy: { dot: "bg-emerald-500", label: "Healthy" },
  "at-risk": { dot: "bg-amber-500", label: "At Risk" },
  churned: { dot: "bg-rose-500", label: "Churned" },
};

export function Customers() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [customersList] = useState(initialCustomers);
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | "all">("all");

  const filteredCustomers = useMemo(() => {
    if (segmentFilter === "all") return customersList;
    return customersList.filter((c) => c.segments.includes(segmentFilter));
  }, [customersList, segmentFilter]);

  const columns: DataTableColumn<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      sortValue: (row) => row.name,
      render: (customer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full flex items-center justify-center shrink-0">
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
            <div className="flex items-center gap-1 mt-1">
              {customer.segments.map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide bg-white/5 text-muted-foreground border border-white/[0.06]">
                  {SEGMENT_LABELS[s]}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      sortValue: (row) => row.plan,
      render: (customer) => (
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20">{customer.plan}</span>
      ),
    },
    {
      key: "mrr",
      header: "MRR",
      align: "right",
      sortValue: (row) => Number(row.mrr.replace(/[^0-9.]/g, "")),
      render: (customer) => <span className="font-medium">{customer.mrr}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      render: (customer) => (
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
      ),
    },
    {
      key: "joined",
      header: "Joined",
      sortValue: (row) => row.joined,
      render: (customer) => <span className="text-muted-foreground">{customer.joined}</span>,
    },
    {
      key: "ltv",
      header: "LTV",
      align: "right",
      sortValue: (row) => Number(row.ltv.replace(/[^0-9.]/g, "")),
      render: (customer) => <span className="font-medium">{customer.ltv}</span>,
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (customer) => <span className="text-muted-foreground">{customer.lastActive}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      className: "w-32",
      render: (customer) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
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
            onClick={() => navigate(`/tenant/customers/${customer.id}`)}
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
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(null)} />
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
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage your customer base</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              exportToCsv(
                customersList,
                ["Name", "Email", "Plan", "MRR", "Status", "Joined", "LTV", "Last Active", "Health"],
                (c) => [c.name, c.email, c.plan, c.mrr, c.status, c.joined, c.ltv, c.lastActive, c.healthScore],
                "customers-export.csv",
              );
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
        <StatCard title="Total Customers" value="1,284" icon={Users} colorIndex={0} delay={0} />
        <StatCard title="Active Customers" value="892" icon={CheckCircle} colorIndex={1} delay={0.06} />
        <StatCard title="Trial Customers" value="48" icon={Clock} colorIndex={2} delay={0.12} />
        <StatCard title="Total MRR" value="₹34.6K" icon={IndianRupee} colorIndex={3} delay={0.18} />
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        getRowId={(row) => row.id}
        searchable
        searchPlaceholder="Search name or email…"
        searchKeys={(row) => `${row.name} ${row.email}`}
        themeIndex={5}
        pageSize={10}
        toolbar={
          <Select value={segmentFilter} onValueChange={(v) => setSegmentFilter(v as CustomerSegment | "all")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              {(Object.entries(SEGMENT_LABELS) as [CustomerSegment, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        emptyState={{
          icon: Users,
          title: "No customers found",
          description: "Try adjusting your search or filters, or add your first customer.",
          action: { label: "Add Customer", onClick: () => navigate("/tenant/customers/create") },
        }}
      />
    </motion.div>
  );
}
