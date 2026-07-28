import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Send, Clock, Users, Wallet as WalletIcon, Activity, Repeat, FileText, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { StatusBadge } from "../../components/StatusBadge";
import { EmptyState } from "../../components/EmptyState";
import { initialCustomers, SEGMENT_LABELS } from "./Customers";
import type { Note, TimelineEvent } from "../../types/common";

const mockSubscriptions = [
  { id: "sub_1", plan: "Pro", status: "active", mrr: "$99", nextBilling: "Apr 15, 2026" },
];

const mockInvoices = [
  { id: "inv_2031", amount: "$99.00", status: "paid", date: "Mar 15, 2026" },
  { id: "inv_2019", amount: "$99.00", status: "paid", date: "Feb 15, 2026" },
  { id: "inv_2005", amount: "$99.00", status: "overdue", date: "Jan 15, 2026" },
];

const mockWalletTx = [
  { id: "w1", type: "credit", amount: "₹500", date: "Mar 10, 2026" },
  { id: "w2", type: "debit", amount: "₹120", date: "Mar 2, 2026" },
];

const mockUsage = [
  { meter: "API Calls", used: "8,420", limit: "10,000" },
  { meter: "Storage", used: "42 GB", limit: "100 GB" },
];

const mockPayments = [
  { id: "p1", method: "Visa •••• 4242", amount: "$99.00", date: "Mar 15, 2026", status: "success" },
  { id: "p2", method: "Visa •••• 4242", amount: "$99.00", date: "Jan 15, 2026", status: "failed" },
];

const mockTimeline: TimelineEvent[] = [
  { id: "t1", actor: "System", action: "renewed subscription", timestamp: "1 week ago" },
  { id: "t2", actor: "Support", action: "resolved a billing ticket", timestamp: "3 weeks ago" },
  { id: "t3", actor: "System", action: "converted from trial", timestamp: "2 months ago" },
];

const mockNotes: Note[] = [
  { id: "n1", author: "Support Agent", content: "Customer asked about annual billing discount.", createdAt: "5 days ago" },
];

export function CustomerDetails() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const customer = useMemo(() => initialCustomers.find((c) => String(c.id) === customerId), [customerId]);
  const [notes, setNotes] = useState(mockNotes);
  const [draft, setDraft] = useState("");

  if (!customer) {
    return (
      <div className="p-1 sm:p-4">
        <EmptyState
          icon={Users}
          title="Customer not found"
          action={{ label: "Back to Customers", onClick: () => navigate("/tenant/customers") }}
        />
      </div>
    );
  }

  const theme = getCardThemeByIndex(1);

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((prev) => [{ id: `n${prev.length + 1}`, author: "You", content: draft.trim(), createdAt: "just now" }, ...prev]);
    setDraft("");
    toast.success("Note added");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/tenant/customers")} className="p-2 rounded-lg hover:bg-muted/30 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <StatusBadge status={customer.status} />
            {customer.segments.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-muted-foreground border border-white/[0.06]">
                {SEGMENT_LABELS[s]}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{customer.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: customer.mrr },
          { label: "Lifetime Value", value: customer.ltv },
          { label: "Joined", value: customer.joined },
          { label: "Last Active", value: customer.lastActive },
        ].map((stat, i) => {
          const t = getCardThemeByIndex(i);
          return (
            <div key={stat.label} className={`relative overflow-hidden p-4 bg-card border ${t.border} rounded-2xl`}>
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${t.topAccent} rounded-t-2xl pointer-events-none`} />
              <div className="text-lg font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl p-6 overflow-hidden grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <div><div className="text-muted-foreground text-xs mb-1">Plan</div><div className="font-medium">{customer.plan}</div></div>
            <div><div className="text-muted-foreground text-xs mb-1">Status</div><div className="font-medium capitalize">{customer.status}</div></div>
            <div><div className="text-muted-foreground text-xs mb-1">Health</div><div className="font-medium capitalize">{customer.healthScore}</div></div>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <table className="w-full text-sm relative z-10">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]"><tr>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Plan</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">MRR</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Next Billing</th>
              </tr></thead>
              <tbody>
                {mockSubscriptions.map((s) => (
                  <tr key={s.id} className="border-b border-border">
                    <td className="py-3 px-6 flex items-center gap-2"><Repeat className="w-4 h-4 text-primary" />{s.plan}</td>
                    <td className="py-3 px-6"><StatusBadge status={s.status} /></td>
                    <td className="py-3 px-6 font-medium">{s.mrr}</td>
                    <td className="py-3 px-6 text-muted-foreground">{s.nextBilling}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <table className="w-full text-sm relative z-10">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]"><tr>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Invoice</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Date</th>
              </tr></thead>
              <tbody>
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border">
                    <td className="py-3 px-6 flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" />{inv.id}</td>
                    <td className="py-3 px-6 font-medium">{inv.amount}</td>
                    <td className="py-3 px-6"><StatusBadge status={inv.status} /></td>
                    <td className="py-3 px-6 text-muted-foreground">{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <table className="w-full text-sm relative z-10">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]"><tr>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Type</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Date</th>
              </tr></thead>
              <tbody>
                {mockWalletTx.map((tx) => (
                  <tr key={tx.id} className="border-b border-border">
                    <td className="py-3 px-6 flex items-center gap-2 capitalize"><WalletIcon className="w-4 h-4 text-muted-foreground" />{tx.type}</td>
                    <td className={`py-3 px-6 font-medium ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>{tx.type === "credit" ? "+" : "-"}{tx.amount}</td>
                    <td className="py-3 px-6 text-muted-foreground">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl p-6 overflow-hidden space-y-4`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            {mockUsage.map((u) => (
              <div key={u.meter}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{u.meter}</span>
                  <span className="font-medium">{u.used} / {u.limit}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark" style={{ width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <table className="w-full text-sm relative z-10">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]"><tr>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Method</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-xs text-muted-foreground">Date</th>
              </tr></thead>
              <tbody>
                {mockPayments.map((p) => (
                  <tr key={p.id} className="border-b border-border">
                    <td className="py-3 px-6 flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" />{p.method}</td>
                    <td className="py-3 px-6 font-medium">{p.amount}</td>
                    <td className="py-3 px-6"><StatusBadge status={p.status === "success" ? "paid" : "failed"} /></td>
                    <td className="py-3 px-6 text-muted-foreground">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl p-6 overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <div className="space-y-4">
              {mockTimeline.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i < mockTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4">
                    <div className="text-sm font-medium">{event.actor} <span className="text-muted-foreground font-normal">{event.action}</span></div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{event.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl p-6 overflow-hidden space-y-4`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add an internal note…"
                className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <button onClick={addNote} className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/30">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">{note.author}</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <p className="text-sm text-foreground/90">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl p-6 overflow-hidden flex items-center gap-3`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <Activity className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Product activity tracking (page views, feature usage) is not yet wired to a real backend — see Timeline for account-level events.</p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
