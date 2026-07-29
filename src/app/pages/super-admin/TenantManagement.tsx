import { motion, AnimatePresence } from "motion/react";
import {
  Building2, Check, X, Plus, MoreVertical, Search,
  Users, Calendar, ChevronRight, Shield,
  TrendingUp, AlertCircle, CheckCircle2, Clock, LogIn, ShieldAlert
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { formatCompactNumber } from "../../components/currency";
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

export function TenantManagement() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState(allTenants);
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");
  const [search, setSearch] = useState("");
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
  const displayedTenants = (activeTab === "active" ? activeTenants : pendingTenants).filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

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
        {[
          {
            label: "Total Tenants", value: allTenants.length,
            icon: Building2,
          },
          {
            label: "Active", value: activeTenants.length,
            icon: CheckCircle2,
          },
          {
            label: "Pending", value: pendingTenants.length,
            icon: Clock,
          },
          {
            label: "Total Users", value: allTenants.reduce((a, t) => a + t.users, 0),
            icon: Users,
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const theme = getCardThemeByIndex(i);
          const color = theme.iconColor;
          const iconBg = `bg-white/[0.04] border ${theme.border}`;
          const gradient = theme.bgGlow;
          const glow = "bg-white/10";
          const border = theme.border;
          const topAccent = `bg-gradient-to-r ${theme.topAccent}`;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden p-4 bg-card border ${border} rounded-2xl flex items-center gap-3`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${topAccent} rounded-t-2xl pointer-events-none`} />
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`} />
              {/* Glow orb */}
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${glow} rounded-full blur-2xl pointer-events-none`} />
              <div className={`relative z-10 w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`relative bg-card border ${getCardThemeByIndex(4).border} rounded-2xl overflow-hidden`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(4).topAccent} pointer-events-none z-10`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(4).bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${getCardThemeByIndex(4).orb5} rounded-full blur-3xl pointer-events-none`} />
        {/* Tab Bar + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] rounded-xl p-1">
            {(["active", "pending"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(""); }}
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tenants..."
              className="pl-9 pr-4 py-2 bg-white/[0.02] border border-white/[0.06] focus:border-primary/40 rounded-xl text-xs text-white placeholder:text-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04] text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <th className="py-3 pl-6 pr-4">Tenant</th>
                {activeTab === "active" && (
                  <>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Revenue</th>
                    <th className="py-3 px-4">Users</th>
                    <th className="py-3 px-4">Growth</th>
                    <th className="py-3 px-4">Health</th>
                    <th className="py-3 px-4">Quota</th>
                  </>
                )}
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 pl-4 pr-6">Actions</th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              <motion.tbody
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-white/[0.02]"
              >
                {displayedTenants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Building2 className="w-10 h-10 opacity-20" />
                        <p className="text-sm">No {activeTab} tenants found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedTenants.map((tenant, i) => (
                    <motion.tr
                      key={tenant.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Tenant Info */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 bg-gradient-to-br ${getCardThemeByIndex(i).topAccent} rounded-xl flex items-center justify-center shrink-0`}>
                            <span className="text-white text-xs font-black">{tenant.name[0]}</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{tenant.name}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">{tenant.email}</div>
                          </div>
                        </div>
                      </td>

                      {activeTab === "active" && (
                        <>
                          <td className="py-4 px-4">
                            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">{tenant.plan}</span>
                          </td>
                          <td className="py-4 px-4 text-sm font-bold text-white">{tenant.revenue}</td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{formatCompactNumber(tenant.users)}</td>
                          <td className="py-4 px-4">
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{tenant.growth}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span className={`w-2 h-2 rounded-full ${HEALTH_STYLES[tenant.health].dot}`} />
                              {HEALTH_STYLES[tenant.health].label}
                            </span>
                          </td>
                          <td className="py-4 px-4 w-28">
                            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${tenant.quotaUsed > 80 ? "bg-rose-500" : tenant.quotaUsed > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${tenant.quotaUsed}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{tenant.quotaUsed}% used</span>
                          </td>
                        </>
                      )}

                      <td className="py-4 px-4 text-xs text-muted-foreground">{tenant.joined}</td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-6">
                        {activeTab === "pending" ? (
                          <div className="flex items-center gap-2">
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
                              {approving === tenant.id ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
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
                          <div className="relative flex justify-end">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === tenant.id ? null : tenant.id)}
                              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                              {openMenuId === tenant.id && (
                                <>
                                  {/* Backdrop to close menu on outside click */}
                                  <div
                                    className="fixed inset-0 z-20"
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-9 z-30 w-52 bg-card border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden py-1"
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
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      </motion.div>

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
