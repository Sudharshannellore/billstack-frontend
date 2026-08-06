import { motion, AnimatePresence } from "motion/react";
import { Plus, Repeat, MoreVertical, PlusCircle, RefreshCw, XCircle, Download, Pause, PlayCircle, ArrowUpCircle, ArrowDownCircle, CalendarClock, History, Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { StatusBadge } from "../../components/StatusBadge";
import { DataTable, type DataTableColumn } from "../../components/DataTable";
import { exportToCsv } from "../../components/exportToCsv";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../../components/ui/dialog";
import type { SubscriptionStatus } from "../../types/common";

type RenewalRisk = "low" | "medium" | "high";

const initialSubscriptions = [
  { id: 1, customer: "Alice Johnson", productId: "prod_1", planId: "plan_1_2", plan: "Pro", status: "active" as SubscriptionStatus, nextBilling: "Apr 15, 2026", mrr: "₹99", renewalRisk: "low" as RenewalRisk, daysUntilBilling: 2 },
  { id: 2, customer: "Bob Smith", productId: "prod_3", planId: "plan_3_2", plan: "Ultra Pack", status: "past_due" as SubscriptionStatus, nextBilling: "Apr 18, 2026", mrr: "₹50", renewalRisk: "medium" as RenewalRisk, daysUntilBilling: 5 },
  { id: 3, customer: "Carol White", productId: "prod_1", planId: "plan_1_3", plan: "Enterprise", status: "trial" as SubscriptionStatus, nextBilling: "Apr 20, 2026", mrr: "₹499", renewalRisk: "high" as RenewalRisk, daysUntilBilling: 1 },
  { id: 4, customer: "David Brown", productId: "prod_1", planId: "plan_1_1", plan: "Starter", status: "grace_period" as SubscriptionStatus, nextBilling: "Apr 12, 2026", mrr: "₹29", renewalRisk: "high" as RenewalRisk, daysUntilBilling: 0 },
  { id: 5, customer: "Emma Davis", productId: "prod_2", planId: "plan_2_1", plan: "Pay as you go", status: "suspended" as SubscriptionStatus, nextBilling: "—", mrr: "₹0", renewalRisk: "high" as RenewalRisk, daysUntilBilling: 0 },
];

type Subscription = (typeof initialSubscriptions)[number];

const riskStyles: Record<RenewalRisk, string> = {
  low: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  high: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
};

const STATUS_FILTER_OPTIONS: { value: SubscriptionStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "past_due", label: "Past Due" },
  { value: "grace_period", label: "Grace Period" },
  { value: "paused", label: "Paused" },
  { value: "suspended", label: "Suspended" },
  { value: "cancelled", label: "Cancelled" },
];

export function Subscriptions() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [subscriptionsList, setSubscriptionsList] = useState(initialSubscriptions);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">("all");
  const [prorationSubId, setProrationSubId] = useState<number | null>(null);
  const [forecastSubId, setForecastSubId] = useState<number | null>(null);
  const [timelineSubId, setTimelineSubId] = useState<number | null>(null);

  const setStatus = (id: number, status: SubscriptionStatus, message: string) => {
    setSubscriptionsList((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    toast.success(message);
  };

  const filteredSubscriptions = useMemo(() => {
    if (statusFilter === "all") return subscriptionsList;
    return subscriptionsList.filter((s) => s.status === statusFilter);
  }, [subscriptionsList, statusFilter]);

  const prorationSub = subscriptionsList.find((s) => s.id === prorationSubId) ?? null;
  const forecastSub = subscriptionsList.find((s) => s.id === forecastSubId) ?? null;
  const timelineSub = subscriptionsList.find((s) => s.id === timelineSubId) ?? null;

  const columns: DataTableColumn<Subscription>[] = [
    {
      key: "customer",
      header: "Customer",
      sortValue: (row) => row.customer,
      render: (sub) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full flex items-center justify-center shrink-0">
            <Repeat className="w-5 h-5 text-primary" />
          </div>
          <span className="font-medium">{sub.customer}</span>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      sortValue: (row) => row.plan,
      render: (sub) => <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20">{sub.plan}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      render: (sub) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={sub.status} />
          <span className={`px-2 py-1 text-xs rounded capitalize ${riskStyles[sub.renewalRisk]}`}>{sub.renewalRisk} risk</span>
        </div>
      ),
    },
    {
      key: "nextBilling",
      header: "Next Billing",
      sortValue: (row) => row.nextBilling,
      render: (sub) => (
        <div className={sub.daysUntilBilling <= 3 ? "text-amber-500 font-medium" : "text-muted-foreground"}>
          {sub.nextBilling}
          {sub.daysUntilBilling <= 3 && <span className="block text-xs text-amber-500/80">Due in {sub.daysUntilBilling}d</span>}
        </div>
      ),
    },
    {
      key: "mrr",
      header: "MRR",
      align: "right",
      sortValue: (row) => Number(row.mrr.replace(/[^0-9.]/g, "")),
      render: (sub) => <span className="font-bold text-primary">{sub.mrr}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      className: "w-40",
      render: (sub) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/tenant/subscriptions/${sub.id}/add-topup`)}
            title="Add Topup"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-primary" />
          </motion.button>
          {sub.status === "paused" ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStatus(sub.id, "active", `${sub.customer}'s subscription is active again.`)}
              title="Resume"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <PlayCircle className="w-4 h-4 text-emerald-500" />
            </motion.button>
          ) : sub.status === "active" ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStatus(sub.id, "paused", `${sub.customer}'s subscription has been paused.`)}
              title="Pause"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4 text-amber-500" />
            </motion.button>
          ) : null}
          <div className="relative inline-block">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(showMenu === sub.id ? null : sub.id)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <AnimatePresence>
              {showMenu === sub.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(null)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
                  >
                    <button
                      onClick={() => {
                        setShowMenu(null);
                        setProrationSubId(sub.id);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <Calculator className="w-4 h-4 text-cyan-500" />
                      <span>Proration Preview</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(null);
                        setForecastSubId(sub.id);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <CalendarClock className="w-4 h-4 text-violet-400" />
                      <span>Renewal Forecast</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(null);
                        setTimelineSubId(sub.id);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <History className="w-4 h-4 text-muted-foreground" />
                      <span>View Timeline</span>
                    </button>
                    <div className="h-[1px] w-full bg-border my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(null);
                        setStatus(sub.id, "active", `${sub.customer} upgraded to a higher tier.`);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                      <span>Upgrade</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(null);
                        setStatus(sub.id, "active", `${sub.customer} downgraded to a lower tier.`);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <ArrowDownCircle className="w-4 h-4 text-amber-500" />
                      <span>Downgrade</span>
                    </button>
                    {sub.status === "trial" && (
                      <button
                        onClick={() => {
                          setShowMenu(null);
                          toast.success(`Trial extended for ${sub.customer}.`);
                        }}
                        className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                      >
                        <RefreshCw className="w-4 h-4 text-blue-500" />
                        <span>Extend Trial</span>
                      </button>
                    )}
                    {(sub.status === "cancelled" || sub.status === "expired" || sub.status === "suspended") && (
                      <button
                        onClick={() => {
                          setShowMenu(null);
                          setStatus(sub.id, "active", `${sub.customer}'s subscription reactivated.`);
                        }}
                        className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                      >
                        <PlayCircle className="w-4 h-4 text-emerald-500" />
                        <span>Reactivate</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowMenu(null);
                        toast.success(`${sub.customer}'s subscription renewed early.`);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      <span>Renew Now</span>
                    </button>
                    <div className="h-[1px] w-full bg-border my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(null);
                        setStatus(sub.id, "cancelled", `${sub.customer}'s subscription is now cancelled.`);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium text-destructive"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Sub</span>
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Subscriptions</h1>
          <p className="text-muted-foreground text-sm">Manage customer subscriptions and billing</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              exportToCsv(
                subscriptionsList,
                ["Customer", "Plan", "Status", "Next Billing", "MRR"],
                (s) => [s.customer, s.plan, s.status, s.nextBilling, s.mrr],
                "subscriptions-export.csv",
              );
              toast.success("Subscriptions exported", { description: `${subscriptionsList.length} subscriptions exported to CSV.` });
            }}
            className="px-5 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tenant/subscriptions/create")}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Subscription</span>
          </motion.button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredSubscriptions}
        getRowId={(row) => row.id}
        searchable
        searchPlaceholder="Search customer or plan…"
        searchKeys={(row) => `${row.customer} ${row.plan}`}
        themeIndex={0}
        pageSize={10}
        toolbar={
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubscriptionStatus | "all")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        emptyState={{
          icon: Repeat,
          title: "No subscriptions found",
          description: "Try adjusting your search or filters, or create a new subscription.",
          action: { label: "Create Subscription", onClick: () => navigate("/tenant/subscriptions/create") },
        }}
      />

      {/* Proration Preview Dialog */}
      <Dialog open={prorationSubId !== null} onOpenChange={(open) => !open && setProrationSubId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-500" />
              <span>Proration Preview</span>
            </DialogTitle>
            <DialogDescription>Estimated charge/credit if a plan change is made today for {prorationSub?.customer}.</DialogDescription>
          </DialogHeader>
          {prorationSub && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border text-sm">
                <span className="text-muted-foreground">Days remaining in cycle</span>
                <span className="font-medium">{prorationSub.daysUntilBilling === 0 ? 30 : prorationSub.daysUntilBilling * 6}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border text-sm">
                <span className="text-muted-foreground">Unused credit on current plan</span>
                <span className="font-medium text-emerald-400">- {prorationSub.mrr}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <span className="text-sm text-muted-foreground">Net amount due today</span>
                <span className="text-xl font-black text-primary">₹0.00</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Renewal Forecast Dialog */}
      <Dialog open={forecastSubId !== null} onOpenChange={(open) => !open && setForecastSubId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-violet-400" />
              <span>Renewal Forecast</span>
            </DialogTitle>
            <DialogDescription>Projected renewals for {forecastSub?.customer}'s subscription over the next 3 cycles.</DialogDescription>
          </DialogHeader>
          {forecastSub && (
            <div className="space-y-2">
              {[1, 2, 3].map((cycle) => (
                <div key={cycle} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border text-sm">
                  <span className="text-muted-foreground">Cycle +{cycle}</span>
                  <span className={`px-2 py-1 text-xs rounded ${forecastSub.renewalRisk === "high" && cycle > 1 ? "bg-rose-500/10 text-rose-500" : "bg-success/10 text-success"}`}>
                    {forecastSub.renewalRisk === "high" && cycle > 1 ? "At risk" : "Likely to renew"}
                  </span>
                  <span className="font-medium">{forecastSub.mrr}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Subscription Timeline Dialog */}
      <Dialog open={timelineSubId !== null} onOpenChange={(open) => !open && setTimelineSubId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <span>Subscription Timeline</span>
            </DialogTitle>
            <DialogDescription>Lifecycle history for {timelineSub?.customer}.</DialogDescription>
          </DialogHeader>
          {timelineSub && (
            <div className="space-y-4">
              {[
                { label: `Subscription created on ${timelineSub.plan}`, time: "3 months ago" },
                { label: "Trial converted to paid", time: "2 months ago" },
                { label: `Status changed to ${timelineSub.status}`, time: "2 days ago" },
              ].map((event, i, arr) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-medium">{event.label}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
