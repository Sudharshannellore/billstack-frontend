import { motion, AnimatePresence } from "motion/react";
import { Plus, MoreVertical, Edit, Trash2, Layers, Copy, TrendingUp, TrendingDown, Pause, Play, FileEdit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { BillingStyle } from "../../components/billing/BillingStyleSelector";
import { cn } from "../../components/ui/utils";
import { getCardTheme } from "../../components/cardThemes";
import { formatMoney } from "../../components/currency";

type ProductStatus = "active" | "draft" | "paused";

const STATUS_CYCLE: ProductStatus[] = ["active", "paused", "draft"];

const productsData = [
  {
    id: 1,
    name: "Cloud Storage API",
    description: "Scalable cloud storage with REST API integrations.",
    status: "active" as ProductStatus,
    billingStyle: "subscription" as BillingStyle,
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
    status: "active" as ProductStatus,
    billingStyle: "usage" as BillingStyle,
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
    status: "active" as ProductStatus,
    billingStyle: "credits" as BillingStyle,
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
    status: "active" as ProductStatus,
    billingStyle: "telecom" as BillingStyle,
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
    status: "active" as ProductStatus,
    billingStyle: "usage" as BillingStyle,
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
    status: "active" as ProductStatus,
    billingStyle: "credits" as BillingStyle,
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
    status: "active" as ProductStatus,
    billingStyle: "subscription" as BillingStyle,
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
    status: "draft" as ProductStatus,
    billingStyle: "usage" as BillingStyle,
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
    status: "active" as ProductStatus,
    billingStyle: "telecom" as BillingStyle,
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

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted successfully.");
  };

  const duplicateProduct = (id: number) => {
    setProducts(prev => {
      const source = prev.find(p => p.id === id);
      if (!source) return prev;
      const index = prev.findIndex(p => p.id === id);
      const clone = { ...source, id: nextProductId++, name: `${source.name} (Copy)` };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
    toast.success("Product duplicated successfully.");
  };

  const cycleStatus = (id: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const currentIndex = STATUS_CYCLE.indexOf(p.status);
        const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
        toast.success(`${p.name} is now ${nextStatus}.`);
        return { ...p, status: nextStatus };
      })
    );
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

      {/* Grid of products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {products.map((product) => {
            const theme = getCardTheme(product.name);
            const styles = getProductStyles(product);
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                className={`relative overflow-hidden ${styles.bgClass} border ${styles.border} hover:shadow-xl ${styles.glow} rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-[266px] group`}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${styles.topAccent} rounded-t-2xl pointer-events-none`} />
                {/* Gradient tint */}
                <div className={`absolute inset-0 bg-gradient-to-br ${styles.bgGlow} opacity-30 pointer-events-none`} />
                {/* Glow orb */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 w-full">
                <div className="flex items-start justify-between mb-3">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    getStyleColor(theme)
                  )}>
                    {product.billingStyle}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateProduct(product.id)}
                      title="Duplicate product"
                      className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => cycleStatus(product.id)}
                      title={`Status: ${product.status} (click to change)`}
                      className={cn(
                        "p-1 rounded-lg hover:bg-white/5 transition-colors",
                        product.status === "active" && "text-emerald-400",
                        product.status === "paused" && "text-amber-400",
                        product.status === "draft" && "text-muted-foreground"
                      )}
                    >
                      {product.status === "active" && <Play className="w-3.5 h-3.5" />}
                      {product.status === "paused" && <Pause className="w-3.5 h-3.5" />}
                      {product.status === "draft" && <FileEdit className="w-3.5 h-3.5" />}
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
                            <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                              <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
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

    </motion.div>
  );
}
