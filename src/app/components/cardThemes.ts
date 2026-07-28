export interface CardTheme {
  border: string;
  glow: string;
  bgClass: string;
  bgGlow: string;
  iconBg: string;
  iconColor: string;
  topAccent: string;
  /** Solid background classes for a decorative corner "glow orb" div, at two intensities. */
  orb10: string;
  orb5: string;
}

export const CARD_THEMES: Record<string, CardTheme> = {
  purple: {
    border: "border-purple-500/20 hover:border-purple-500/40",
    glow: "hover:shadow-purple-500/10",
    bgClass: "bg-gradient-to-br from-purple-500/10 via-[#0b0b0f] to-indigo-500/5",
    bgGlow: "from-purple-500/15 via-transparent to-transparent",
    iconBg: "from-purple-500/20 to-indigo-500/10 border border-purple-500/20",
    iconColor: "text-purple-400",
    topAccent: "from-purple-500 to-indigo-500",
    orb10: "bg-purple-500/10",
    orb5: "bg-purple-500/5",
  },
  emerald: {
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    glow: "hover:shadow-emerald-500/10",
    bgClass: "bg-gradient-to-br from-emerald-500/10 via-[#0b0b0f] to-teal-500/5",
    bgGlow: "from-emerald-500/15 via-transparent to-transparent",
    iconBg: "from-emerald-500/20 to-teal-500/10 border border-emerald-500/20",
    iconColor: "text-emerald-400",
    topAccent: "from-emerald-500 to-teal-500",
    orb10: "bg-emerald-500/10",
    orb5: "bg-emerald-500/5",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-500/40",
    glow: "hover:shadow-amber-500/10",
    bgClass: "bg-gradient-to-br from-amber-500/10 via-[#0b0b0f] to-orange-500/5",
    bgGlow: "from-amber-500/15 via-transparent to-transparent",
    iconBg: "from-amber-500/20 to-orange-500/10 border border-amber-500/20",
    iconColor: "text-amber-400",
    topAccent: "from-amber-500 to-orange-500",
    orb10: "bg-amber-500/10",
    orb5: "bg-amber-500/5",
  },
  cyan: {
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    glow: "hover:shadow-cyan-500/10",
    bgClass: "bg-gradient-to-br from-cyan-500/10 via-[#0b0b0f] to-blue-500/5",
    bgGlow: "from-cyan-500/15 via-transparent to-transparent",
    iconBg: "from-cyan-500/20 to-blue-500/10 border border-cyan-500/20",
    iconColor: "text-cyan-400",
    topAccent: "from-cyan-500 to-sky-500",
    orb10: "bg-cyan-500/10",
    orb5: "bg-cyan-500/5",
  },
  rose: {
    border: "border-rose-500/20 hover:border-rose-500/40",
    glow: "hover:shadow-rose-500/10",
    bgClass: "bg-gradient-to-br from-rose-500/10 via-[#0b0b0f] to-pink-500/5",
    bgGlow: "from-rose-500/15 via-transparent to-transparent",
    iconBg: "from-rose-500/20 to-pink-500/10 border border-rose-500/20",
    iconColor: "text-rose-400",
    topAccent: "from-rose-500 to-pink-500",
    orb10: "bg-rose-500/10",
    orb5: "bg-rose-500/5",
  },
  indigo: {
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    glow: "hover:shadow-indigo-500/10",
    bgClass: "bg-gradient-to-br from-indigo-500/10 via-[#0b0b0f] to-violet-500/5",
    bgGlow: "from-indigo-500/15 via-transparent to-transparent",
    iconBg: "from-indigo-500/20 to-violet-500/10 border border-indigo-500/20",
    iconColor: "text-indigo-400",
    topAccent: "from-indigo-500 to-violet-500",
    orb10: "bg-indigo-500/10",
    orb5: "bg-indigo-500/5",
  },
};

const themeKeys = Object.keys(CARD_THEMES);

/** Deterministically picks a theme based on a seed string (e.g. a title or id) so the same card always gets the same color across re-renders. */
export function getCardTheme(seed: string): CardTheme {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) {
    sum += seed.charCodeAt(i);
  }
  return CARD_THEMES[themeKeys[sum % themeKeys.length]];
}

/** Picks a theme by cycling through the palette using an index (e.g. row/card position). */
export function getCardThemeByIndex(index: number): CardTheme {
  return CARD_THEMES[themeKeys[index % themeKeys.length]];
}
