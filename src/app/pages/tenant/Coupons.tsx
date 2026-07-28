import { motion, AnimatePresence } from "motion/react";
import { Plus, Ticket, MoreVertical, Edit, Trash2, Copy, Power, PowerOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";

// Fixed "today" reference date for mock day-count calculations (no real backend/date lib needed)
const TODAY = new Date("2026-07-28");

function parseUsage(usage: string): { used: number; total: number; pct: number } {
  const [usedStr, totalStr] = usage.split("/");
  const used = parseInt(usedStr, 10) || 0;
  const total = parseInt(totalStr, 10) || 0;
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  return { used, total, pct };
}

function getExpiryInfo(expiry: string): { daysRemaining: number; isExpired: boolean; isSoon: boolean } {
  const expiryDate = new Date(expiry);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round((expiryDate.getTime() - TODAY.getTime()) / msPerDay);
  return {
    daysRemaining,
    isExpired: daysRemaining < 0,
    isSoon: daysRemaining >= 0 && daysRemaining <= 30,
  };
}

const initialCoupons = [
  {
    id: 1,
    name: "Welcome Pack",
    code: "WELCOME50",
    type: "percentage",
    value: "50%",
    usage: "124/500",
    expiry: "Dec 31, 2026",
    status: "active",
  },
  {
    id: 2,
    name: "Summer Sale",
    code: "SUMMER100",
    type: "fixed",
    value: "₹100",
    usage: "45/100",
    expiry: "Aug 15, 2026",
    status: "active",
  },
  {
    id: 3,
    name: "Black Friday",
    code: "BLACKFRIDAY",
    type: "percentage",
    value: "75%",
    usage: "0/1000",
    expiry: "Nov 30, 2026",
    status: "draft",
  },
];

export function Coupons() {
  const theme = getCardThemeByIndex(3);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [couponsList, setCouponsList] = useState(initialCoupons);

  const handleDuplicate = (coupon: (typeof initialCoupons)[number]) => {
    const newCoupon = {
      ...coupon,
      id: Math.max(...couponsList.map((c) => c.id)) + 1,
      name: `${coupon.name} (Copy)`,
      code: `${coupon.code}-COPY`,
      usage: `0/${coupon.usage.split("/")[1]}`,
      status: "draft",
    };
    setCouponsList((prev) => [...prev, newCoupon]);
    toast.success(`Duplicated "${coupon.name}" as ${newCoupon.code}`);
    setShowMenu(null);
  };

  const handleToggleStatus = (coupon: (typeof initialCoupons)[number]) => {
    const nextStatus = coupon.status === "active" ? "paused" : "active";
    setCouponsList((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, status: nextStatus } : c))
    );
    toast.success(
      nextStatus === "active"
        ? `"${coupon.name}" is now active`
        : `"${coupon.name}" has been paused`
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coupons</h1>
          <p className="text-muted-foreground">Manage discounts and promotional codes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/tenant/coupons/create")}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Coupon</span>
        </motion.button>
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
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Campaign
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Code
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Discount
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Usage
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Expiry
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {couponsList.map((coupon, index) => (
              <motion.tr
                key={coupon.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-muted/30 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{coupon.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded border border-border">
                    {coupon.code}
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-primary">{coupon.value}</td>
                <td className="py-4 px-6">
                  {(() => {
                    const { used, total, pct } = parseUsage(coupon.usage);
                    return (
                      <div className="min-w-[110px]">
                        <div className="text-sm text-muted-foreground mb-1">
                          {used}/{total}{" "}
                          <span className="text-xs">({pct.toFixed(1)}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${theme.topAccent} rounded-full`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </td>
                <td className="py-4 px-6">
                  {(() => {
                    const { daysRemaining, isExpired, isSoon } = getExpiryInfo(coupon.expiry);
                    return (
                      <div>
                        <div className="text-sm text-muted-foreground">{coupon.expiry}</div>
                        {isExpired ? (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-rose-500/10 text-rose-500">
                            Expired
                          </span>
                        ) : (
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                              isSoon ? "bg-amber-500/10 text-amber-500" : "text-muted-foreground"
                            }`}
                          >
                            {daysRemaining} day{daysRemaining === 1 ? "" : "s"} left
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      coupon.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {coupon.status}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleStatus(coupon)}
                      title={coupon.status === "active" ? "Deactivate" : "Activate"}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    >
                      {coupon.status === "active" ? (
                        <PowerOff className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Power className="w-3.5 h-3.5 text-success" />
                      )}
                    </motion.button>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDuplicate(coupon)}
                      title="Duplicate"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    <div className="relative inline-block">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowMenu(showMenu === coupon.id ? null : coupon.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                      <AnimatePresence>
                        {showMenu === coupon.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
                          >
                            <button className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setCouponsList((prev) => prev.filter((c) => c.id !== coupon.id));
                                toast.success(`Deleted "${coupon.name}"`);
                                setShowMenu(null);
                              }}
                              className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
