import { motion, AnimatePresence } from "motion/react";
import { Plus, Zap, MoreVertical, Edit, Trash2, Package, Database, Coins, Copy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getCardTheme } from "../../components/cardThemes";
import { Switch } from "../../components/ui/switch";

const initialTopups = [
  {
    id: 1,
    name: "1000 Credits Pack",
    product: "Cloud Storage API",
    style: "credits",
    value: "1000 Credits",
    price: "₹50",
    status: "active",
    redemptions: 128,
    redemptionTarget: 200,
  },
  {
    id: 2,
    name: "50GB Extra Data",
    product: "Video Streaming API",
    style: "telecom",
    value: "50 GB",
    price: "₹25",
    status: "active",
    redemptions: 76,
    redemptionTarget: 150,
  },
  {
    id: 3,
    name: "10k API Calls",
    product: "Analytics Platform",
    style: "usage",
    value: "10,000 Units",
    price: "₹10",
    status: "draft",
    redemptions: 12,
    redemptionTarget: 500,
  },
  {
    id: 4,
    name: "50 Credits Pack",
    product: "Cloud Storage API",
    style: "credits",
    value: "50 Credits",
    price: "₹5",
    status: "active",
    redemptions: 310,
    redemptionTarget: 400,
  },
  {
    id: 5,
    name: "5000 Credits Pack",
    product: "Cloud Storage API",
    style: "credits",
    value: "5,000 Credits",
    price: "₹200",
    status: "active",
    redemptions: 44,
    redemptionTarget: 100,
  },
  {
    id: 6,
    name: "5GB Data Pack",
    product: "Video Streaming API",
    style: "telecom",
    value: "5 GB",
    price: "₹8",
    status: "active",
    redemptions: 205,
    redemptionTarget: 250,
  },
  {
    id: 7,
    name: "100GB Data Pack",
    product: "Video Streaming API",
    style: "telecom",
    value: "100 GB",
    price: "₹45",
    status: "draft",
    redemptions: 8,
    redemptionTarget: 60,
  },
  {
    id: 8,
    name: "1000 Compute Units",
    product: "Analytics Platform",
    style: "usage",
    value: "1,000 Units",
    price: "₹15",
    status: "active",
    redemptions: 92,
    redemptionTarget: 300,
  },
  {
    id: 9,
    name: "100k API Calls",
    product: "Analytics Platform",
    style: "usage",
    value: "100,000 Units",
    price: "₹80",
    status: "active",
    redemptions: 55,
    redemptionTarget: 120,
  },
  {
    id: 10,
    name: "20000 Credits Pack",
    product: "Cloud Storage API",
    style: "credits",
    value: "20,000 Credits",
    price: "₹750",
    status: "draft",
    redemptions: 3,
    redemptionTarget: 30,
  },
];

export function Topups() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [topupsList, setTopupsList] = useState(initialTopups);

  const getStyleIcon = (style: string, iconColor: string) => {
    switch (style) {
      case 'credits': return <Coins className={`w-5 h-5 ${iconColor}`} />;
      case 'telecom': return <Database className={`w-5 h-5 ${iconColor}`} />;
      case 'usage': return <Zap className={`w-5 h-5 ${iconColor}`} />;
      default: return <Package className={`w-5 h-5 ${iconColor}`} />;
    }
  };

  const handleDuplicate = (topup: (typeof initialTopups)[number]) => {
    const maxId = topupsList.reduce((max, t) => Math.max(max, t.id), 0);
    const clone = { ...topup, id: maxId + 1, name: `${topup.name} (Copy)` };
    setTopupsList((prev) => [...prev, clone]);
    toast.success(`Duplicated "${topup.name}"`);
  };

  const handleToggleStatus = (id: number) => {
    setTopupsList((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus = t.status === "active" ? "draft" : "active";
        toast.success(`"${t.name}" set to ${nextStatus}`);
        return { ...t, status: nextStatus };
      })
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Top-ups</h1>
          <p className="text-muted-foreground">Manage on-demand resource packs and add-ons</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/tenant/topups/create")}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Top-up</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topupsList.map((topup, index) => {
          const theme = getCardTheme(topup.style || topup.name);
          return (
          <motion.div
            key={topup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`relative p-6 bg-card border ${theme.border} rounded-2xl hover:shadow-xl transition-all group overflow-hidden`}
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
            {/* Gradient tint */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
            {/* Glow orb */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${theme.bgGlow} rounded-full blur-3xl pointer-events-none`} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${theme.iconBg} rounded-xl flex items-center justify-center`}>
                  {getStyleIcon(topup.style, theme.iconColor)}
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDuplicate(topup)}
                    title="Duplicate"
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(showMenu === topup.id ? null : topup.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  <AnimatePresence>
                    {showMenu === topup.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-xl font-bold">{topup.name}</h3>
                <p className="text-sm text-muted-foreground">{topup.product}</p>
              </div>

              <div className="flex items-end justify-between border-t border-white/[0.06] pt-4">
                <div>
                  <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1 italic">Value</div>
                  <div className="font-bold text-lg text-primary">{topup.value}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1 italic">Price</div>
                  <div className="text-2xl font-black italic">{topup.price}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Redeemed: <span className="font-semibold text-foreground">{topup.redemptions}</span> this month
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {topup.redemptions}/{topup.redemptionTarget}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${theme.topAccent}`}
                    style={{
                      width: `${Math.min(100, Math.round((topup.redemptions / topup.redemptionTarget) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs font-medium capitalize ${topup.status === "active" ? "text-primary" : "text-muted-foreground"}`}>
                  {topup.status}
                </span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={topup.status === "active"}
                    onCheckedChange={() => handleToggleStatus(topup.id)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
