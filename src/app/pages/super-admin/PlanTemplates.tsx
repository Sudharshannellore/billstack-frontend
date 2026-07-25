import { motion } from "motion/react";
import { 
  FileText, 
  Plus, 
  Users, 
  Zap, 
  Layers, 
  MoreVertical, 
  Copy, 
  Star,
  CheckCircle,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";

const templates = [
  { 
    id: 1, 
    name: "SaaS Starter", 
    type: "Subscription", 
    price: "$29/mo", 
    tenants: 12, 
    featured: true,
    description: "Fixed monthly subscription ideal for early-stage SaaS products.",
    features: ["Unlimited API Calls", "5GB Storage", "Email Support"],
    icon: Star,
    gradient: "from-primary via-violet-600 to-purple-700",
    glow: "shadow-primary/20",
  },
  { 
    id: 2, 
    name: "API Usage", 
    type: "Usage-based", 
    price: "$0.01/call", 
    tenants: 8, 
    featured: false,
    description: "Pay-per-use model for API-driven products. Scale costs with consumption.",
    features: ["Per-request billing", "Daily invoices", "Overage alerts"],
    icon: Zap,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    glow: "shadow-amber-500/20",
  },
  { 
    id: 3, 
    name: "Freemium Model", 
    type: "Hybrid", 
    price: "$0 + overage", 
    tenants: 15, 
    featured: false,
    description: "Generous free tier with usage-based overages after quota is exceeded.",
    features: ["10K free calls/mo", "Usage metering", "Auto-upgrade prompts"],
    icon: Layers,
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  { 
    id: 4, 
    name: "Enterprise", 
    type: "Custom", 
    price: "Custom", 
    tenants: 3, 
    featured: false,
    description: "Fully negotiated contracts with SLA guarantees and dedicated support.",
    features: ["Custom limits", "99.99% SLA", "Dedicated CSM"],
    icon: Users,
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    glow: "shadow-emerald-500/20",
  },
];

const typeColors: Record<string, string> = {
  Subscription: "bg-primary/10 text-primary border-primary/20",
  "Usage-based": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hybrid: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Custom: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function PlanTemplates() {
  const [menu, setMenu] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Plan Templates</h1>
          <p className="text-muted-foreground text-sm">Build reusable pricing blueprints that tenants can adopt for their billing models.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Templates", value: templates.length },
          { label: "Active Tenants", value: templates.reduce((a, t) => a + t.tenants, 0) },
          { label: "Avg Tenants / Template", value: (templates.reduce((a, t) => a + t.tenants, 0) / templates.length).toFixed(1) },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 bg-card border border-white/[0.06] rounded-2xl text-center"
          >
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl, i) => {
          const Icon = tpl.icon;
          return (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ y: -4 }}
              className="relative p-6 bg-card border border-white/[0.06] rounded-2xl overflow-hidden group transition-all duration-300 hover:border-white/[0.12]"
            >
              {/* Gradient stripe */}
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${tpl.gradient}`} />

              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${tpl.gradient} rounded-xl flex items-center justify-center shadow-lg ${tpl.glow}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-sm">{tpl.name}</h3>
                      {tpl.featured && (
                        <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded uppercase tracking-wider">Featured</span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border ${typeColors[tpl.type]}`}>
                      {tpl.type}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setMenu(menu === tpl.id ? null : tpl.id)}
                    className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {menu === tpl.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                      <div className="absolute right-0 mt-1 w-32 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-xl py-1.5 z-20">
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" /> Edit
                        </button>
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" /> Duplicate
                        </button>
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{tpl.description}</p>

              {/* Features */}
              <div className="space-y-1.5 mb-5">
                {tpl.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Base Price</span>
                  <span className="text-sm font-black text-white">{tpl.price}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>{tpl.tenants} tenants</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
