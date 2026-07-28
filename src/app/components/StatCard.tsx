import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { getCardTheme, getCardThemeByIndex } from "./cardThemes";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
  /** Force a specific palette slot (e.g. its position in a grid) instead of hashing the title. Use this when rendering a known-size list of cards so colors don't collide. */
  colorIndex?: number;
}

export function StatCard({ title, value, change, changeType, icon: Icon, delay = 0, colorIndex }: StatCardProps) {
  const theme = colorIndex !== undefined ? getCardThemeByIndex(colorIndex) : getCardTheme(title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-6 ${theme.bgClass} border ${theme.border} rounded-2xl hover:shadow-xl ${theme.glow} transition-all duration-300 group overflow-hidden`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />

      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${theme.bgGlow} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${theme.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className={`w-5 h-5 ${theme.iconColor}`} />
          </div>
          {change && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                changeType === "positive"
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : changeType === "negative"
                  ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                  : "text-muted-foreground bg-white/5 border-white/[0.08]"
              }`}
            >
              {change}
            </span>
          )}
        </div>

        <div className="text-3xl font-black text-white mb-1.5">{value}</div>
        <div className="text-xs text-muted-foreground font-light">{title}</div>
      </div>
    </motion.div>
  );
}
