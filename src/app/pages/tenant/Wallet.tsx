import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Wallet as WalletIcon, Plus, ArrowUpCircle, ArrowDownCircle, History, Users } from "lucide-react";
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
}

interface WalletTransaction {
  id: number;
  customerName: string;
  type: "topup" | "deduction";
  amount: number;
  date: string;
  note: string;
}

const initialBalances: WalletBalance[] = [
  { id: 1, customerName: "Alice Johnson", balance: 4200, currency: "INR" },
  { id: 2, customerName: "Bob Smith", balance: 1850, currency: "INR" },
  { id: 3, customerName: "Carol White", balance: 9600, currency: "INR" },
  { id: 4, customerName: "David Brown", balance: 500, currency: "INR" },
  { id: 5, customerName: "Emma Davis", balance: 3120, currency: "INR" },
  { id: 6, customerName: "Frank Wilson", balance: 0, currency: "INR" },
];

const initialTransactions: WalletTransaction[] = [
  { id: 1, customerName: "Alice Johnson", type: "topup", amount: 2000, date: "Jul 20, 2026", note: "Manual top-up" },
  { id: 2, customerName: "Bob Smith", type: "deduction", amount: 150, date: "Jul 21, 2026", note: "API usage billing" },
  { id: 3, customerName: "Carol White", type: "topup", amount: 5000, date: "Jul 22, 2026", note: "Quarterly credit purchase" },
  { id: 4, customerName: "David Brown", type: "deduction", amount: 250, date: "Jul 23, 2026", note: "Overage charge" },
  { id: 5, customerName: "Emma Davis", type: "topup", amount: 1000, date: "Jul 24, 2026", note: "Referral bonus" },
  { id: 6, customerName: "Alice Johnson", type: "deduction", amount: 300, date: "Jul 25, 2026", note: "Storage overage" },
  { id: 7, customerName: "Frank Wilson", type: "deduction", amount: 120, date: "Jul 26, 2026", note: "Support add-on" },
  { id: 8, customerName: "Carol White", type: "topup", amount: 1500, date: "Jul 27, 2026", note: "Manual top-up" },
];

export function Wallet() {
  const [balances, setBalances] = useState<WalletBalance[]>(initialBalances);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);

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
        type: "topup",
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-primary/10 to-primary-dark/10 border border-primary/20 rounded-xl"
      >
        <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
        <div className="text-5xl font-bold mb-4">{formatMoney(totalBalance, "INR")}</div>
        <div className="text-sm text-muted-foreground">Across {balances.length} customer wallets</div>
      </motion.div>

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
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded capitalize ${
                          tx.type === "topup"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {tx.type === "topup" ? (
                          <ArrowUpCircle className="w-3 h-3" />
                        ) : (
                          <ArrowDownCircle className="w-3 h-3" />
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-6 font-bold ${
                        tx.type === "topup" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {tx.type === "topup" ? "+" : "-"}
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
    </motion.div>
  );
}
