import { motion } from "motion/react";
import { 
  Database, 
  Plus, 
  Cpu, 
  HardDrive, 
  Zap,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

const resources = [
  { 
    id: 1, 
    name: "TRADES", 
    type: "Unit", 
    description: "Stock trading transactions consumption", 
    price: "$0.10/trade", 
    usageThisMonth: 482000,
    growth: "+14%",
    icon: TrendingUp,
    color: "from-primary/20 to-violet-500/10",
    iconColor: "text-primary"
  },
  { 
    id: 2, 
    name: "API_CALLS", 
    type: "Unit", 
    description: "Metered API request gateway consumption", 
    price: "$0.001/call", 
    usageThisMonth: 18400000,
    growth: "+32%",
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400"
  },
  { 
    id: 3, 
    name: "DATA_GB", 
    type: "Unit", 
    description: "Cloud storage disk usage in gigabytes", 
    price: "$0.50/GB", 
    usageThisMonth: 3240,
    growth: "+9%",
    icon: HardDrive,
    color: "from-cyan-500/20 to-sky-500/10",
    iconColor: "text-cyan-400"
  },
  { 
    id: 4, 
    name: "COMPUTE_HOURS", 
    type: "Unit", 
    description: "vCPU compute-hours from cloud workloads", 
    price: "$0.08/hr", 
    usageThisMonth: 9800,
    growth: "+21%",
    icon: Cpu,
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400"
  },
];

export function GlobalResources() {
  const [showMenu, setShowMenu] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Global Resources</h1>
          <p className="text-muted-foreground text-sm">Define and manage platform-wide metered billing resource units available to all tenants.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Resource</span>
        </motion.button>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.12)" }}
              className="relative p-6 bg-card border border-white/[0.06] rounded-2xl transition-all duration-300 flex flex-col justify-between gap-6 group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${resource.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-black text-white font-mono tracking-wider text-sm">{resource.name}</h3>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{resource.type}</span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === resource.id ? null : resource.id)}
                    className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {showMenu === resource.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
                      <div className="absolute right-0 mt-1 w-32 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-xl py-1.5 z-20">
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" /> Edit
                        </button>
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">{resource.description}</p>

              {/* Bottom Stats Row */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block mb-0.5">Unit Price</span>
                  <span className="text-sm font-black text-white">{resource.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block mb-0.5">Usage This Month</span>
                  <span className="text-sm font-black text-white">{resource.usageThisMonth.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {resource.growth}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
