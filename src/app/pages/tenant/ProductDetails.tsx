import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Layers, Users, TrendingUp, DollarSign, Send, Clock, Edit, Package } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { getCardTheme, getCardThemeByIndex } from "../../components/cardThemes";
import { formatMoney, formatCompactNumber } from "../../components/currency";
import { StatusBadge } from "../../components/StatusBadge";
import { EmptyState } from "../../components/EmptyState";
import { productsData } from "./Products";
import type { Note, TimelineEvent } from "../../types/common";

const mockTimeline: TimelineEvent[] = [
  { id: "t1", actor: "Priya Sharma", action: "Published product", timestamp: "2 days ago" },
  { id: "t2", actor: "System", action: "Version bumped to v3", description: "Pricing rules updated on Pro plan", timestamp: "5 days ago" },
  { id: "t3", actor: "Arjun Rao", action: "Added plan", description: "Enterprise plan created", timestamp: "2 weeks ago" },
  { id: "t4", actor: "Priya Sharma", action: "Created product", timestamp: "1 month ago" },
];

const mockNotes: Note[] = [
  { id: "n1", author: "Priya Sharma", content: "Confirmed with finance that INR pricing stays flat through Q3.", createdAt: "3 days ago" },
  { id: "n2", author: "Arjun Rao", content: "Customers on legacy plan should be migrated before we archive v2.", createdAt: "1 week ago" },
];

export function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => productsData.find((p) => String(p.id) === productId), [productId]);
  const [notes, setNotes] = useState(mockNotes);
  const [draft, setDraft] = useState("");

  if (!product) {
    return (
      <div className="p-1 sm:p-4">
        <EmptyState
          icon={Package}
          title="Product not found"
          description="This product may have been deleted."
          action={{ label: "Back to Products", onClick: () => navigate("/tenant/products") }}
        />
      </div>
    );
  }

  const theme = getCardTheme(product.name);

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((prev) => [{ id: `n${prev.length + 1}`, author: "You", content: draft.trim(), createdAt: "just now" }, ...prev]);
    setDraft("");
    toast.success("Note added");
  };

  const stats = [
    { label: "Monthly Revenue", value: formatMoney(product.monthlyRevenue, product.currency, { compact: true }), icon: DollarSign },
    { label: "Subscribers", value: formatCompactNumber(product.customers), icon: Users },
    { label: "Active Plans", value: product.plans, icon: Layers },
    { label: "Adoption Rate", value: `${product.adoptionRate}%`, icon: TrendingUp },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-1 sm:p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/tenant/products")}
          className="p-2 rounded-lg hover:bg-muted/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <StatusBadge status={product.status} />
            <span className="text-xs text-muted-foreground">v{product.version}</span>
          </div>
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </div>
        <button
          onClick={() => toast.info("Editing product", { description: "Open the product form to edit fields." })}
          className="px-4 py-2 bg-transparent border border-border rounded-lg text-foreground text-sm font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const t = getCardThemeByIndex(i);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden p-4 bg-card border ${t.border} rounded-2xl flex items-center gap-3`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${t.topAccent} rounded-t-2xl pointer-events-none`} />
              <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${t.iconBg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${t.iconColor}`} />
              </div>
              <div className="relative z-10">
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className={`relative bg-card border ${theme.border} rounded-2xl p-6 overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Category</div>
                <div className="font-medium">{product.category}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Billing Style</div>
                <div className="font-medium capitalize">{product.billingStyle}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Bundle</div>
                <div className="font-medium">{product.bundle ?? "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Currency</div>
                <div className="font-medium">{product.currency}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Version</div>
                <div className="font-medium">v{product.version}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-muted-foreground border border-white/[0.06]">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
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
                    <div className="text-sm font-medium">
                      {event.actor} <span className="text-muted-foreground font-normal">{event.action}</span>
                    </div>
                    {event.description && <div className="text-xs text-muted-foreground mt-0.5">{event.description}</div>}
                    <div className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.timestamp}
                    </div>
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
                className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <button
                onClick={addNote}
                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/30"
              >
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
      </Tabs>
    </motion.div>
  );
}
