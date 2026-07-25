import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Check, X, Plus, MoreVertical, Search,
  Users, DollarSign, Calendar, ChevronRight, Shield,
  TrendingUp, AlertCircle, CheckCircle2, Clock
} from "lucide-react";
import { useState } from "react";

const allTenants = [
  { id: 1, name: "Acme Corp", email: "admin@acme.com", status: "active", revenue: "$28.5K", users: 245, joined: "Jan 15, 2026", plan: "Enterprise", growth: "+12%" },
  { id: 2, name: "TechFlow", email: "team@techflow.io", status: "active", revenue: "$24.2K", users: 189, joined: "Feb 3, 2026", plan: "SaaS Starter", growth: "+8%" },
  { id: 3, name: "DataHub", email: "hello@datahub.co", status: "active", revenue: "$18.9K", users: 156, joined: "Mar 8, 2026", plan: "API Usage", growth: "+21%" },
  { id: 4, name: "CloudSync", email: "info@cloudsync.com", status: "pending", revenue: "$0", users: 0, joined: "Apr 10, 2026", plan: "—", growth: "" },
  { id: 5, name: "DevTools Inc", email: "team@devtools.io", status: "pending", revenue: "$0", users: 0, joined: "Apr 12, 2026", plan: "—", growth: "" },
  { id: 6, name: "API Master", email: "contact@apimaster.com", status: "pending", revenue: "$0", users: 0, joined: "Apr 13, 2026", plan: "—", growth: "" },
];

const avatarColors = [
  "from-primary to-violet-600",
  "from-cyan-500 to-sky-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];

export function TenantManagement() {
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");
  const [search, setSearch] = useState("");
  const [approving, setApproving] = useState<number | null>(null);

  const activeTenants = allTenants.filter(t => t.status === "active");
  const pendingTenants = allTenants.filter(t => t.status === "pending");
  const displayedTenants = (activeTab === "active" ? activeTenants : pendingTenants).filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id: number) => {
    setApproving(id);
    setTimeout(() => setApproving(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Tenant Management</h1>
          <p className="text-muted-foreground text-sm">Approve, manage, and monitor all platform tenants and their billing status.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tenant</span>
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Tenants", value: allTenants.length, icon: Building2, color: "text-primary", bg: "bg-primary/10" },
          { label: "Active", value: activeTenants.length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Pending", value: pendingTenants.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Total Users", value: allTenants.reduce((a, t) => a + t.users, 0), icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 bg-card border border-white/[0.06] rounded-2xl flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-black text-white">{stat.value}</div>
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
        className="bg-card border border-white/[0.06] rounded-2xl overflow-hidden"
      >
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
                          <div className={`w-9 h-9 bg-gradient-to-br ${avatarColors[i % avatarColors.length]} rounded-xl flex items-center justify-center shrink-0`}>
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
                          <td className="py-4 px-4 text-sm text-muted-foreground">{tenant.users.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{tenant.growth}</span>
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
                          <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
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
    </motion.div>
  );
}
