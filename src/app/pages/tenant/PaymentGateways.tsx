import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Plug,
  Settings2,
  Trash2,
  Star,
  Zap,
  Copy,
  Loader2,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Download,
  ShieldCheck,
  Sparkles,
  MoreVertical,
  Eye,
  Mail,
  History,
  RotateCcw,
  Receipt,
  TrendingUp,
  Trophy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";

import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EmptyState } from "../../components/EmptyState";
import { DataTable, type DataTableColumn } from "../../components/DataTable";
import { PaymentProviderLogo } from "../../components/PaymentProviderLogo";
import { getCardTheme, getCardThemeByIndex } from "../../components/cardThemes";
import { formatCompactNumber } from "../../components/currency";
import { exportToCsv } from "../../components/exportToCsv";
import { maskSecret } from "../../components/maskSecret";
import { formatMoney, getCurrencySymbol } from "../../components/currency";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

import { mockPaymentProviders, mockTenantGateways, mockPaymentTransactions, buildTenantGatewayAnalytics, PROVIDER_BRAND_COLOR } from "../../data/mock-payment-gateways";
import type { GatewayCredentials, GatewayEnvironment, GatewaySlug, PaymentProvider, PaymentTransaction, TenantPaymentGateway } from "../../types/payment-gateway";

const THEME_HEX = ["#8B5CF6", "#10B981", "#F59E0B", "#06B6D4", "#F43F5E", "#6366F1"];

interface CredentialField {
  key: string;
  label: string;
  secret?: boolean;
}

const CREDENTIAL_FIELDS: Record<GatewaySlug, CredentialField[]> = {
  razorpay: [
    { key: "keyId", label: "Key ID" },
    { key: "keySecret", label: "Key Secret", secret: true },
    { key: "webhookSecret", label: "Webhook Secret", secret: true },
  ],
  stripe: [
    { key: "publishableKey", label: "Publishable Key" },
    { key: "secretKey", label: "Secret Key", secret: true },
    { key: "webhookSecret", label: "Webhook Secret", secret: true },
  ],
  paypal: [
    { key: "clientId", label: "Client ID" },
    { key: "clientSecret", label: "Client Secret", secret: true },
  ],
  cashfree: [
    { key: "appId", label: "App ID" },
    { key: "secretKey", label: "Secret Key", secret: true },
  ],
  adyen: [
    { key: "apiKey", label: "API Key", secret: true },
    { key: "merchantAccount", label: "Merchant Account" },
  ],
  square: [
    { key: "accessToken", label: "Access Token", secret: true },
    { key: "locationId", label: "Location ID" },
  ],
};

function paymentMethodFor(txn: PaymentTransaction): string {
  return txn.gatewaySlug === "razorpay" ? "UPI" : "Card •••• 4242";
}

function buildTransactionText(txn: PaymentTransaction): string {
  const symbol = getCurrencySymbol(txn.currency);
  const fee = Math.round(txn.amount * 0.023 * 100) / 100;
  const net = Math.round((txn.amount - fee) * 100) / 100;
  return [
    `TRANSACTION ${txn.id}`,
    `Customer: ${txn.customer}`,
    `Invoice: ${txn.invoiceId}`,
    `Gateway: ${txn.gatewaySlug}`,
    `Payment Method: ${paymentMethodFor(txn)}`,
    `Date: ${txn.date}`,
    `Status: ${txn.status.toUpperCase()}`,
    "",
    `Amount: ${symbol}${txn.amount.toFixed(2)}`,
    `Gateway Fee: ${symbol}${fee.toFixed(2)}`,
    `Net Settled: ${symbol}${net.toFixed(2)}`,
  ].join("\n");
}

function downloadTransaction(txn: PaymentTransaction) {
  const content = buildTransactionText(txn);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${txn.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function PaymentGateways() {
  const availableProviders = useMemo(() => mockPaymentProviders.filter((p) => p.status === "active"), []);
  const [gateways, setGateways] = useState<TenantPaymentGateway[]>(mockTenantGateways);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(mockPaymentTransactions);

  const [configTarget, setConfigTarget] = useState<PaymentProvider | null>(null);
  const [credentialForm, setCredentialForm] = useState<GatewayCredentials>({});
  const [environment, setEnvironment] = useState<GatewayEnvironment>("sandbox");

  const [removeTarget, setRemoveTarget] = useState<TenantPaymentGateway | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Transaction row actions — replica of the Invoices.tsx action set
  const [showTxnMenu, setShowTxnMenu] = useState<string | null>(null);
  const [timelineTxn, setTimelineTxn] = useState<PaymentTransaction | null>(null);
  const [pdfTxn, setPdfTxn] = useState<PaymentTransaction | null>(null);
  const [emailTxn, setEmailTxn] = useState<PaymentTransaction | null>(null);
  const [refundTxn, setRefundTxn] = useState<PaymentTransaction | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [creditNoteTxn, setCreditNoteTxn] = useState<PaymentTransaction | null>(null);
  const [creditNoteAmount, setCreditNoteAmount] = useState("");
  const [creditNoteReason, setCreditNoteReason] = useState("");

  const analytics = useMemo(() => buildTenantGatewayAnalytics(transactions), [transactions]);

  function getGatewayFor(providerId: string) {
    return gateways.find((g) => g.providerId === providerId) ?? null;
  }

  function getProviderFor(gateway: TenantPaymentGateway) {
    return mockPaymentProviders.find((p) => p.id === gateway.providerId) ?? null;
  }

  function openConnect(provider: PaymentProvider) {
    const existing = getGatewayFor(provider.id);
    setConfigTarget(provider);
    setCredentialForm(existing?.credentials ?? {});
    setEnvironment(existing?.environment ?? "sandbox");
  }

  function saveConnection() {
    if (!configTarget) return;
    const fields = CREDENTIAL_FIELDS[configTarget.slug];
    const missing = fields.some((f) => !credentialForm[f.key]?.trim());
    if (missing) {
      toast.error("Please fill in all credential fields.");
      return;
    }

    const existing = getGatewayFor(configTarget.id);
    if (existing) {
      setGateways((prev) =>
        prev.map((g) =>
          g.id === existing.id
            ? { ...g, credentials: credentialForm, environment, connectionStatus: "connected" as const, connectedAt: existing.connectedAt ?? today() }
            : g,
        ),
      );
      toast.success(`${configTarget.name} configuration updated.`);
    } else {
      const newGateway: TenantPaymentGateway = {
        id: `tg_${configTarget.slug}_${Math.random().toString(36).slice(2, 8)}`,
        providerId: configTarget.id,
        providerSlug: configTarget.slug,
        connectionStatus: "connected",
        environment,
        isDefault: gateways.length === 0,
        credentials: credentialForm,
        webhookUrl: `https://api.billstack.io/webhooks/${configTarget.slug}/tn_${Math.random().toString(36).slice(2, 6)}`,
        webhookSecret: `whsec_${Math.random().toString(36).slice(2, 14)}`,
        connectedAt: today(),
        lastTestedAt: null,
        lastTestResult: null,
      };
      setGateways((prev) => [...prev, newGateway]);
      toast.success(`${configTarget.name} connected successfully.`);
    }
    setConfigTarget(null);
  }

  function removeGateway() {
    if (!removeTarget) return;
    setGateways((prev) => prev.filter((g) => g.id !== removeTarget.id));
    toast.success("Gateway removed.");
    setRemoveTarget(null);
  }

  function setAsDefault(gateway: TenantPaymentGateway) {
    setGateways((prev) => prev.map((g) => ({ ...g, isDefault: g.id === gateway.id })));
    toast.success(`${labelFor(gateway.providerSlug)} set as default payment gateway.`);
  }

  function testConnection(gateway: TenantPaymentGateway) {
    setTestingId(gateway.id);
    setTimeout(() => {
      const success = Math.random() > 0.2;
      setGateways((prev) =>
        prev.map((g) => (g.id === gateway.id ? { ...g, lastTestedAt: today(), lastTestResult: success ? ("success" as const) : ("failed" as const) } : g)),
      );
      setTestingId(null);
      if (success) {
        toast.success("Connection Successful");
      } else {
        toast.error("Connection Failed");
      }
    }, 2000);
  }

  function copyToClipboard(value: string) {
    navigator.clipboard?.writeText(value);
    toast.success("Copied to clipboard.");
  }

  const handleDownload = (txn: PaymentTransaction) => {
    downloadTransaction(txn);
    toast.success(`Transaction ${txn.id} downloaded`);
  };

  const openRefundDialog = (txn: PaymentTransaction) => {
    setShowTxnMenu(null);
    setRefundTxn(txn);
    setRefundAmount(txn.amount.toFixed(2));
    setRefundReason("");
  };

  const closeRefundDialog = () => {
    setRefundTxn(null);
    setRefundAmount("");
    setRefundReason("");
  };

  const submitRefund = () => {
    if (!refundTxn) return;
    setTransactions((list) => list.map((t) => (t.id === refundTxn.id ? { ...t, status: "refunded" } : t)));
    toast.success(`Refund issued for ${refundTxn.id}`, {
      description: `${getCurrencySymbol(refundTxn.currency)}${refundAmount} refunded${refundReason ? ` — ${refundReason}` : ""}`,
    });
    closeRefundDialog();
  };

  const openCreditNoteDialog = (txn: PaymentTransaction) => {
    setShowTxnMenu(null);
    setCreditNoteTxn(txn);
    setCreditNoteAmount(txn.amount.toFixed(2));
    setCreditNoteReason("");
  };

  const submitCreditNote = () => {
    if (!creditNoteTxn) return;
    toast.success(`Credit note issued for ${creditNoteTxn.id}`, {
      description: `${getCurrencySymbol(creditNoteTxn.currency)}${creditNoteAmount} credited${creditNoteReason ? ` — ${creditNoteReason}` : ""}`,
    });
    setCreditNoteTxn(null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => statusFilter === "all" || t.status === statusFilter);
  }, [transactions, statusFilter]);

  const defaultGateway = gateways.find((g) => g.isDefault);
  const defaultProvider = defaultGateway ? getProviderFor(defaultGateway) : null;
  const connectedCount = gateways.length;

  const topGateway = useMemo(() => {
    const sorted = [...analytics.paymentsByGateway].sort((a, b) => b.transactions - a.transactions);
    return sorted[0] ?? null;
  }, [analytics.paymentsByGateway]);
  const totalGatewayTxns = analytics.paymentsByGateway.reduce((sum, g) => sum + g.transactions, 0);

  const columns: DataTableColumn<PaymentTransaction>[] = [
    { key: "id", header: "Transaction ID", render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.id}</span> },
    { key: "customer", header: "Customer", render: (row) => <span className="font-semibold text-white">{row.customer}</span> },
    { key: "invoiceId", header: "Invoice", render: (row) => row.invoiceId },
    { key: "gateway", header: "Gateway", render: (row) => <span className="capitalize">{row.gatewaySlug}</span> },
    { key: "amount", header: "Amount", align: "right", render: (row) => formatMoney(row.amount, row.currency) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "date", header: "Date", render: (row) => row.date },
    {
      key: "actions",
      header: "",
      align: "right",
      className: "w-32",
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDownload(row)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Download transaction"
          >
            <Download className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          <div className="relative inline-block">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTxnMenu(showTxnMenu === row.id ? null : row.id)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <AnimatePresence>
              {showTxnMenu === row.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowTxnMenu(null)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
                  >
                    <button
                      onClick={() => {
                        setShowTxnMenu(null);
                        handleDownload(row);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <Download className="w-4 h-4 text-primary" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowTxnMenu(null);
                        setPdfTxn(row);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>PDF Preview</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowTxnMenu(null);
                        setEmailTxn(row);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>Email Preview</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowTxnMenu(null);
                        setTimelineTxn(row);
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                    >
                      <History className="w-4 h-4 text-muted-foreground" />
                      <span>View Timeline</span>
                    </button>
                    <div className="h-[1px] w-full bg-border my-1" />
                    {row.status === "success" && (
                      <button
                        onClick={() => openRefundDialog(row)}
                        className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium text-destructive"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Issue Refund</span>
                      </button>
                    )}
                    {row.status === "success" && (
                      <button
                        onClick={() => openCreditNoteDialog(row)}
                        className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                      >
                        <Receipt className="w-4 h-4 text-cyan-400" />
                        <span>Issue Credit Note</span>
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      ),
    },
  ];

  function renderTransactionDetails(txn: PaymentTransaction) {
    const fee = Math.round(txn.amount * 0.023 * 100) / 100;
    const net = Math.round((txn.amount - fee) * 100) / 100;
    return (
      <div className="rounded-xl border border-border bg-card/60 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <DetailField label="Gateway Reference" value={`${txn.gatewaySlug}_${txn.id.replace("txn_", "")}`} mono />
        <DetailField label="Payment Method" value={paymentMethodFor(txn)} />
        <DetailField label="Gateway Fee" value={formatMoney(fee, txn.currency)} />
        <DetailField label="Net Settled" value={formatMoney(net, txn.currency)} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 p-1 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Payment Gateways</h1>
          <p className="text-muted-foreground text-sm">Connect and configure the payment gateways enabled for your account.</p>
        </div>
      </div>

      {/* Hero: Default Gateway Spotlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-primary/15 via-[#0b0b0f] to-violet-600/10 p-6 sm:p-8"
      >
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {defaultGateway && defaultProvider ? (
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <PaymentProviderLogo name={defaultProvider.name} slug={defaultProvider.slug} logoUrl={defaultProvider.logoUrl} size={56} />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0b0b0f]" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Default Payment Gateway</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                </div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  {defaultProvider.name}
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      defaultGateway.environment === "live"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {defaultGateway.environment}
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {defaultGateway.lastTestResult === "success"
                    ? `Last verified ${defaultGateway.lastTestedAt}`
                    : defaultGateway.lastTestResult === "failed"
                    ? "Last test failed — check credentials"
                    : "Not tested yet"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <RingStat label="Success Rate" value={analytics.successfulPayments} total={analytics.successfulPayments + analytics.failedPayments} color="#10B981" />
              <div className="hidden sm:block h-12 w-px bg-white/[0.08]" />
              <div className="text-center">
                <div className="text-2xl font-black text-white">{connectedCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Connected</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => testConnection(defaultGateway)}
                disabled={testingId === defaultGateway.id}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 border border-white/[0.12] text-white flex items-center gap-2 hover:bg-white/[0.15] disabled:opacity-60"
              >
                {testingId === defaultGateway.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Test Connection
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">No default gateway set</h2>
                <p className="text-xs text-muted-foreground">Connect a provider below to start accepting payments.</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <Tabs defaultValue="gateways" className="w-full">
        <TabsList>
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Gateways Tab */}
        <TabsContent value="gateways" className="space-y-8 pt-6">
          {availableProviders.length === 0 ? (
            <EmptyState icon={Plug} title="No gateways available" description="Ask your platform administrator to enable payment gateways." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableProviders.map((provider, index) => {
                const gateway = getGatewayFor(provider.id);
                const theme = getCardTheme(provider.slug);
                const isConnected = !!gateway;
                const brandColor = PROVIDER_BRAND_COLOR[provider.slug] ?? "#6366F1";
                return (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className={`relative p-6 ${theme.bgClass} border ${
                      gateway?.isDefault ? "border-2 border-primary/50" : theme.border
                    } rounded-2xl hover:shadow-xl ${theme.glow} transition-all duration-300 flex flex-col gap-5 group overflow-hidden`}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl pointer-events-none"
                      style={{ background: `linear-gradient(to right, ${brandColor}, transparent)` }}
                    />
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.bgGlow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <PaymentProviderLogo name={provider.name} slug={provider.slug} logoUrl={provider.logoUrl} />
                        <div>
                          <h3 className="font-black text-white text-sm">{provider.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            {isConnected ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                </span>
                                Connected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/[0.08]">
                                <XCircle className="w-3 h-3" /> Not Connected
                              </span>
                            )}
                            {gateway && (
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                  gateway.environment === "live"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}
                              >
                                {gateway.environment}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {gateway?.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          <Star className="w-3 h-3 fill-current" /> Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground font-light leading-relaxed relative z-10">{provider.description}</p>

                    <div className="flex flex-wrap gap-1.5 relative z-10">
                      {provider.supportedCurrencies.slice(0, 4).map((c) => (
                        <span key={c} className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 border border-white/[0.08] text-foreground">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 relative z-10 -mt-2">
                      {provider.supportedCountries.slice(0, 4).map((c) => (
                        <span key={c} className="px-2 py-0.5 text-[10px] rounded-md bg-white/[0.03] border border-white/[0.06] text-muted-foreground">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.04] pt-4 relative z-10">
                      {!isConnected ? (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => openConnect(provider)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/20 flex items-center gap-1.5"
                        >
                          <Plug className="w-3.5 h-3.5" /> Connect
                        </motion.button>
                      ) : (
                        <>
                          <button
                            onClick={() => openConnect(provider)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/[0.08] text-white flex items-center gap-1.5 hover:bg-white/10"
                          >
                            <Settings2 className="w-3.5 h-3.5" /> Edit Config
                          </button>
                          <button
                            onClick={() => testConnection(gateway)}
                            disabled={testingId === gateway.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/[0.08] text-white flex items-center gap-1.5 hover:bg-white/10 disabled:opacity-60"
                          >
                            {testingId === gateway.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                            Test Connection
                          </button>
                          {!gateway.isDefault && (
                            <button
                              onClick={() => setAsDefault(gateway)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/[0.08] text-white flex items-center gap-1.5 hover:bg-white/10"
                            >
                              <Star className="w-3.5 h-3.5" /> Set Default
                            </button>
                          )}
                          <button
                            onClick={() => setRemoveTarget(gateway)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-1.5 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Webhook Information */}
          <AnimatePresence>
            {defaultGateway && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`relative p-6 bg-card border ${getCardThemeByIndex(2).border} rounded-2xl overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-2xl pointer-events-none`} />
                <h3 className="text-lg font-bold text-white mb-4 relative z-10">Webhook Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Webhook URL</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-muted-foreground break-all">
                        {defaultGateway.webhookUrl}
                      </code>
                      <button onClick={() => copyToClipboard(defaultGateway.webhookUrl)} className="p-2 rounded-lg bg-white/5 border border-white/[0.08] hover:bg-white/10">
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Webhook Secret</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-muted-foreground break-all">
                        {maskSecret(defaultGateway.webhookSecret)}
                      </code>
                      <button onClick={() => copyToClipboard(defaultGateway.webhookSecret)} className="p-2 rounded-lg bg-white/5 border border-white/[0.08] hover:bg-white/10">
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-8 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Today's Transactions" value={String(analytics.todaysTransactions)} icon={Clock} colorIndex={0} />
            <StatCard title="Successful Payments" value={String(analytics.successfulPayments)} icon={CheckCircle2} colorIndex={1} changeType="positive" />
            <StatCard title="Failed Payments" value={String(analytics.failedPayments)} icon={XCircle} colorIndex={4} changeType="negative" />
            <StatCard title="Revenue Processed" value={formatMoney(analytics.revenueProcessed, "INR", { compact: true })} icon={DollarSign} colorIndex={2} />
            <StatCard title="Avg Transaction Value" value={formatMoney(analytics.avgTransactionValue, "INR", { compact: true })} icon={TrendingUp} colorIndex={5} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartCard title="Revenue Trend" themeIndex={2}>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analytics.revenueTrend}>
                    <defs>
                      <linearGradient id="paymentRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0B0B0F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: 12 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#paymentRevenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <ChartCard title="Top Gateway" themeIndex={3}>
              <div className="flex flex-col items-center justify-center h-[280px] gap-4">
                {topGateway ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/10 border border-primary/20 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-amber-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black text-white capitalize">{topGateway.gateway}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCompactNumber(topGateway.transactions)} of {formatCompactNumber(totalGatewayTxns)} transactions
                      </div>
                    </div>
                    <div className="w-full max-w-[200px] h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                        style={{ width: `${totalGatewayTxns > 0 ? Math.round((topGateway.transactions / totalGatewayTxns) * 100) : 0}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No gateway activity yet.</span>
                )}
              </div>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Gateway Performance" themeIndex={0}>
              <div className="space-y-4 py-1">
                {analytics.paymentsByGateway
                  .slice()
                  .sort((a, b) => b.transactions - a.transactions)
                  .map((g, i) => {
                    const pct = totalGatewayTxns > 0 ? Math.round((g.transactions / totalGatewayTxns) * 100) : 0;
                    return (
                      <div key={g.gateway} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white capitalize flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-white/5 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                            {g.gateway}
                          </span>
                          <span className="text-muted-foreground">
                            {formatCompactNumber(g.transactions)} txns · {pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: THEME_HEX[i % THEME_HEX.length] }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ChartCard>

            <ChartCard title="Success vs Failed" themeIndex={4}>
              <div className="relative">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Success", value: analytics.successfulPayments },
                        { name: "Failed", value: analytics.failedPayments },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#F43F5E" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0B0B0F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: -20 }}>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">
                      {analytics.successfulPayments + analytics.failedPayments > 0
                        ? Math.round((analytics.successfulPayments / (analytics.successfulPayments + analytics.failedPayments)) * 100)
                        : 0}
                      %
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Success</div>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Payment Success Trend" themeIndex={5}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analytics.successTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0B0B0F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="failed" stroke="#F43F5E" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">Transaction History</h3>
            <button
              onClick={() =>
                exportToCsv(
                  filteredTransactions,
                  ["Transaction ID", "Customer", "Invoice", "Gateway", "Amount", "Currency", "Status", "Date"],
                  (t) => [t.id, t.customer, t.invoiceId, t.gatewaySlug, t.amount, t.currency, t.status, t.date],
                  "payment-transactions.csv",
                )
              }
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/[0.08] text-white flex items-center gap-1.5 hover:bg-white/10 self-start"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <DataTable
            columns={columns}
            data={filteredTransactions}
            getRowId={(row) => row.id}
            searchable
            searchPlaceholder="Search transaction id, customer, invoice…"
            searchKeys={(row) => `${row.id} ${row.customer} ${row.invoiceId}`}
            themeIndex={3}
            pageSize={8}
            renderExpanded={(row) => renderTransactionDetails(row)}
            toolbar={
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            }
            emptyState={{ icon: Wallet, title: "No transactions found", description: "Try adjusting your search or filters." }}
          />
        </TabsContent>
      </Tabs>

      {/* Gateway Configuration Dialog */}
      <Dialog open={!!configTarget} onOpenChange={(open) => !open && setConfigTarget(null)}>
        <DialogContent className="max-w-md">
          {configTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Configure {configTarget.name}</DialogTitle>
                <DialogDescription>Credentials are held only in this session's state and never displayed in plain text after saving.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {CREDENTIAL_FIELDS[configTarget.slug].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label>{field.label}</Label>
                    <Input
                      type={field.secret ? "password" : "text"}
                      value={credentialForm[field.key] ?? ""}
                      onChange={(e) => setCredentialForm({ ...credentialForm, [field.key]: e.target.value })}
                      placeholder={field.secret ? "••••••••••••" : field.label}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <Label>Environment</Label>
                  <Select value={environment} onValueChange={(v) => setEnvironment(v as GatewayEnvironment)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <button
                  onClick={() => setConfigTarget(null)}
                  className="px-4 py-2 bg-transparent border border-border rounded-lg text-foreground text-sm font-medium hover:bg-muted/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveConnection}
                  className="px-4 py-2 rounded-lg text-sm font-medium shadow-lg bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary/30"
                >
                  Save
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove confirm */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={`Remove ${removeTarget ? labelFor(removeTarget.providerSlug) : "gateway"}?`}
        description="This will disconnect the gateway and remove its stored configuration."
        confirmLabel="Remove"
        destructive
        onConfirm={removeGateway}
      />

      {/* Refund Dialog */}
      <Dialog open={!!refundTxn} onOpenChange={(open) => !open && closeRefundDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund — {refundTxn?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="txn-refund-amount">Refund Amount ({refundTxn ? getCurrencySymbol(refundTxn.currency) : ""})</Label>
              <Input
                id="txn-refund-amount"
                type="number"
                step="0.01"
                max={refundTxn?.amount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Full transaction amount is {refundTxn ? formatMoney(refundTxn.amount, refundTxn.currency) : ""}. Enter a lower amount for a partial refund.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-refund-reason">Reason</Label>
              <Textarea id="txn-refund-reason" placeholder="Reason for issuing this refund..." value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRefundDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitRefund} disabled={!refundAmount}>
              Issue Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Dialog */}
      <Dialog open={!!timelineTxn} onOpenChange={(open) => !open && setTimelineTxn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <span>{timelineTxn?.id} — Timeline</span>
            </DialogTitle>
          </DialogHeader>
          {timelineTxn && (
            <div className="space-y-4">
              {[
                { label: "Transaction initiated", time: timelineTxn.date },
                { label: `Routed via ${timelineTxn.gatewaySlug}`, time: timelineTxn.date },
                { label: `Marked as ${timelineTxn.status}`, time: "2 hours ago" },
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

      {/* PDF Preview Dialog */}
      <Dialog open={!!pdfTxn} onOpenChange={(open) => !open && setPdfTxn(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <span>PDF Preview — {pdfTxn?.id}</span>
            </DialogTitle>
          </DialogHeader>
          {pdfTxn && (
            <div className="bg-white text-black rounded-lg p-6 text-xs font-mono whitespace-pre-wrap max-h-[60vh] overflow-y-auto">{buildTransactionText(pdfTxn)}</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog open={!!emailTxn} onOpenChange={(open) => !open && setEmailTxn(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <span>Email Preview — {emailTxn?.id}</span>
            </DialogTitle>
            <DialogDescription>What the customer receives in their inbox.</DialogDescription>
          </DialogHeader>
          {emailTxn && (
            <div className="rounded-lg border border-border p-4 space-y-2 text-sm">
              <div className="text-xs text-muted-foreground">To: {emailTxn.customer.toLowerCase().replace(" ", ".")}@example.com</div>
              <div className="font-semibold">Your payment {emailTxn.id} via {emailTxn.gatewaySlug}</div>
              <p className="text-muted-foreground">
                Hi {emailTxn.customer.split(" ")[0]}, your payment of {formatMoney(emailTxn.amount, emailTxn.currency)} for invoice {emailTxn.invoiceId} dated{" "}
                {emailTxn.date} is {emailTxn.status}. View the attached receipt for full details.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Credit Note Dialog */}
      <Dialog open={!!creditNoteTxn} onOpenChange={(open) => !open && setCreditNoteTxn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" />
              <span>Issue Credit Note — {creditNoteTxn?.id}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="txn-credit-amount">Credit Amount ({creditNoteTxn ? getCurrencySymbol(creditNoteTxn.currency) : ""})</Label>
              <Input id="txn-credit-amount" type="number" step="0.01" value={creditNoteAmount} onChange={(e) => setCreditNoteAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-credit-reason">Reason</Label>
              <Textarea id="txn-credit-reason" placeholder="Reason for this credit note..." value={creditNoteReason} onChange={(e) => setCreditNoteReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditNoteTxn(null)}>
              Cancel
            </Button>
            <Button onClick={submitCreditNote} disabled={!creditNoteAmount} className="bg-primary hover:bg-primary-dark">
              Issue Credit Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function today() {
  return "2026-07-29";
}

function labelFor(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function ChartCard({ title, themeIndex, children }: { title: string; themeIndex: number; children: React.ReactNode }) {
  const theme = getCardThemeByIndex(themeIndex);
  return (
    <div className={`relative p-6 bg-card border ${theme.border} rounded-2xl overflow-hidden h-full`}>
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-foreground font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
    </div>
  );
}

function RingStat({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 100;
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="flex items-center gap-3">
      <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
        <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <motion.circle
          cx="26"
          cy="26"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div>
        <div className="text-lg font-black text-white leading-none">{pct}%</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );
}
