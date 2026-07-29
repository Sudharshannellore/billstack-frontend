import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Power,
  CreditCard,
  CheckCircle2,
  XCircle,
  Activity,
  TrendingUp,
  Globe,
  Coins,
  Calendar,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EmptyState } from "../../components/EmptyState";
import { MultiSelect } from "../../components/MultiSelect";
import { PaymentProviderLogo } from "../../components/PaymentProviderLogo";
import { getCardTheme, getCardThemeByIndex } from "../../components/cardThemes";
import { formatCompactNumber } from "../../components/currency";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";

import { COUNTRY_OPTIONS, CURRENCY_OPTIONS, buildGatewayAnalytics, mockPaymentProviders } from "../../data/mock-payment-gateways";
import type { GatewayStatus, PaymentProvider } from "../../types/payment-gateway";

const THEME_HEX = ["#8B5CF6", "#10B981", "#F59E0B", "#06B6D4", "#F43F5E", "#6366F1"];

const STATUS_OPTIONS: GatewayStatus[] = ["active", "disabled", "maintenance"];

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  supportedCountries: [] as string[],
  supportedCurrencies: [] as string[],
  status: "active" as GatewayStatus,
  docsUrl: "",
  webhookDocsUrl: "",
};

type FormState = typeof EMPTY_FORM;

export function PaymentGateways() {
  const [providers, setProviders] = useState<PaymentProvider[]>(mockPaymentProviders);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [deleteTarget, setDeleteTarget] = useState<PaymentProvider | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<PaymentProvider | null>(null);

  const analytics = useMemo(() => buildGatewayAnalytics(providers), [providers]);

  function persist(next: PaymentProvider[]) {
    setProviders(next);
  }

  function toggleStatus(provider: PaymentProvider) {
    const next = providers.map((p) =>
      p.id === provider.id ? { ...p, status: (p.status === "active" ? "disabled" : "active") as GatewayStatus, updatedAt: today() } : p,
    );
    persist(next);
    toast.success(`${provider.name} is now ${provider.status === "active" ? "disabled" : "active"}.`);
    setMenuOpenId(null);
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(provider: PaymentProvider) {
    setEditingId(provider.id);
    setForm({
      name: provider.name,
      slug: provider.slug,
      description: provider.description,
      logoUrl: provider.logoUrl,
      supportedCountries: provider.supportedCountries,
      supportedCurrencies: provider.supportedCurrencies,
      status: provider.status,
      docsUrl: provider.docsUrl,
      webhookDocsUrl: provider.webhookDocsUrl,
    });
    setDialogOpen(true);
    setMenuOpenId(null);
  }

  function saveProvider() {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Provider name and slug are required.");
      return;
    }

    if (editingId) {
      const next = providers.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: form.name,
              slug: form.slug as PaymentProvider["slug"],
              description: form.description,
              logoUrl: form.logoUrl,
              supportedCountries: form.supportedCountries,
              supportedCurrencies: form.supportedCurrencies,
              status: form.status,
              docsUrl: form.docsUrl,
              webhookDocsUrl: form.webhookDocsUrl,
              updatedAt: today(),
            }
          : p,
      );
      persist(next);
      toast.success(`${form.name} updated successfully.`);
    } else {
      const newProvider: PaymentProvider = {
        id: `prov_${form.slug || Math.random().toString(36).slice(2, 8)}`,
        name: form.name,
        slug: (form.slug || form.name.toLowerCase()) as PaymentProvider["slug"],
        description: form.description,
        logoUrl: form.logoUrl,
        status: form.status,
        supportedCountries: form.supportedCountries,
        supportedCurrencies: form.supportedCurrencies,
        docsUrl: form.docsUrl,
        webhookDocsUrl: form.webhookDocsUrl,
        activeTenantCount: 0,
        totalProcessedTransactions: 0,
        createdAt: today(),
        updatedAt: today(),
        apiVersion: "v1",
      };
      persist([newProvider, ...providers]);
      toast.success(`${form.name} added successfully.`);
    }
    setDialogOpen(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    persist(providers.filter((p) => p.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} deleted.`);
    setDeleteTarget(null);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 p-1 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Payment Gateway Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage all payment gateway providers available to tenants across the platform.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Provider</span>
        </motion.button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Providers" value={String(analytics.totalProviders)} icon={CreditCard} colorIndex={0} delay={0} />
        <StatCard title="Active Providers" value={String(analytics.activeProviders)} icon={CheckCircle2} colorIndex={1} delay={0.05} />
        <StatCard title="Disabled Providers" value={String(analytics.disabledProviders)} icon={XCircle} colorIndex={4} delay={0.1} />
        <StatCard title="Total Transactions" value={formatCompactNumber(analytics.totalTransactions)} icon={Activity} colorIndex={2} delay={0.15} />
        <StatCard title="Success Rate" value={`${analytics.successRate}%`} icon={TrendingUp} changeType="positive" change="+0.4%" colorIndex={3} delay={0.2} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Transactions by Gateway" themeIndex={0}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.transactionsByGateway}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="gateway" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0B0B0F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: 12 }} />
              <Bar dataKey="transactions" radius={[6, 6, 0, 0]}>
                {analytics.transactionsByGateway.map((_, i) => (
                  <Cell key={i} fill={THEME_HEX[i % THEME_HEX.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Success vs Failed Payments" themeIndex={1}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={analytics.successVsFailed} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                <Cell fill="#10B981" />
                <Cell fill="#F43F5E" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0B0B0F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Provider Cards */}
      {providers.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment providers yet"
          description="Add your first payment gateway provider to make it available to tenants."
          action={{ label: "Add New Provider", onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {providers.map((provider, index) => {
            const theme = getCardTheme(provider.slug);
            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className={`relative p-6 ${theme.bgClass} border ${theme.border} rounded-2xl hover:shadow-xl ${theme.glow} transition-all duration-300 flex flex-col gap-5 group overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.bgGlow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <PaymentProviderLogo name={provider.name} slug={provider.slug} logoUrl={provider.logoUrl} />
                    <div>
                      <h3 className="font-black text-white text-sm">{provider.name}</h3>
                      <StatusBadge status={provider.status} />
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === provider.id ? null : provider.id)}
                      className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpenId === provider.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-0 mt-1 w-44 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-xl py-1.5 z-20">
                          <button
                            onClick={() => {
                              setDetailsTarget(provider);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" /> View Details
                          </button>
                          <button onClick={() => openEdit(provider)} className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                            <Edit className="w-3.5 h-3.5 text-muted-foreground" /> Edit Provider
                          </button>
                          <button onClick={() => toggleStatus(provider)} className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                            <Power className="w-3.5 h-3.5 text-muted-foreground" /> {provider.status === "active" ? "Disable" : "Enable"}
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(provider);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Provider
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground font-light leading-relaxed relative z-10">{provider.description}</p>

                <div className="grid grid-cols-2 gap-3 text-xs relative z-10">
                  <InfoBit icon={Globe} label="Countries" value={`${provider.supportedCountries.length} supported`} />
                  <InfoBit icon={Coins} label="Currencies" value={`${provider.supportedCurrencies.length} supported`} />
                  <InfoBit icon={Calendar} label="Last Updated" value={provider.updatedAt} />
                  <InfoBit icon={Activity} label="Active Tenants" value={formatCompactNumber(provider.activeTenantCount)} />
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 relative z-10">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block mb-0.5">
                      Total Processed Transactions
                    </span>
                    <span className="text-sm font-black text-white">{formatCompactNumber(provider.totalProcessedTransactions)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Provider" : "Add New Provider"}</DialogTitle>
            <DialogDescription>Configure this payment gateway provider for tenant availability.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Provider Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Stripe" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. stripe" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description of this gateway" />
            </div>
            <div className="space-y-1.5">
              <Label>Logo URL</Label>
              <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label>Supported Countries</Label>
              <MultiSelect
                options={COUNTRY_OPTIONS.map((c) => ({ value: c.code, label: c.name }))}
                selected={form.supportedCountries}
                onChange={(v) => setForm({ ...form, supportedCountries: v })}
                placeholder="Select countries…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Supported Currencies</Label>
              <MultiSelect
                options={CURRENCY_OPTIONS.map((c) => ({ value: c.code, label: c.name }))}
                selected={form.supportedCurrencies}
                onChange={(v) => setForm({ ...form, supportedCurrencies: v })}
                placeholder="Select currencies…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as GatewayStatus })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Documentation URL</Label>
              <Input value={form.docsUrl} onChange={(e) => setForm({ ...form, docsUrl: e.target.value })} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label>Webhook Documentation URL</Label>
              <Input value={form.webhookDocsUrl} onChange={(e) => setForm({ ...form, webhookDocsUrl: e.target.value })} placeholder="https://…" />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 bg-transparent border border-border rounded-lg text-foreground text-sm font-medium hover:bg-muted/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveProvider}
              className="px-4 py-2 rounded-lg text-sm font-medium shadow-lg bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary/30"
            >
              {editingId ? "Save Changes" : "Add Provider"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name ?? "provider"}?`}
        description="This will permanently remove the provider from the platform. Tenants using it will lose access."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />

      {/* Details Drawer */}
      <Sheet open={!!detailsTarget} onOpenChange={(open) => !open && setDetailsTarget(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detailsTarget && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3 mb-2">
                  <PaymentProviderLogo name={detailsTarget.name} slug={detailsTarget.slug} logoUrl={detailsTarget.logoUrl} size={48} />
                  <div>
                    <SheetTitle>{detailsTarget.name}</SheetTitle>
                    <StatusBadge status={detailsTarget.status} />
                  </div>
                </div>
                <SheetDescription>{detailsTarget.description}</SheetDescription>
              </SheetHeader>

              <div className="px-4 pb-6 space-y-6">
                <DetailSection title="Countries">
                  <div className="flex flex-wrap gap-1.5">
                    {detailsTarget.supportedCountries.map((c) => (
                      <span key={c} className="px-2 py-0.5 text-xs rounded-md bg-white/5 border border-white/[0.08] text-foreground">
                        {c}
                      </span>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection title="Supported Currencies">
                  <div className="flex flex-wrap gap-1.5">
                    {detailsTarget.supportedCurrencies.map((c) => (
                      <span key={c} className="px-2 py-0.5 text-xs rounded-md bg-white/5 border border-white/[0.08] text-foreground">
                        {c}
                      </span>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection title="Webhook URL (mock)">
                  <code className="block text-xs bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-muted-foreground break-all">
                    https://api.billstack.io/webhooks/{detailsTarget.slug}
                  </code>
                </DetailSection>

                <div className="grid grid-cols-2 gap-4">
                  <DetailSection title="API Version">
                    <span className="text-sm text-foreground font-semibold">{detailsTarget.apiVersion}</span>
                  </DetailSection>
                  <DetailSection title="Created Date">
                    <span className="text-sm text-foreground font-semibold">{detailsTarget.createdAt}</span>
                  </DetailSection>
                  <DetailSection title="Last Updated">
                    <span className="text-sm text-foreground font-semibold">{detailsTarget.updatedAt}</span>
                  </DetailSection>
                  <DetailSection title="Active Tenants">
                    <span className="text-sm text-foreground font-semibold">{formatCompactNumber(detailsTarget.activeTenantCount)}</span>
                  </DetailSection>
                </div>

                <DetailSection title="Mock Transaction Statistics">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-2xl font-black text-white">{formatCompactNumber(detailsTarget.totalProcessedTransactions)}</div>
                    <div className="text-xs text-muted-foreground">total processed transactions</div>
                  </div>
                </DetailSection>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}

function today() {
  return "2026-07-29";
}

function ChartCard({ title, themeIndex, children }: { title: string; themeIndex: number; children: React.ReactNode }) {
  const theme = getCardThemeByIndex(themeIndex);
  return (
    <div className={`relative p-6 bg-card border ${theme.border} rounded-2xl overflow-hidden`}>
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function InfoBit({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-white font-semibold truncate">{value}</div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h4>
      {children}
    </div>
  );
}
