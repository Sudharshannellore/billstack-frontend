import { useState } from "react";
import { motion } from "motion/react";
import {
  CreditCard,
  FileText,
  Download,
  Sparkles,
  Gauge,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { getCardThemeByIndex, getCardTheme } from "../../components/cardThemes";
import { formatMoney, getCurrencySymbol } from "../../components/currency";
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

// --- Mock data (self-contained, single end-customer view) ---

const mockCustomer = {
  name: "Priya Sharma",
  company: "Northwind Traders Pvt. Ltd.",
};

const mockPlan = {
  name: "Growth Plan",
  price: 2999,
  currency: "INR",
  cycle: "Monthly",
  nextRenewal: "Aug 20, 2026",
};

const mockCard = {
  brand: "Visa" as "Visa" | "Mastercard",
  last4: "4242",
  expMonth: 12,
  expYear: 2027,
};

interface CustomerInvoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue" | "refunded";
}

const mockInvoices: CustomerInvoice[] = [
  { id: "INV-2041", date: "Jul 20, 2026", amount: 2999, currency: "INR", status: "paid" },
  { id: "INV-2033", date: "Jun 20, 2026", amount: 2999, currency: "INR", status: "paid" },
  { id: "INV-2024", date: "May 20, 2026", amount: 2999, currency: "INR", status: "paid" },
  { id: "INV-2015", date: "Apr 20, 2026", amount: 2499, currency: "INR", status: "refunded" },
];

const statusStyles: Record<CustomerInvoice["status"], string> = {
  paid: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  overdue: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  refunded: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

const mockUsage = {
  label: "API Calls",
  used: 76500,
  quota: 100000,
};

function downloadInvoiceFile(invoice: CustomerInvoice) {
  const symbol = getCurrencySymbol(invoice.currency);
  const lines = [
    `INVOICE ${invoice.id}`,
    `Account: ${mockCustomer.company}`,
    `Date: ${invoice.date}`,
    `Status: ${invoice.status.toUpperCase()}`,
    "",
    `Amount: ${symbol}${invoice.amount.toFixed(2)}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function CustomerPortal() {
  const [card, setCard] = useState(mockCard);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const planTheme = getCardTheme(mockPlan.name);
  const paymentTheme = getCardThemeByIndex(1);
  const usageTheme = getCardThemeByIndex(2);

  const usagePercent = Math.min(100, Math.round((mockUsage.used / mockUsage.quota) * 100));

  const handleUpdateCard = () => {
    if (!cardholderName || !cardNumber || !expiry || !cvc) {
      toast.error("Please fill in all card details");
      return;
    }

    const last4 = cardNumber.replace(/\s/g, "").slice(-4).padStart(4, "0");
    const [mm, yy] = expiry.split("/").map((v) => v.trim());
    const expMonth = parseInt(mm, 10) || 1;
    const expYear = yy ? 2000 + parseInt(yy, 10) : new Date().getFullYear() + 1;
    const brand: typeof card.brand = cardNumber.trim().startsWith("5") ? "Mastercard" : "Visa";

    setCard({ brand, last4, expMonth, expYear });
    toast.success("Payment method updated", {
      description: `${brand} ending in ${last4} is now on file.`,
    });

    setCardholderName("");
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setIsUpdateOpen(false);
  };

  const handleDownload = (invoice: CustomerInvoice) => {
    downloadInvoiceFile(invoice);
    toast.success(`Invoice ${invoice.id} downloaded`);
  };

  const handleUpgrade = () => {
    toast.info("Upgrade flow coming soon", {
      description: "This is a mock action — no plan change was made.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Lightweight top nav — distinct from tenant admin's full sidebar shell */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm">
              B
            </div>
            <span>Billstack Customer Portal</span>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6 py-8 space-y-8"
      >
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back, {mockCustomer.name}</h1>
          <p className="text-muted-foreground">{mockCustomer.company}</p>
        </div>

        {/* Current plan summary */}
        <section
          className={`relative p-6 bg-card border ${planTheme.border} rounded-xl overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${planTheme.topAccent} rounded-t-xl pointer-events-none`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${planTheme.bgGlow} pointer-events-none`} />
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${planTheme.orb10} rounded-full blur-3xl pointer-events-none`} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${planTheme.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                <Sparkles className={`w-6 h-6 ${planTheme.iconColor}`} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Plan</div>
                <div className="text-lg font-semibold">{mockPlan.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatMoney(mockPlan.price, mockPlan.currency)} / {mockPlan.cycle} &middot; renews{" "}
                  {mockPlan.nextRenewal}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpgrade}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 shrink-0"
            >
              Upgrade Plan
            </motion.button>
          </div>
        </section>

        {/* Payment method */}
        <section
          className={`relative p-6 bg-card border ${paymentTheme.border} rounded-xl overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${paymentTheme.topAccent} rounded-t-xl pointer-events-none`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${paymentTheme.bgGlow} pointer-events-none`} />
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${paymentTheme.orb10} rounded-full blur-3xl pointer-events-none`} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${paymentTheme.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                <CreditCard className={`w-6 h-6 ${paymentTheme.iconColor}`} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Payment Method</div>
                <div className="font-medium">
                  {card.brand} ending in {card.last4}
                </div>
                <div className="text-sm text-muted-foreground">
                  Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsUpdateOpen(true)} className="shrink-0">
              Update Payment Method
            </Button>
          </div>
        </section>

        {/* Usage summary */}
        <section
          className={`relative p-6 bg-card border ${usageTheme.border} rounded-xl overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${usageTheme.topAccent} rounded-t-xl pointer-events-none`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${usageTheme.bgGlow} pointer-events-none`} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${usageTheme.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                <Gauge className={`w-5 h-5 ${usageTheme.iconColor}`} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">This billing period</div>
                <div className="font-medium">{mockUsage.label} Usage</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {mockUsage.used.toLocaleString("en-IN")} / {mockUsage.quota.toLocaleString("en-IN")} calls
              </span>
              <span className="font-medium">{usagePercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${usageTheme.topAccent}`}
              />
            </div>
          </div>
        </section>

        {/* Invoice history */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Invoice History</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.01] border-b border-white/[0.04]">
                  <tr>
                    <th className="text-left py-3 px-5 text-sm font-medium text-muted-foreground">Invoice</th>
                    <th className="text-left py-3 px-5 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-5 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-5 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-5 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-5 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {invoice.id}
                        </div>
                      </td>
                      <td className="py-3 px-5 text-muted-foreground">{invoice.date}</td>
                      <td className="py-3 px-5 font-medium">{formatMoney(invoice.amount, invoice.currency)}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-1 text-xs rounded capitalize ${statusStyles[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(invoice)}
                          className="gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </motion.main>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Enter your new card details below. This is a mock form — no real card data is processed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="Priya Sharma"
                value={cardholderName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardholderName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input
                  id="expiry"
                  placeholder="12/27"
                  value={expiry}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCvc(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCard} className="bg-primary hover:bg-primary-dark">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
