import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Wallet as WalletIcon, Plus, ArrowUpCircle, ArrowDownCircle, History, Users, RefreshCw, Timer, Gift, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { formatMoney, getCurrencySymbol } from "../../components/currency";

interface WalletBalance {
  id: number;
  customerName: string;
  balance: number;
  currency: string;
  autoRecharge: boolean;
  rechargeThreshold: number;
  rechargeAmount: number;
}

type LedgerType = "credit" | "debit" | "refund" | "adjustment" | "bonus" | "expiration";

interface WalletTransaction {
  id: number;
  customerName: string;
  type: LedgerType;
  amount: number;
  date: string;
  note: string;
}

const LEDGER_META: Record<LedgerType, { label: string; sign: "+" | "-"; className: string }> = {
  credit: { label: "credit", sign: "+", className: "bg-emerald-500/10 text-emerald-400" },
  debit: { label: "debit", sign: "-", className: "bg-rose-500/10 text-rose-400" },
  refund: { label: "refund", sign: "+", className: "bg-cyan-500/10 text-cyan-400" },
  adjustment: { label: "adjustment", sign: "+", className: "bg-violet-500/10 text-violet-400" },
  bonus: { label: "bonus", sign: "+", className: "bg-amber-500/10 text-amber-400" },
  expiration: { label: "expiration", sign: "-", className: "bg-muted text-muted-foreground" },
};

const initialBalances: WalletBalance[] = [
  { id: 1, customerName: "Alice Johnson", balance: 4200, currency: "INR", autoRecharge: true, rechargeThreshold: 500, rechargeAmount: 2000 },
  { id: 2, customerName: "Bob Smith", balance: 1850, currency: "INR", autoRecharge: false, rechargeThreshold: 200, rechargeAmount: 1000 },
  { id: 3, customerName: "Carol White", balance: 9600, currency: "INR", autoRecharge: true, rechargeThreshold: 1000, rechargeAmount: 5000 },
  { id: 4, customerName: "David Brown", balance: 500, currency: "INR", autoRecharge: false, rechargeThreshold: 100, rechargeAmount: 500 },
  { id: 5, customerName: "Emma Davis", balance: 3120, currency: "INR", autoRecharge: true, rechargeThreshold: 300, rechargeAmount: 1500 },
  { id: 6, customerName: "Frank Wilson", balance: 0, currency: "INR", autoRecharge: false, rechargeThreshold: 0, rechargeAmount: 0 },
];

const initialTransactions: WalletTransaction[] = [
  { id: 1, customerName: "Alice Johnson", type: "credit", amount: 2000, date: "Jul 20, 2026", note: "Manual top-up" },
  { id: 2, customerName: "Bob Smith", type: "debit", amount: 150, date: "Jul 21, 2026", note: "API usage billing" },
  { id: 3, customerName: "Carol White", type: "credit", amount: 5000, date: "Jul 22, 2026", note: "Quarterly credit purchase" },
  { id: 4, customerName: "David Brown", type: "debit", amount: 250, date: "Jul 23, 2026", note: "Overage charge" },
  { id: 5, customerName: "Emma Davis", type: "bonus", amount: 1000, date: "Jul 24, 2026", note: "Referral bonus" },
  { id: 6, customerName: "Alice Johnson", type: "debit", amount: 300, date: "Jul 25, 2026", note: "Storage overage" },
  { id: 7, customerName: "Frank Wilson", type: "expiration", amount: 120, date: "Jul 26, 2026", note: "Unused credits expired" },
  { id: 8, customerName: "Carol White", type: "refund", amount: 1500, date: "Jul 27, 2026", note: "Duplicate charge refund" },
  { id: 9, customerName: "Bob Smith", type: "adjustment", amount: 80, date: "Jul 27, 2026", note: "Support goodwill adjustment" },
];

export function Wallet() {
  const [balances, setBalances] = useState<WalletBalance[]>(initialBalances);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rechargeRulesOpen, setRechargeRulesOpen] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(true);
  const [expirationDays, setExpirationDays] = useState(180);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);

  const ledgerTotals = useMemo(() => {
    const totals: Record<LedgerType, number> = { credit: 0, debit: 0, refund: 0, adjustment: 0, bonus: 0, expiration: 0 };
    for (const tx of transactions) totals[tx.type] += tx.amount;
    return totals;
  }, [transactions]);

  const toggleAutoRecharge = (id: number) => {
    setBalances((prev) => prev.map((b) => (b.id === id ? { ...b, autoRecharge: !b.autoRecharge } : b)));
  };

  const resetForm = () => {
    setSelectedCustomerId("");
    setAmount("");
    setNote("");
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleAddCredits = () => {
    const parsedAmount = Number(amount);
    const customer = balances.find((b) => String(b.id) === selectedCustomerId);

    if (!customer || !parsedAmount || parsedAmount <= 0) {
      toast.error("Invalid top-up", {
        description: "Please select a customer and enter a valid amount.",
      });
      return;
    }

    setBalances((prev) =>
      prev.map((b) =>
        b.id === customer.id ? { ...b, balance: b.balance + parsedAmount } : b
      )
    );

    setTransactions((prev) => [
      {
        id: Date.now(),
        customerName: customer.customerName,
        type: "credit",
        amount: parsedAmount,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        note: note.trim() || "Manual top-up",
      },
      ...prev,
    ]);

    toast.success("Credits added", {
      description: `${formatMoney(parsedAmount, customer.currency)} added to ${customer.customerName}'s wallet.`,
    });

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage customer credit balances</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRechargeRulesOpen(true)}
            className="px-5 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Recharge Rules</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDialogOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Credits</span>
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-primary/10 to-primary-dark/10 border border-primary/20 rounded-xl"
      >
        <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
        <div className="text-5xl font-bold mb-4">{formatMoney(totalBalance, "INR")}</div>
        <div className="text-sm text-muted-foreground">Across {balances.length} customer wallets</div>
      </motion.div>

      {/* Wallet analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {([
          { key: "credit", label: "Credits", icon: ArrowUpCircle },
          { key: "debit", label: "Debits", icon: ArrowDownCircle },
          { key: "refund", label: "Refunds", icon: RotateCcw },
          { key: "adjustment", label: "Adjustments", icon: SlidersHorizontal },
          { key: "bonus", label: "Bonuses", icon: Gift },
          { key: "expiration", label: "Expired", icon: Timer },
        ] as { key: LedgerType; label: string; icon: typeof ArrowUpCircle }[]).map((stat, i) => {
          const t = getCardThemeByIndex(i);
          return (
            <div key={stat.key} className={`relative overflow-hidden p-3 bg-card border ${t.border} rounded-xl`}>
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${t.topAccent} pointer-events-none`} />
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-3.5 h-3.5 ${t.iconColor}`} />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</span>
              </div>
              <div className="text-lg font-black text-white">{formatMoney(ledgerTotals[stat.key], "INR")}</div>
            </div>
          );
        })}
      </div>

      {/* Expiration policy */}
      <div className="relative p-5 bg-card border border-border rounded-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="font-medium text-sm">Credit Expiration Policy</div>
            <div className="text-xs text-muted-foreground">Unused wallet credits expire automatically after a fixed window.</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={expirationDays}
            onChange={(e) => setExpirationDays(Number(e.target.value))}
            disabled={!expirationEnabled}
            className="w-20 px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none disabled:opacity-50"
          />
          <span className="text-xs text-muted-foreground">days</span>
          <Switch checked={expirationEnabled} onCheckedChange={setExpirationEnabled} />
        </div>
      </div>

      {/* Per-customer balances */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Customer Balances</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {balances.map((customer, index) => {
            const theme = getCardThemeByIndex(index);
            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`relative p-6 bg-card border ${theme.border} rounded-2xl hover:shadow-xl transition-all overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme.orb10} rounded-full blur-3xl pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${theme.iconBg} rounded-xl flex items-center justify-center`}>
                      <WalletIcon className={`w-5 h-5 ${theme.iconColor}`} />
                    </div>
                    {customer.autoRecharge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5" /> Auto
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="text-lg font-bold">{customer.customerName}</h3>
                    <p className="text-sm text-muted-foreground">Wallet ID #{customer.id}</p>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/[0.06] pt-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1 italic">Balance</div>
                      <div className="font-bold text-2xl">{formatMoney(customer.balance, customer.currency)}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground uppercase font-semibold">
                      {customer.currency}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative bg-card border ${getCardThemeByIndex(3).border} rounded-2xl overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(3).topAccent} rounded-t-2xl pointer-events-none z-10`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardThemeByIndex(3).bgGlow} pointer-events-none`} />

          <div className="relative z-10 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">{tx.customerName}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded capitalize ${LEDGER_META[tx.type].className}`}>
                        {LEDGER_META[tx.type].sign === "+" ? (
                          <ArrowUpCircle className="w-3 h-3" />
                        ) : (
                          <ArrowDownCircle className="w-3 h-3" />
                        )}
                        {LEDGER_META[tx.type].label}
                      </span>
                    </td>
                    <td className={`py-4 px-6 font-bold ${LEDGER_META[tx.type].sign === "+" ? "text-emerald-400" : "text-rose-400"}`}>
                      {LEDGER_META[tx.type].sign}
                      {formatMoney(tx.amount, "INR")}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{tx.date}</td>
                    <td className="py-4 px-6 text-muted-foreground">{tx.note}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add Credits Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>
              Top up a customer's wallet balance. This adds to their existing credits immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger className="h-11 bg-card">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {balances.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.customerName} ({formatMoney(customer.balance, customer.currency)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount ({getCurrencySymbol("INR")})</Label>
              <Input
                type="number"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11 bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Input
                placeholder="e.g. Manual top-up"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-11 bg-card"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => handleDialogChange(false)} className="font-bold">
              Cancel
            </Button>
            <Button
              onClick={handleAddCredits}
              disabled={!selectedCustomerId || !amount}
              className="bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20"
            >
              Add Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recharge Rules Dialog */}
      <Dialog open={rechargeRulesOpen} onOpenChange={setRechargeRulesOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              <span>Auto Recharge Rules</span>
            </DialogTitle>
            <DialogDescription>
              When a customer's balance falls below the threshold, automatically top up by the configured amount.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {balances.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{b.customerName}</div>
                  <div className="text-xs text-muted-foreground">
                    Below {formatMoney(b.rechargeThreshold, b.currency)} → top up {formatMoney(b.rechargeAmount, b.currency)}
                  </div>
                </div>
                <Switch checked={b.autoRecharge} onCheckedChange={() => toggleAutoRecharge(b.id)} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
