import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Check, X, Plus, MoreVertical, Search,
  Users, DollarSign, Calendar, ChevronRight, Shield,
  TrendingUp, AlertCircle, CheckCircle2, Clock
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";

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

type TenantFormValues = {
  name: string;
  email: string;
  status: "active" | "pending";
  plan: string;
};

export function TenantManagement() {
  const [tenants, setTenants] = useState(allTenants);
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");
  const [search, setSearch] = useState("");
  const [approving, setApproving] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TenantFormValues>({
    defaultValues: {
      name: "",
      email: "",
      status: "active",
      plan: "SaaS Starter",
    },
  });

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

  const handleTenantSubmit = (values: TenantFormValues) => {
    const newTenant = {
      id: tenants.length + 1,
      name: values.name,
      email: values.email,
      status: values.status,
      revenue: values.status === "active" ? "$0" : "$0",
      users: 0,
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      plan: values.status === "active" ? values.plan : "—",
      growth: values.status === "active" ? "+0%" : "",
    };
    setTenants(prev => [newTenant, ...prev]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Tenant created successfully!");
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
          onClick={() => setIsDialogOpen(true)}
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
            icon: Building2, color: "text-violet-300",
            iconBg: "bg-violet-500/20 border border-violet-500/30",
            gradient: "from-violet-600/20 via-transparent to-transparent",
            glow: "bg-violet-500/10",
            border: "border-violet-500/20",
            topAccent: "bg-gradient-to-r from-violet-500 to-purple-500",
          },
          {
            label: "Active", value: activeTenants.length,
            icon: CheckCircle2, color: "text-emerald-300",
            iconBg: "bg-emerald-500/20 border border-emerald-500/30",
            gradient: "from-emerald-600/20 via-transparent to-transparent",
            glow: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            topAccent: "bg-gradient-to-r from-emerald-500 to-teal-500",
          },
          {
            label: "Pending", value: pendingTenants.length,
            icon: Clock, color: "text-amber-300",
            iconBg: "bg-amber-500/20 border border-amber-500/30",
            gradient: "from-amber-600/20 via-transparent to-transparent",
            glow: "bg-amber-500/10",
            border: "border-amber-500/20",
            topAccent: "bg-gradient-to-r from-amber-500 to-orange-500",
          },
          {
            label: "Total Users", value: allTenants.reduce((a, t) => a + t.users, 0),
            icon: Users, color: "text-cyan-300",
            iconBg: "bg-cyan-500/20 border border-cyan-500/30",
            gradient: "from-cyan-600/20 via-transparent to-transparent",
            glow: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            topAccent: "bg-gradient-to-r from-cyan-500 to-sky-500",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden p-4 bg-card border ${stat.border} rounded-2xl flex items-center gap-3`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${stat.topAccent} rounded-t-2xl pointer-events-none`} />
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`} />
              {/* Glow orb */}
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${stat.glow} rounded-full blur-2xl pointer-events-none`} />
              <div className={`relative z-10 w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
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
        className="relative bg-card border border-violet-500/20 rounded-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 pointer-events-none z-10" />
        {/* Gradient tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/5 pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
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

      {/* Creation Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0b0b0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-md text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span>Create Tenant</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a new tenant organization on the platform.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleTenantSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Organization name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "Administrator email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Administrator Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@acme.com" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Initial Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/[0.06] text-white">
                          <SelectValue placeholder="Select initial status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0b0b0f] border border-white/[0.08] text-white">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Billing Plan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/[0.06] text-white">
                          <SelectValue placeholder="Select billing plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0b0b0f] border border-white/[0.08] text-white">
                        <SelectItem value="SaaS Starter">SaaS Starter</SelectItem>
                        <SelectItem value="API Usage">API Usage</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 border-t border-white/[0.04] gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="bg-white/5 border border-white/[0.06] hover:bg-white/10 text-xs font-semibold rounded-xl text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-violet-600 text-xs font-bold rounded-xl text-white px-6">
                  Add Tenant
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
