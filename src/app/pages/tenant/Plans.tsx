import { motion } from "motion/react";
import { Plus, CreditCard, MoreVertical, Edit, Copy, Trash2, History, CheckCircle, ListChecks, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Switch } from "../../components/ui/switch";

interface PlanVersion {
  version: number;
  price: string;
  changedDate: string;
  note: string;
}

const plans = [
  {
    id: 1,
    name: "Starter",
    product: "Cloud Storage API",
    type: "Subscription",
    price: "₹29/month",
    customers: 156,
    customerTrend: 8.4,
    status: "active",
    version: 1,
    subscriberCountAtVersion: 156,
    features: [
      "Up to 1,000 API calls/mo",
      "1 team seat",
      "Community support",
      "Basic analytics dashboard",
    ],
    versionHistory: [
      { version: 1, price: "₹29/mo", changedDate: "Jan 1, 2026", note: "Initial launch pricing." },
    ] as PlanVersion[],
  },
  {
    id: 2,
    name: "Pro",
    product: "Cloud Storage API",
    type: "Hybrid",
    price: "₹99/month + usage",
    customers: 89,
    customerTrend: -3.2,
    status: "active",
    version: 2,
    subscriberCountAtVersion: 61,
    features: [
      "Up to 10,000 API calls/mo",
      "5 team seats",
      "Priority support",
      "Custom branding",
    ],
    versionHistory: [
      { version: 1, price: "₹79/mo", changedDate: "Jan 1, 2026", note: "Initial launch pricing." },
      { version: 2, price: "₹99/mo", changedDate: "Mar 1, 2026", note: "Existing subscribers on v1 kept their ₹79/mo rate." },
    ] as PlanVersion[],
  },
  {
    id: 3,
    name: "Pay as you go",
    product: "Analytics Platform",
    type: "Usage-based",
    price: "₹0.05/query",
    customers: 234,
    customerTrend: 15.7,
    status: "active",
    version: 1,
    subscriberCountAtVersion: 234,
    features: [
      "Pay only for what you use",
      "No monthly minimum",
      "Standard support",
      "Usage analytics dashboard",
    ],
    versionHistory: [
      { version: 1, price: "₹0.05/query", changedDate: "Feb 10, 2026", note: "Initial launch pricing." },
    ] as PlanVersion[],
  },
  {
    id: 4,
    name: "Enterprise",
    product: "Cloud Storage API",
    type: "Subscription",
    price: "₹499/month",
    customers: 23,
    customerTrend: -1.5,
    status: "active",
    version: 3,
    subscriberCountAtVersion: 9,
    features: [
      "Unlimited API calls",
      "Unlimited team seats",
      "Dedicated account manager",
      "Custom branding",
      "SLA-backed 24/7 support",
    ],
    versionHistory: [
      { version: 1, price: "₹399/mo", changedDate: "Nov 1, 2025", note: "Initial launch pricing." },
      { version: 2, price: "₹449/mo", changedDate: "Feb 1, 2026", note: "Existing subscribers on v1 kept their ₹399/mo rate." },
      { version: 3, price: "₹499/mo", changedDate: "May 15, 2026", note: "Existing subscribers on v2 kept their ₹449/mo rate." },
    ] as PlanVersion[],
  },
];

function parseMrrContribution(price: string, customers: number): string {
  const match = price.match(/[\d,.]+/);
  if (!match) return "Variable";
  const numeric = parseFloat(match[0].replace(/,/g, ""));
  if (Number.isNaN(numeric)) return "Variable";
  // Usage-based / per-unit pricing (not a flat monthly rate) doesn't cleanly multiply by customers
  if (/query|call|unit|request|usage/i.test(price) && !/\/month|\/mo\b/i.test(price)) {
    return "Variable";
  }
  const mrr = numeric * customers;
  return `₹${mrr.toLocaleString("en-IN")}`;
}

export function Plans() {
  const theme = getCardThemeByIndex(5);
  const [plansList, setPlansList] = useState(plans);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [historyPlanId, setHistoryPlanId] = useState<number | null>(null);
  const [featuresPlanId, setFeaturesPlanId] = useState<number | null>(null);
  const navigate = useNavigate();

  const historyPlan = plansList.find((p) => p.id === historyPlanId) ?? null;
  const featuresPlan = plansList.find((p) => p.id === featuresPlanId) ?? null;

  const handleDelete = (name: string) => {
    setShowMenu(null);
    toast.success(`"${name}" deleted`);
  };

  const handleDuplicate = (planId: number) => {
    setShowMenu(null);
    setPlansList((prev) => {
      const source = prev.find((p) => p.id === planId);
      if (!source) return prev;
      const newId = Math.max(...prev.map((p) => p.id)) + 1;
      const clone = { ...source, id: newId, name: `${source.name} (Copy)` };
      toast.success(`"${clone.name}" created`);
      return [...prev, clone];
    });
  };

  const handleToggleStatus = (planId: number) => {
    setPlansList((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const nextStatus = p.status === "active" ? "paused" : "active";
        toast.success(`"${p.name}" is now ${nextStatus}`);
        return { ...p, status: nextStatus };
      }),
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Plans</h1>
          <p className="text-muted-foreground">Manage pricing plans for your products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/tenant/plans/create")}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Plan</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden animate-fadeIn`}
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
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Plan Name
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Product
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Customers
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                MRR Contribution
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Features
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {plansList.map((plan, index) => (
              <motion.tr
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-muted/30 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{plan.name}</span>
                      {plan.version > 1 && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wide">
                          v{plan.version}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-muted-foreground">{plan.product}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {plan.type}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium">{plan.price}</td>
                <td className="py-4 px-6 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span>{plan.customers}</span>
                    {plan.customerTrend >= 0 ? (
                      <span className="flex items-center gap-0.5 text-[11px] font-medium text-success">
                        <TrendingUp className="w-3 h-3" />
                        {plan.customerTrend}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[11px] font-medium text-rose-500">
                        <TrendingDown className="w-3 h-3" />
                        {Math.abs(plan.customerTrend)}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 font-medium">
                  {parseMrrContribution(plan.price, plan.customers)}
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => setFeaturesPlanId(plan.id)}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>{plan.features.length} features</span>
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={plan.status === "active"}
                      onCheckedChange={() => handleToggleStatus(plan.id)}
                    />
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        plan.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="relative flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDuplicate(plan.id)}
                      title="Duplicate"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu(showMenu === plan.id ? null : plan.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    {showMenu === plan.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setShowMenu(null);
                            navigate("/tenant/plans/create");
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(null);
                            setHistoryPlanId(plan.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <History className="w-4 h-4" />
                          <span>View Version History</span>
                        </button>
                        <button
                          onClick={() => handleDelete(plan.name)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>

      {/* Version History Dialog */}
      <Dialog open={historyPlanId !== null} onOpenChange={(open) => !open && setHistoryPlanId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <span>{historyPlan?.name} — Version History</span>
            </DialogTitle>
            <DialogDescription>
              Editing a live plan creates a new version. Existing subscribers keep the rate they signed up under until they choose to migrate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {historyPlan?.versionHistory.slice().reverse().map((v) => (
              <div
                key={v.version}
                className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    v{v.version} — {v.price}/mo
                  </span>
                  <span className="text-xs text-muted-foreground">effective {v.changedDate}</span>
                </div>
                <p className="text-sm text-muted-foreground">{v.note}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Included Features Dialog */}
      <Dialog open={featuresPlanId !== null} onOpenChange={(open) => !open && setFeaturesPlanId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" />
              <span>{featuresPlan?.name} — Included Features</span>
            </DialogTitle>
            <DialogDescription>Entitlements bundled with this plan.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2">
            {featuresPlan?.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
