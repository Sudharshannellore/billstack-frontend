import { motion, AnimatePresence } from "motion/react";
import {
  Building2, Check, X, Plus, MoreVertical,
  Users, CheckCircle2, Clock, LogIn, ShieldAlert
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { formatCompactNumber } from "../../components/currency";
import { StatCard } from "../../components/StatCard";
import { DataTable, type DataTableColumn } from "../../components/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";

type TenantHealth = "healthy" | "at_risk" | "critical";

const HEALTH_STYLES: Record<TenantHealth, { dot: string; label: string }> = {
  healthy: { dot: "bg-emerald-500", label: "Healthy" },
  at_risk: { dot: "bg-amber-500", label: "At Risk" },
  critical: { dot: "bg-rose-500", label: "Critical" },
};

const allTenants = [
  { id: 1, name: "Acme Corp", email: "admin@acme.com", status: "active", revenue: "₹28.5K", users: 245, joined: "Jan 15, 2026", plan: "Enterprise", growth: "+12%", health: "healthy" as TenantHealth, quotaUsed: 62 },
  { id: 2, name: "TechFlow", email: "team@techflow.io", status: "active", revenue: "₹24.2K", users: 189, joined: "Feb 3, 2026", plan: "SaaS Starter", growth: "+8%", health: "healthy" as TenantHealth, quotaUsed: 41 },
  { id: 3, name: "DataHub", email: "hello@datahub.co", status: "active", revenue: "₹18.9K", users: 156, joined: "Mar 8, 2026", plan: "API Usage", growth: "+21%", health: "at_risk" as TenantHealth, quotaUsed: 88 },
  { id: 4, name: "CloudSync", email: "info@cloudsync.com", status: "pending", revenue: "₹0", users: 0, joined: "Apr 10, 2026", plan: "—", growth: "", health: "healthy" as TenantHealth, quotaUsed: 0 },
  { id: 5, name: "DevTools Inc", email: "team@devtools.io", status: "pending", revenue: "₹0", users: 0, joined: "Apr 12, 2026", plan: "—", growth: "", health: "healthy" as TenantHealth, quotaUsed: 0 },
  { id: 6, name: "API Master", email: "contact@apimaster.com", status: "pending", revenue: "₹0", users: 0, joined: "Apr 13, 2026", plan: "—", growth: "", health: "healthy" as TenantHealth, quotaUsed: 0 },
];

type Tenant = (typeof allTenants)[number];

export function TenantManagement() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState(allTenants);
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");
  const [approving, setApproving] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [impersonateTarget, setImpersonateTarget] = useState<{ id: number; name: string } | null>(null);
  // Mock-only state: represents "currently impersonating" for demo purposes.
  // In a real implementation, confirming impersonation would instead:
  //   1) set a session-scoped auth context (e.g. an impersonation token/claim),
  //   2) redirect into `/tenant/*` routes scoped to that tenant's identity,
  //   3) write an audit-log entry (actor, target tenant, timestamp, reason).
  // Here we just track a name locally and render a banner + toast to show the intended UX.
  const [impersonatingTenant, setImpersonatingTenant] = useState<string | null>(null);

  const activeTenants = tenants.filter(t => t.status === "active");
  const pendingTenants = tenants.filter(t => t.status === "pending");
  const displayedTenants = activeTab === "active" ? activeTenants : pendingTenants;

  const handleApprove = (id: number) => {
    setApproving(id);
    setTimeout(() => {
      setTenants(prev =>
        prev.map(t =>
          t.id === id ? { ...t, status: "active", plan: "SaaS Starter", growth: "+0%" } : t
        )
      );
      setApproving(null);
      toast.success("Tenant approved successfully!");
    }, 1000);
  };

  const handleConfirmImpersonate = () => {
    if (!impersonateTarget) return;
    setImpersonatingTenant(impersonateTarget.name);
    toast.success(`Now viewing as ${impersonateTarget.name} — remember to exit impersonation when done`);
    setImpersonateTarget(null);
  };

  const handleExitImpersonation = () => {
    setImpersonatingTenant(null);
    toast.success("Returned to normal admin view");
  };

  const columns = useMemo<DataTableColumn<Tenant>[]>(() => {
    const tenantColumn: DataTableColumn<Tenant> = {
      key: "name",
      header: "Tenant",
      sortValue: (row) => row.name,
      render: (tenant) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 bg-gradient-to-br ${getCardThemeByIndex(tenant.id).topAccent} rounded-xl flex items-center justify-center shrink-0`}>
            <span className="text-white text-xs font-black">{tenant.name[0]}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{tenant.name}</div>
            <div className="text-[11px] text-muted-foreground font-mono">{tenant.email}</div>
          </div>
        </div>
      ),
    };

    const activeOnlyColumns: DataTableColumn<Tenant>[] =
      activeTab === "active"
        ? [
            {
              key: "plan",
              header: "Plan",
              sortValue: (row) => row.plan,
              render: (tenant) => (
                <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">{tenant.plan}</span>
              ),
            },
            {
              key: "revenue",
              header: "Revenue",
              sortValue: (row) => Number(row.revenue.replace(/[^0-9.]/g, "")),
              render: (tenant) => <span className="text-sm font-bold text-white">{tenant.revenue}</span>,
            },
            {
              key: "users",
              header: "Users",
              align: "right",
              sortValue: (row) => row.users,
              render: (tenant) => <span className="text-sm text-muted-foreground">{formatCompactNumber(tenant.users)}</span>,
            },
            {
              key: "growth",
              header: "Growth",
              render: (tenant) => (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{tenant.growth}</span>
              ),
            },
            {
              key: "health",
              header: "Health",
              sortValue: (row) => row.health,
              render: (tenant) => (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${HEALTH_STYLES[tenant.health].dot}`} />
                  {HEALTH_STYLES[tenant.health].label}
                </span>
              ),
            },
            {
              key: "quotaUsed",
              header: "Quota",
              className: "w-28",
              sortValue: (row) => row.quotaUsed,
              render: (tenant) => (
                <div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tenant.quotaUsed > 80 ? "bg-rose-500" : tenant.quotaUsed > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${tenant.quotaUsed}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{tenant.quotaUsed}% used</span>
                </div>
              ),
            },
          ]
        : [];

    const joinedColumn: DataTableColumn<Tenant> = {
      key: "joined",
      header: "Joined",
      sortValue: (row) => row.joined,
      render: (tenant) => <span className="text-xs text-muted-foreground">{tenant.joined}</span>,
    };

    const actionsColumn: DataTableColumn<Tenant> = {
      key: "actions",
      header: "",
      align: "right",
      className: "w-40",
      render: (tenant) =>
        activeTab === "pending" ? (
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <motion.button
              onClick={() => handleApprove(tenant.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                approving === tenant.id
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
              }`}
            >
              {approving === tenant.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              {approving === tenant.id ? "Approved!" : "Approve"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </motion.button>
          </div>
        ) : (
          <div className="relative flex justify-end" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenMenuId(openMenuId === tenant.id ? null : tenant.id)}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {openMenuId === tenant.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-9 z-50 w-52 bg-card border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden py-1"
                  >
                    <button
                      onClick={() => {
                        setImpersonateTarget({ id: tenant.id, name: tenant.name });
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.06] transition-colors text-left"
                    >
                      <LogIn className="w-3.5 h-3.5 text-amber-400" />
                      Login as Tenant
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ),
    };

    return [tenantColumn, ...activeOnlyColumns, joinedColumn, actionsColumn];
  }, [activeTab, approving, openMenuId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Impersonation Banner */}
      <AnimatePresence>
        {impersonatingTenant && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
              <span aria-hidden="true">🔒</span>
              <span>Viewing as {impersonatingTenant}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExitImpersonation}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold rounded-xl transition-colors"
            >
              Exit Impersonation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Tenant Management</h1>
          <p className="text-muted-foreground text-sm">Approve, manage, and monitor all platform tenants and their billing status.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/super-admin/tenants/create")}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tenant</span>
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Tenants" value={String(allTenants.length)} icon={Building2} colorIndex={0} delay={0} />
        <StatCard title="Active" value={String(activeTenants.length)} icon={CheckCircle2} colorIndex={1} delay={0.06} />
        <StatCard title="Pending" value={String(pendingTenants.length)} icon={Clock} colorIndex={2} delay={0.12} />
        <StatCard title="Total Users" value={formatCompactNumber(allTenants.reduce((a, t) => a + t.users, 0))} icon={Users} colorIndex={3} delay={0.18} />
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] rounded-xl p-1 w-fit">
        {(["active", "pending"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${
              activeTab === tab
                ? "bg-white/[0.06] text-white"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {tab === "active" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            )}
            {tab === "active" ? "Active Tenants" : "Pending Approval"}
            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
              tab === "active"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}>
              {tab === "active" ? activeTenants.length : pendingTenants.length}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        key={activeTab}
        columns={columns}
        data={displayedTenants}
        getRowId={(row) => row.id}
        searchable
        searchPlaceholder="Search tenants…"
        searchKeys={(row) => `${row.name} ${row.email}`}
        themeIndex={4}
        pageSize={10}
        emptyState={{
          icon: Building2,
          title: `No ${activeTab} tenants found`,
          description: "Try adjusting your search, or add a new tenant.",
        }}
      />

      {/* Login as Tenant Confirmation Dialog */}
      <Dialog open={impersonateTarget !== null} onOpenChange={(open) => !open && setImpersonateTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Login as Tenant
            </DialogTitle>
            <DialogDescription>
              You are about to log in as {impersonateTarget?.name}. This action will be logged for security and audit purposes. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setImpersonateTarget(null)}
              className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImpersonate}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold rounded-xl transition-colors"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}
