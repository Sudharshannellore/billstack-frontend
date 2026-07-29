import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Plus,
  MoreVertical,
  Star,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  CalendarClock,
  PlayCircle,
  Eye,
  RotateCw,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { formatMoney, formatCompactNumber } from "../../components/currency";
import { StatusBadge } from "../../components/StatusBadge";

interface BillingRun {
  id: string;
  cycle: string;
  status: "scheduled" | "running" | "completed" | "failed";
  customers: number;
  totalAmount: number;
  runDate: string;
}

const initialBillingRuns: BillingRun[] = [
  { id: "run_1042", cycle: "Jul 2026 Monthly", status: "completed", customers: 1284, totalAmount: 384200, runDate: "Jul 1, 2026" },
  { id: "run_1041", cycle: "Jun 2026 Monthly", status: "completed", customers: 1201, totalAmount: 361500, runDate: "Jun 1, 2026" },
  { id: "run_1043", cycle: "Aug 2026 Monthly", status: "scheduled", customers: 1310, totalAmount: 397800, runDate: "Aug 1, 2026" },
];

const upcomingRenewals = [
  { customer: "Alice Johnson", plan: "Pro", date: "Aug 15, 2026", amount: 99 },
  { customer: "Bob Smith", plan: "Ultra Pack", date: "Aug 18, 2026", amount: 50 },
  { customer: "Carol White", plan: "Enterprise", date: "Aug 20, 2026", amount: 499 },
];

const upcomingCharges = [
  { customer: "David Brown", reason: "Overage — API calls", date: "Aug 5, 2026", amount: 42 },
  { customer: "Emma Davis", reason: "Add-on: extra seats", date: "Aug 8, 2026", amount: 150 },
];
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

interface PaymentMethod {
  id: number;
  brand: "Visa" | "Mastercard";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
  { id: 1, brand: "Visa", last4: "4242", expMonth: 12, expYear: 2027, isDefault: true },
  { id: 2, brand: "Mastercard", last4: "8210", expMonth: 6, expYear: 2026, isDefault: false },
];

export function Billing() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [paymentFailed, setPaymentFailed] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [billingRuns, setBillingRuns] = useState<BillingRun[]>(initialBillingRuns);
  const [previewRun, setPreviewRun] = useState<BillingRun | null>(null);

  const runBillingNow = () => {
    const id = `run_${Math.floor(Math.random() * 9000 + 1000)}`;
    setBillingRuns((prev) => [{ id, cycle: "Manual run", status: "running", customers: 1310, totalAmount: 397800, runDate: "Today" }, ...prev]);
    toast.info("Billing run started");
    setTimeout(() => {
      setBillingRuns((prev) => prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r)));
      toast.success("Billing run completed", { description: "All invoices generated successfully." });
    }, 2000);
  };

  const retryRun = (id: string) => {
    setBillingRuns((prev) => prev.map((r) => (r.id === id ? { ...r, status: "running" } : r)));
    toast.info("Retrying billing run...");
    setTimeout(() => {
      setBillingRuns((prev) => prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r)));
      toast.success("Billing run retried successfully");
    }, 1500);
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isDefault: pm.id === id }))
    );
    setOpenMenuId(null);
    toast.success("Default payment method updated");
  };

  const handleRemove = (id: number) => {
    const target = paymentMethods.find((pm) => pm.id === id);
    if (!target) return;

    if (target.isDefault) {
      toast.error("Can't remove the default card", {
        description: "Set another card as default before removing this one.",
      });
      setOpenMenuId(null);
      return;
    }

    if (paymentMethods.length === 1) {
      toast.error("Can't remove your only payment method", {
        description: "Add another card before removing this one.",
      });
      setOpenMenuId(null);
      return;
    }

    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    setOpenMenuId(null);
    toast.success("Payment method removed");
  };

  const handleAddCard = () => {
    if (!cardholderName || !cardNumber || !expiry || !cvc) {
      toast.error("Please fill in all card details");
      return;
    }

    const last4 = cardNumber.replace(/\s/g, "").slice(-4).padStart(4, "0");
    const [mm, yy] = expiry.split("/").map((v) => v.trim());
    const expMonth = parseInt(mm, 10) || 1;
    const expYear = yy ? 2000 + parseInt(yy, 10) : new Date().getFullYear() + 1;
    const brand: PaymentMethod["brand"] = cardNumber.trim().startsWith("5") ? "Mastercard" : "Visa";

    const newCard: PaymentMethod = {
      id: Date.now(),
      brand,
      last4,
      expMonth,
      expYear,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods((prev) => [...prev, newCard]);
    toast.success("Card added successfully", {
      description: `${brand} ending in ${last4} is now on file.`,
    });

    setCardholderName("");
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setIsAddOpen(false);
  };

  const handleRetryPayment = () => {
    setIsRetrying(true);
    toast.info("Retrying payment...");

    setTimeout(() => {
      setIsRetrying(false);
      setPaymentFailed(false);
      toast.success("Payment retried successfully", {
        description: "Your account is now up to date.",
      });
    }, 1800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing</h1>
          <p className="text-muted-foreground">Manage payment methods and billing settings</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runBillingNow}
            className="px-5 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Run Billing Now</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Card</span>
          </motion.button>
        </div>
      </div>

      {/* Billing Runs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Receipt className="w-5 h-5 text-muted-foreground" />Billing Runs</h3>
        <div className={`relative bg-card border ${getCardThemeByIndex(2).border} rounded-2xl overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-2xl pointer-events-none z-10`} />
          <table className="w-full relative z-10">
            <thead className="bg-white/[0.01] border-b border-white/[0.04]">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Run</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Cycle</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Customers</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Total</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingRuns.map((run) => (
                <tr key={run.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-6 font-mono text-xs text-muted-foreground">{run.id}</td>
                  <td className="py-3 px-6 text-sm">{run.cycle}</td>
                  <td className="py-3 px-6 text-sm text-muted-foreground">{formatCompactNumber(run.customers)}</td>
                  <td className="py-3 px-6 font-medium">{formatMoney(run.totalAmount, "INR", { compact: true })}</td>
                  <td className="py-3 px-6"><StatusBadge status={run.status} /></td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreviewRun(run)} title="Preview" className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {run.status === "failed" && (
                        <button onClick={() => retryRun(run.id)} title="Retry" className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <RotateCw className="w-4 h-4 text-cyan-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Billing calendar: upcoming renewals + charges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`relative p-5 bg-card border ${getCardThemeByIndex(4).border} rounded-2xl`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(4).topAccent} rounded-t-2xl pointer-events-none`} />
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><CalendarClock className="w-4 h-4 text-muted-foreground" />Upcoming Renewals</h4>
          <div className="space-y-2">
            {upcomingRenewals.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/20">
                <div>
                  <div className="font-medium">{r.customer}</div>
                  <div className="text-xs text-muted-foreground">{r.plan} · {r.date}</div>
                </div>
                <span className="font-bold text-primary">{formatMoney(r.amount)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`relative p-5 bg-card border ${getCardThemeByIndex(5).border} rounded-2xl`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(5).topAccent} rounded-t-2xl pointer-events-none`} />
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-muted-foreground" />Upcoming Charges</h4>
          <div className="space-y-2">
            {upcomingCharges.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/20">
                <div>
                  <div className="font-medium">{c.customer}</div>
                  <div className="text-xs text-muted-foreground">{c.reason} · {c.date}</div>
                </div>
                <span className="font-bold text-primary">{formatMoney(c.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!previewRun} onOpenChange={(open) => !open && setPreviewRun(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preview Billing Run</DialogTitle>
            <DialogDescription>{previewRun?.id} — {previewRun?.cycle}</DialogDescription>
          </DialogHeader>
          {previewRun && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 rounded-lg bg-muted/20"><span className="text-muted-foreground">Customers billed</span><span className="font-medium">{formatCompactNumber(previewRun.customers)}</span></div>
              <div className="flex justify-between p-2 rounded-lg bg-muted/20"><span className="text-muted-foreground">Total invoiced</span><span className="font-medium">{formatMoney(previewRun.totalAmount, "INR", { compact: true })}</span></div>
              <div className="flex justify-between p-2 rounded-lg bg-muted/20"><span className="text-muted-foreground">Run date</span><span className="font-medium">{previewRun.runDate}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {paymentFailed && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-4 p-4 sm:p-5 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-rose-200">Payment failed</div>
                <div className="text-sm text-rose-300/80">
                  Your last payment of {formatMoney(2999)} failed on Apr 20, 2026 — please update your
                  payment method to avoid service interruption.
                </div>
              </div>
              <Button
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="bg-rose-500 hover:bg-rose-600 text-white shrink-0"
              >
                {isRetrying ? "Retrying..." : "Retry Payment"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`relative p-6 bg-card border ${getCardThemeByIndex(3).border} rounded-xl overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(3).topAccent} rounded-t-xl pointer-events-none`} />
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(3).bgGlow} pointer-events-none`} />
        <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${getCardThemeByIndex(3).orb10} rounded-full blur-3xl pointer-events-none`} />
        <div className="relative z-10 flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${getCardThemeByIndex(3).iconBg} rounded-lg flex items-center justify-center`}>
            <CalendarClock className={`w-6 h-6 ${getCardThemeByIndex(3).iconColor}`} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Next billing date</div>
            <div className="font-medium">Aug 20, 2026 &middot; {formatMoney(2999)}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        {paymentMethods.map((pm, index) => {
          const theme = getCardThemeByIndex(index);
          return (
            <motion.div
              key={pm.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 bg-card border ${theme.border} rounded-xl transition-colors overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-xl pointer-events-none`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${theme.orb10} rounded-full blur-3xl pointer-events-none`} />

              <div className="relative z-10 flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${theme.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                  <CreditCard className={`w-6 h-6 ${theme.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium flex items-center gap-2 flex-wrap">
                    <span>{pm.brand} ending in {pm.last4}</span>
                    {pm.isDefault && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expires {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}
                  </div>
                </div>

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpenMenuId(openMenuId === pm.id ? null : pm.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  <AnimatePresence>
                    {openMenuId === pm.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
                      >
                        <button
                          disabled={pm.isDefault}
                          onClick={() => handleSetDefault(pm.id)}
                          className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Star className="w-4 h-4" />
                          <span>Set as Default</span>
                        </button>
                        <button
                          onClick={() => handleRemove(pm.id)}
                          className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details below. This is a mock form — no real card data is processed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="Jane Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input
                  id="expiry"
                  placeholder="12/27"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} className="bg-primary hover:bg-primary-dark">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
