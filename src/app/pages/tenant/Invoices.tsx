import { motion, AnimatePresence } from "motion/react";
import { FileText, Download, MoreVertical, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { formatMoney, getCurrencySymbol } from "../../components/currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

type InvoiceStatus = "paid" | "pending" | "overdue" | "refunded";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  currency: string;
  date: string;
  status: InvoiceStatus;
  lineItems: LineItem[];
  tax: { rate: number; amount: number };
  subtotal: number;
  total: number;
}

const initialInvoices: Invoice[] = [
  {
    id: "INV-1024",
    customer: "Alice Johnson",
    amount: 99,
    currency: "INR",
    date: "Apr 1, 2026",
    status: "paid",
    lineItems: [{ description: "Pro Plan - Monthly Subscription", quantity: 1, unitPrice: 83.9, total: 83.9 }],
    subtotal: 83.9,
    tax: { rate: 18, amount: 15.1 },
    total: 99,
  },
  {
    id: "INV-1023",
    customer: "Bob Smith",
    amount: 299,
    currency: "INR",
    date: "Apr 1, 2026",
    status: "paid",
    lineItems: [
      { description: "Ultra Pack - Monthly Subscription", quantity: 1, unitPrice: 220, total: 220 },
      { description: "Additional Seats", quantity: 2, unitPrice: 22.88, total: 45.76 },
    ],
    subtotal: 253.39,
    tax: { rate: 18, amount: 45.61 },
    total: 299,
  },
  {
    id: "INV-1022",
    customer: "David Brown",
    amount: 99,
    currency: "INR",
    date: "Mar 28, 2026",
    status: "pending",
    lineItems: [{ description: "Pro Plan - Monthly Subscription", quantity: 1, unitPrice: 83.9, total: 83.9 }],
    subtotal: 83.9,
    tax: { rate: 18, amount: 15.1 },
    total: 99,
  },
  {
    id: "INV-1021",
    customer: "Carol White",
    amount: 499,
    currency: "INR",
    date: "Mar 20, 2026",
    status: "overdue",
    lineItems: [{ description: "Enterprise Plan - Monthly Subscription", quantity: 1, unitPrice: 423.73, total: 423.73 }],
    subtotal: 423.73,
    tax: { rate: 18, amount: 75.27 },
    total: 499,
  },
  {
    id: "INV-1020",
    customer: "Emma Davis",
    amount: 149,
    currency: "INR",
    date: "Mar 15, 2026",
    status: "refunded",
    lineItems: [
      { description: "Growth Plan - Monthly Subscription", quantity: 1, unitPrice: 105.93, total: 105.93 },
      { description: "Extra API Calls (10k)", quantity: 1, unitPrice: 20.4, total: 20.4 },
    ],
    subtotal: 126.33,
    tax: { rate: 18, amount: 22.67 },
    total: 149,
  },
  {
    id: "INV-1019",
    customer: "Frank Miller",
    amount: 199,
    currency: "INR",
    date: "Mar 10, 2026",
    status: "paid",
    lineItems: [{ description: "Pro Plan - Annual Discount Adjustment", quantity: 1, unitPrice: 168.64, total: 168.64 }],
    subtotal: 168.64,
    tax: { rate: 18, amount: 30.36 },
    total: 199,
  },
];

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  overdue: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  refunded: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

function buildInvoiceText(invoice: Invoice): string {
  const symbol = getCurrencySymbol(invoice.currency);
  const lines = [
    `INVOICE ${invoice.id}`,
    `Customer: ${invoice.customer}`,
    `Date: ${invoice.date}`,
    `Status: ${invoice.status.toUpperCase()}`,
    "",
    "Line Items:",
    ...invoice.lineItems.map(
      (item) =>
        `  - ${item.description} | Qty: ${item.quantity} | Unit: ${symbol}${item.unitPrice.toFixed(2)} | Total: ${symbol}${item.total.toFixed(2)}`
    ),
    "",
    `Subtotal: ${symbol}${invoice.subtotal.toFixed(2)}`,
    `GST (${invoice.tax.rate}%): ${symbol}${invoice.tax.amount.toFixed(2)}`,
    `Grand Total: ${symbol}${invoice.total.toFixed(2)}`,
  ];
  return lines.join("\n");
}

function downloadInvoice(invoice: Invoice) {
  const content = buildInvoiceText(invoice);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function Invoices() {
  const theme = getCardThemeByIndex(4);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(initialInvoices);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refundInvoice, setRefundInvoice] = useState<Invoice | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownload = (invoice: Invoice) => {
    downloadInvoice(invoice);
    toast.success(`Invoice ${invoice.id} downloaded`);
  };

  const openRefundDialog = (invoice: Invoice) => {
    setShowMenu(null);
    setRefundInvoice(invoice);
    setRefundAmount(invoice.total.toFixed(2));
    setRefundReason("");
  };

  const closeRefundDialog = () => {
    setRefundInvoice(null);
    setRefundAmount("");
    setRefundReason("");
  };

  const submitRefund = () => {
    if (!refundInvoice) return;
    setInvoicesList((list) =>
      list.map((inv) => (inv.id === refundInvoice.id ? { ...inv, status: "refunded" } : inv))
    );
    toast.success(`Refund issued for ${refundInvoice.id}`, {
      description: `${getCurrencySymbol(refundInvoice.currency)}${refundAmount} refunded${
        refundReason ? ` — ${refundReason}` : ""
      }`,
    });
    closeRefundDialog();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Invoices</h1>
        <p className="text-muted-foreground">View and manage customer invoices</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none z-10`} />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
        {/* Glow orb */}
        <div className={`absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br ${theme.bgGlow} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.01] border-b border-white/[0.04]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground w-8"></th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Invoice</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoicesList.map((invoice, index) => {
                const isExpanded = expandedId === invoice.id;
                return (
                  <>
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => toggleExpand(invoice.id)}
                    >
                      <td className="py-4 px-6">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {invoice.id}
                        </div>
                      </td>
                      <td className="py-4 px-6">{invoice.customer}</td>
                      <td className="py-4 px-6 font-medium">{formatMoney(invoice.total, invoice.currency)}</td>
                      <td className="py-4 px-6 text-muted-foreground">{invoice.date}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs rounded capitalize ${statusStyles[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownload(invoice)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Download invoice"
                          >
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                          <div className="relative inline-block">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowMenu(showMenu === invoice.id ? null : invoice.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </motion.button>
                            <AnimatePresence>
                              {showMenu === invoice.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
                                >
                                  <button
                                    onClick={() => {
                                      setShowMenu(null);
                                      handleDownload(invoice);
                                    }}
                                    className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium"
                                  >
                                    <Download className="w-4 h-4 text-primary" />
                                    <span>Download</span>
                                  </button>
                                  {invoice.status === "paid" && (
                                    <button
                                      onClick={() => openRefundDialog(invoice)}
                                      className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium text-destructive"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                      <span>Issue Refund</span>
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-border bg-muted/10"
                        >
                          <td colSpan={7} className="px-6 py-4">
                            <div className="rounded-xl border border-border bg-card/60 p-4">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-muted-foreground border-b border-border">
                                    <th className="text-left py-2 font-medium">Description</th>
                                    <th className="text-right py-2 font-medium">Qty</th>
                                    <th className="text-right py-2 font-medium">Unit Price</th>
                                    <th className="text-right py-2 font-medium">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {invoice.lineItems.map((item, i) => (
                                    <tr key={i} className="border-b border-border/50 last:border-0">
                                      <td className="py-2">{item.description}</td>
                                      <td className="py-2 text-right">{item.quantity}</td>
                                      <td className="py-2 text-right">{formatMoney(item.unitPrice, invoice.currency)}</td>
                                      <td className="py-2 text-right">{formatMoney(item.total, invoice.currency)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="mt-4 flex flex-col items-end gap-1 text-sm">
                                <div className="flex justify-between w-48">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>{formatMoney(invoice.subtotal, invoice.currency)}</span>
                                </div>
                                <div className="flex justify-between w-48">
                                  <span className="text-muted-foreground">GST ({invoice.tax.rate}%)</span>
                                  <span>{formatMoney(invoice.tax.amount, invoice.currency)}</span>
                                </div>
                                <div className="flex justify-between w-48 font-bold border-t border-border pt-1 mt-1">
                                  <span>Grand Total</span>
                                  <span>{formatMoney(invoice.total, invoice.currency)}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Dialog open={!!refundInvoice} onOpenChange={(open) => !open && closeRefundDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund — {refundInvoice?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="refund-amount">
                Refund Amount ({refundInvoice ? getCurrencySymbol(refundInvoice.currency) : ""})
              </Label>
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                max={refundInvoice?.total}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Full invoice total is {refundInvoice ? formatMoney(refundInvoice.total, refundInvoice.currency) : ""}. Enter a lower amount for a partial refund.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refund-reason">Reason</Label>
              <Textarea
                id="refund-reason"
                placeholder="Reason for issuing this refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
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
    </motion.div>
  );
}
