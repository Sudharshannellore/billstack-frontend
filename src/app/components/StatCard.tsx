import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
  theme?: "purple" | "emerald" | "amber" | "cyan" | "rose" | "indigo";
}

interface ThemeConfig {
  border: string;
  glow: string;
  bgClass: string;
  bgGlow: string;
  iconBg: string;
  iconColor: string;
  topAccent: string;
}

const themes: Record<string, ThemeConfig> = {
  purple: {
    border: "border-purple-500/20 hover:border-purple-500/40",
    glow: "hover:shadow-purple-500/10",
    bgClass: "bg-gradient-to-br from-purple-500/10 via-[#0b0b0f] to-indigo-500/5",
    bgGlow: "from-purple-500/15 via-transparent to-transparent",
    iconBg: "from-purple-500/20 to-indigo-500/10 border border-purple-500/20",
    iconColor: "text-purple-400",
    topAccent: "from-purple-500 to-indigo-500",
  },
  emerald: {
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    glow: "hover:shadow-emerald-500/10",
    bgClass: "bg-gradient-to-br from-emerald-500/10 via-[#0b0b0f] to-teal-500/5",
    bgGlow: "from-emerald-500/15 via-transparent to-transparent",
    iconBg: "from-emerald-500/20 to-teal-500/10 border border-emerald-500/20",
    iconColor: "text-emerald-400",
    topAccent: "from-emerald-500 to-teal-500",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-500/40",
    glow: "hover:shadow-amber-500/10",
    bgClass: "bg-gradient-to-br from-amber-500/10 via-[#0b0b0f] to-orange-500/5",
    bgGlow: "from-amber-500/15 via-transparent to-transparent",
    iconBg: "from-amber-500/20 to-orange-500/10 border border-amber-500/20",
    iconColor: "text-amber-400",
    topAccent: "from-amber-500 to-orange-500",
  },
  cyan: {
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    glow: "hover:shadow-cyan-500/10",
    bgClass: "bg-gradient-to-br from-cyan-500/10 via-[#0b0b0f] to-blue-500/5",
    bgGlow: "from-cyan-500/15 via-transparent to-transparent",
    iconBg: "from-cyan-500/20 to-blue-500/10 border border-cyan-500/20",
    iconColor: "text-cyan-400",
    topAccent: "from-cyan-500 to-sky-500",
  },
  rose: {
    border: "border-rose-500/20 hover:border-rose-500/40",
    glow: "hover:shadow-rose-500/10",
    bgClass: "bg-gradient-to-br from-rose-500/10 via-[#0b0b0f] to-pink-500/5",
    bgGlow: "from-rose-500/15 via-transparent to-transparent",
    iconBg: "from-rose-500/20 to-pink-500/10 border border-rose-500/20",
    iconColor: "text-rose-400",
    topAccent: "from-rose-500 to-pink-500",
  },
  indigo: {
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    glow: "hover:shadow-indigo-500/10",
    bgClass: "bg-gradient-to-br from-indigo-500/10 via-[#0b0b0f] to-violet-500/5",
    bgGlow: "from-indigo-500/15 via-transparent to-transparent",
    iconBg: "from-indigo-500/20 to-violet-500/10 border border-indigo-500/20",
    iconColor: "text-indigo-400",
    topAccent: "from-indigo-500 to-violet-500",
  },
};

const themeKeys = Object.keys(themes);
const getThemeByTitle = (title: string) => {
  let sum = 0;
  for (let i = 0; i < title.length; i++) {
    sum += title.charCodeAt(i);
  }
  return themeKeys[sum % themeKeys.length];
};

export function StatCard({ title, value, change, changeType, icon: Icon, delay = 0, theme }: StatCardProps) {
  const activeThemeKey = theme || getThemeByTitle(title);
  const activeTheme = themes[activeThemeKey] || themes.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-6 ${activeTheme.bgClass} border ${activeTheme.border} rounded-2xl hover:shadow-xl ${activeTheme.glow} transition-all duration-300 group overflow-hidden`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${activeTheme.topAccent} rounded-t-2xl pointer-events-none`} />

      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${activeTheme.bgGlow} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${activeTheme.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className={`w-5 h-5 ${activeTheme.iconColor}`} />
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
