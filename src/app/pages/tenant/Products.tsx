import { motion, AnimatePresence } from "motion/react";
import { Plus, MoreVertical, Edit, Trash2, Layers, Copy, TrendingUp, TrendingDown, Archive, ArchiveRestore, FileEdit, CheckCircle2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { BillingStyle } from "../../components/billing/BillingStyleSelector";
import { cn } from "../../components/ui/utils";
import { getCardTheme } from "../../components/cardThemes";
import { formatMoney } from "../../components/currency";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { BulkActionsBar } from "../../components/BulkActionsBar";
import { EmptyState } from "../../components/EmptyState";
import type { ProductStatus } from "../../types/common";

const STATUS_CYCLE: ProductStatus[] = ["published", "draft", "archived"];

export const PRODUCT_CATEGORIES = ["Infrastructure", "Communications", "AI & ML", "Media", "Data"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface ProductRecord {
  id: number;
  name: string;
  description: string;
  status: ProductStatus;
  billingStyle: BillingStyle;
  category: ProductCategory;
  tags: string[];
  bundle: string | null;
  version: number;
  plans: number;
  customers: number;
  currency: string;
  monthlyRevenue: number;
  growthPercent: number;
  adoptionRate: number;
}

export const productsData: ProductRecord[] = [
  {
    id: 1,
    name: "Cloud Storage API",
    description: "Scalable cloud storage with REST API integrations.",
    status: "published",
    billingStyle: "subscription",
    category: "Infrastructure",
    tags: ["storage", "core"],
    bundle: "Developer Bundle",
    version: 3,
    plans: 3,
    customers: 245,
    currency: "INR",
    monthlyRevenue: 128400,
    growthPercent: 12.4,
    adoptionRate: 78,
  },
  {
    id: 2,
    name: "Analytics Platform",
    description: "Real-time analytics and user insights dashboard.",
    status: "published",
    billingStyle: "usage",
    category: "Data",
    tags: ["analytics", "insights"],
    bundle: null,
    version: 5,
    plans: 4,
    customers: 128,
    currency: "USD",
    monthlyRevenue: 9840,
    growthPercent: 6.1,
    adoptionRate: 54,
  },
  {
    id: 3,
    name: "Email Services Gateway",
    description: "Transactional email delivery infrastructure.",
    status: "published",
    billingStyle: "credits",
    category: "Communications",
    tags: ["email", "core"],
    bundle: "Developer Bundle",
    version: 2,
    plans: 2,
    customers: 89,
    currency: "INR",
    monthlyRevenue: 42150,
    growthPercent: -3.8,
    adoptionRate: 41,
  },
  {
    id: 4,
    name: "SMS Gateway",
    description: "Global SMS delivery with real-time status callbacks.",
    status: "published",
    billingStyle: "telecom",
    category: "Communications",
    tags: ["sms", "telecom"],
    bundle: "Communications Bundle",
    version: 4,
    plans: 3,
    customers: 172,
    currency: "USD",
    monthlyRevenue: 15620,
    growthPercent: 9.2,
    adoptionRate: 66,
  },
  {
    id: 5,
    name: "AI Inference Engine",
    description: "Low-latency model inference for production workloads.",
    status: "published",
    billingStyle: "usage",
    category: "AI & ML",
    tags: ["ai", "inference"],
    bundle: null,
    version: 1,
    plans: 4,
    customers: 61,
    currency: "USD",
    monthlyRevenue: 21300,
    growthPercent: 24.7,
    adoptionRate: 33,
  },
  {
    id: 6,
    name: "Video Transcoding Service",
    description: "On-demand video encoding and format conversion pipeline.",
    status: "published",
    billingStyle: "credits",
    category: "Media",
    tags: ["video", "media"],
    bundle: null,
    version: 2,
    plans: 3,
    customers: 47,
    currency: "USD",
    monthlyRevenue: 7420,
    growthPercent: -1.5,
    adoptionRate: 22,
  },
  {
    id: 7,
    name: "Data Pipeline Orchestrator",
    description: "Managed workflow orchestration for ETL and data jobs.",
    status: "published",
    billingStyle: "subscription",
    category: "Data",
    tags: ["etl", "pipeline"],
    bundle: null,
    version: 3,
    plans: 3,
    customers: 98,
    currency: "INR",
    monthlyRevenue: 68900,
    growthPercent: 4.3,
    adoptionRate: 59,
  },
  {
    id: 8,
    name: "Push Notification Service",
    description: "Cross-platform push messaging for mobile and web apps.",
    status: "draft",
    billingStyle: "usage",
    category: "Communications",
    tags: ["push", "mobile"],
    bundle: "Communications Bundle",
    version: 1,
    plans: 2,
    customers: 15,
    currency: "USD",
    monthlyRevenue: 980,
    growthPercent: -8.6,
    adoptionRate: 9,
  },
  {
    id: 9,
    name: "Voice Calling API",
    description: "Programmable voice calls and IVR for global numbers.",
    status: "archived",
    billingStyle: "telecom",
    category: "Communications",
    tags: ["voice", "telecom"],
    bundle: "Communications Bundle",
    version: 6,
    plans: 3,
    customers: 54,
    currency: "USD",
    monthlyRevenue: 11250,
    growthPercent: 2.9,
    adoptionRate: 46,
  },
];

let nextProductId = productsData.length + 1;

export function Products() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [products, setProducts] = useState(productsData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">("all");
  const [selected, setSelected] = useState<number[]>([]);
  const [pendingDelete, setPendingDelete] = useState<ProductRecord | null>(null);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const deleteProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter(p => p.id !== id));
    setSelected(prev => prev.filter(x => x !== id));
    toast.success("Product deleted", { description: product ? `"${product.name}" was removed.` : undefined });
  };

  const duplicateProduct = (id: number) => {
    setProducts(prev => {
      const source = prev.find(p => p.id === id);
      if (!source) return prev;
      const index = prev.findIndex(p => p.id === id);
      const clone: ProductRecord = { ...source, id: nextProductId++, name: `${source.name} (Copy)`, status: "draft", version: 1 };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
    toast.success("Product cloned successfully.");
  };

  const cycleStatus = (id: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const currentIndex = STATUS_CYCLE.indexOf(p.status);
        const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
        const nextVersion = nextStatus === "published" && p.status !== "published" ? p.version + 1 : p.version;
        toast.success(`${p.name} is now ${nextStatus}${nextVersion !== p.version ? ` (v${nextVersion})` : ""}.`);
        return { ...p, status: nextStatus, version: nextVersion };
      })
    );
  };

  const archiveProduct = (id: number) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, status: p.status === "archived" ? "published" : "archived" } : p)));
    const product = products.find(p => p.id === id);
    toast.success(product?.status === "archived" ? "Product restored." : "Product archived.");
  };

  const bulkArchive = () => {
    setProducts(prev => prev.map(p => (selected.includes(p.id) ? { ...p, status: "archived" } : p)));
    toast.success(`${selected.length} products archived.`);
    setSelected([]);
  };

  const bulkPublish = () => {
    setProducts(prev => prev.map(p => (selected.includes(p.id) ? { ...p, status: "published" } : p)));
    toast.success(`${selected.length} products published.`);
    setSelected([]);
  };

  const bulkDelete = () => {
    setProducts(prev => prev.filter(p => !selected.includes(p.id)));
    toast.success(`${selected.length} products deleted.`);
    setSelected([]);
    setPendingBulkDelete(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (query.trim() && !`${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [products, statusFilter, categoryFilter, query]);

  const toggleSelect = (id: number) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const getStyleColor = (theme: ReturnType<typeof getCardTheme>) =>
    cn("bg-white/5", theme.iconColor, theme.border);

  const getProductStyles = (product: (typeof productsData)[number]) => {
    const theme = getCardTheme(product.name);
    return {
      border: theme.border,
      glow: theme.glow,
      bgClass: theme.bgClass,
      bgGlow: theme.bgGlow,
      topAccent: theme.topAccent,
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Product Catalog</h1>
          <p className="text-muted-foreground text-sm">Create, deploy, and organize billing configurations for your SaaS inventory.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/tenant/products/create")}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary-dark hover:to-violet-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length },
          { label: "Published", value: products.filter(p => p.status === "published").length },
          { label: "Draft", value: products.filter(p => p.status === "draft").length },
          { label: "Archived", value: products.filter(p => p.status === "archived").length },
        ].map((stat, i) => {
          const t = getCardTheme(stat.label);
          return (
            <div key={stat.label} className={`relative overflow-hidden p-4 bg-card border ${t.border} rounded-2xl`}>
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${t.topAccent} rounded-t-2xl pointer-events-none`} />
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, tags…"
            className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "all")}
          className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground outline-none"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | "all")}
          className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground outline-none"
        >
          <option value="all">All categories</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Grid of products */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No products match your filters"
          description="Try adjusting your search or filters, or create a new product."
          action={{ label: "Add Product", onClick: () => navigate("/tenant/products/create") }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const theme = getCardTheme(product.name);
              const styles = getProductStyles(product);
              const isSelected = selected.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/tenant/products/${product.id}`)}
                  className={`relative overflow-hidden ${styles.bgClass} border ${isSelected ? "border-primary" : styles.border} hover:shadow-xl ${styles.glow} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[300px] group cursor-pointer`}
                >
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${styles.topAccent} rounded-t-2xl pointer-events-none`} />
                  {/* Gradient tint */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.bgGlow} opacity-30 pointer-events-none`} />
                  {/* Glow orb */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 w-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-border accent-[var(--color-primary)]"
                      />
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStyleColor(theme)
                      )}>
                        {product.billingStyle}
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => duplicateProduct(product.id)}
                        title="Clone product"
                        className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => cycleStatus(product.id)}
                        title={`Status: ${product.status} (click to change)`}
                        className={cn(
                          "p-1 rounded-lg hover:bg-white/5 transition-colors",
                          product.status === "published" && "text-emerald-400",
                          product.status === "draft" && "text-muted-foreground",
                          product.status === "archived" && "text-amber-400"
                        )}
                      >
                        {product.status === "published" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {product.status === "draft" && <FileEdit className="w-3.5 h-3.5" />}
                        {product.status === "archived" && <ArchiveRestore className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => archiveProduct(product.id)}
                        title={product.status === "archived" ? "Restore product" : "Archive product"}
                        className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowMenu(showMenu === product.id ? null : product.id)}
                          className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {showMenu === product.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
                            <div className="absolute right-0 mt-1 w-32 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-xl py-1.5 z-20">
                              <button
                                onClick={() => { setShowMenu(null); navigate(`/tenant/products/${product.id}`); }}
                                className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                              >
                                <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => { setShowMenu(null); setPendingDelete(product); }}
                                className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-muted-foreground border border-white/[0.06]">{product.category}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-muted-foreground border border-white/[0.06]">v{product.version}</span>
                    {product.bundle && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">{product.bundle}</span>
                    )}
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.03] text-muted-foreground/80 border border-white/[0.04]">#{tag}</span>
                    ))}
                  </div>

                  {/* Revenue + trend */}
                  <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                    <span className="font-bold text-white">{formatMoney(product.monthlyRevenue, product.currency)}</span>
                    <span className="text-muted-foreground font-light">this month</span>
                    <span className={cn(
                      "flex items-center gap-0.5 font-semibold ml-1",
                      product.growthPercent >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {product.growthPercent >= 0
                        ? <TrendingUp className="w-3 h-3" />
                        : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(product.growthPercent).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Lower statistics */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{product.plans} active plans</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="text-white font-bold">{product.customers}</span> subscribers
                    </div>
                  </div>

                  {/* Adoption rate bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1 text-[10px] text-muted-foreground font-medium">
                      <span>Adoption rate</span>
                      <span className="text-white font-bold">{product.adoptionRate}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${styles.topAccent}`}
                        style={{ width: `${Math.min(100, Math.max(0, product.adoptionRate))}%` }}
                      />
                    </div>
                  </div>
                </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <BulkActionsBar
        count={selected.length}
        onClear={() => setSelected([])}
        actions={[
          { label: "Publish", icon: CheckCircle2, onClick: bulkPublish },
          { label: "Archive", icon: Archive, onClick: bulkArchive },
          { label: "Delete", icon: Trash2, onClick: () => setPendingBulkDelete(true), destructive: true },
        ]}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete product?"
        description={pendingDelete ? `This will permanently delete "${pendingDelete.name}". This action cannot be undone.` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (pendingDelete) deleteProduct(pendingDelete.id);
          setPendingDelete(null);
        }}
      />

      <ConfirmDialog
        open={pendingBulkDelete}
        onOpenChange={setPendingBulkDelete}
        title={`Delete ${selected.length} products?`}
        description="This will permanently delete the selected products. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={bulkDelete}
      />
    </motion.div>
  );
}
