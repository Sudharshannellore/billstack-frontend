import { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles, Search, TrendingUp, TrendingDown, AlertTriangle, Users, Lightbulb, Send, Bot,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { getCardThemeByIndex } from "../../components/cardThemes";

const forecastData = [
  { month: "Aug", mrr: 41200 },
  { month: "Sep", mrr: 44100 },
  { month: "Oct", mrr: 47500 },
  { month: "Nov", mrr: 51800 },
  { month: "Dec", mrr: 56200 },
];

const churnPredictions = [
  { customer: "Carol White", risk: 82, reason: "Usage dropped 64% in the last 30 days" },
  { customer: "Frank Wilson", risk: 71, reason: "Failed payment twice, wallet balance at ₹0" },
  { customer: "David Brown", risk: 58, reason: "Has not logged in for 3 weeks" },
];

const pricingRecommendations = [
  { plan: "Pro", suggestion: "Increase price by 8% — usage is 2.3x above comparable plans with no churn impact expected.", impact: "+₹4,200 MRR" },
  { plan: "Pay as you go", suggestion: "Introduce a volume discount tier above 100k units to reduce downgrade requests.", impact: "-2% churn" },
];

const anomalies = [
  { title: "API call spike", detail: "TechFlow Ltd usage up 340% in the last 6 hours — verify this isn't a billing error or abuse.", severity: "high" as const },
  { title: "Unusual refund pattern", detail: "3 refunds issued for the same plan within 24 hours.", severity: "medium" as const },
];

const EXAMPLE_QUERIES = [
  "Show customers with declining usage",
  "Predict next month's MRR",
  "Which plans generate the highest revenue?",
];

const CANNED_ANSWERS: Record<string, string> = {
  "show customers with declining usage": "3 customers show declining usage this month: Carol White (-64%), Frank Wilson (-51%), David Brown (-38%). Consider proactive outreach before renewal.",
  "predict next month's mrr": "Based on current growth trend and forecasted renewals, next month's MRR is projected at ₹44,100 — a 7% increase from this month.",
  "which plans generate the highest revenue?": "Enterprise Custom generates the most revenue (₹15,200 MRR), followed by SaaS Pro (₹9,840) and Data Bundles (₹5,000).",
};

export function AIAssistant() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<{ q: string; a: string }[]>([]);

  const runQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const answer = CANNED_ANSWERS[trimmed.toLowerCase()]
      ?? "I don't have enough data to answer that yet in this preview — try one of the example questions below.";
    setConversation((prev) => [...prev, { q: trimmed, a: answer }]);
    setQuery("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-dark/20 border border-primary/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            AI Assistant
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Beta
            </span>
          </h1>
          <p className="text-muted-foreground">Revenue insights, churn prediction, and natural-language search over your billing data</p>
        </div>
      </div>

      {/* Natural language search */}
      <div className={`relative bg-card border ${getCardThemeByIndex(0).border} rounded-2xl p-5 overflow-hidden`}>
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(0).topAccent} rounded-t-2xl pointer-events-none`} />
        <div className="relative z-10 space-y-3">
          {conversation.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {conversation.map((turn, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-end">
                    <div className="px-3 py-2 rounded-lg bg-primary/10 text-sm max-w-[85%]">{turn.q}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div className="px-3 py-2 rounded-lg bg-muted/20 border border-border text-sm max-w-[85%]">{turn.a}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runQuery(query)}
                placeholder="Ask anything, e.g. Predict next month's MRR"
                className="w-full pl-9 pr-3 py-2.5 bg-input-background border border-border rounded-lg text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <button
              onClick={() => runQuery(query)}
              className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => runQuery(q)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-border text-muted-foreground hover:bg-muted/30 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue forecast */}
        <div className={`relative bg-card border ${getCardThemeByIndex(1).border} rounded-2xl p-5 overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(1).topAccent} rounded-t-2xl pointer-events-none`} />
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 relative z-10"><TrendingUp className="w-4 h-4 text-muted-foreground" />Revenue Forecast</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="aiForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0B0B0F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: 12 }} />
              <Area type="monotone" dataKey="mrr" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#aiForecastGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Churn prediction */}
        <div className={`relative bg-card border ${getCardThemeByIndex(2).border} rounded-2xl p-5 overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-2xl pointer-events-none`} />
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 relative z-10"><Users className="w-4 h-4 text-muted-foreground" />Churn Prediction</h3>
          <div className="space-y-2 relative z-10">
            {churnPredictions.map((c) => (
              <div key={c.customer} className="p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{c.customer}</span>
                  <span className={`text-xs font-bold ${c.risk > 75 ? "text-rose-400" : c.risk > 55 ? "text-amber-400" : "text-muted-foreground"}`}>{c.risk}% risk</span>
                </div>
                <p className="text-xs text-muted-foreground">{c.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pricing recommendations */}
        <div className={`relative bg-card border ${getCardThemeByIndex(3).border} rounded-2xl p-5 overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(3).topAccent} rounded-t-2xl pointer-events-none`} />
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 relative z-10"><Lightbulb className="w-4 h-4 text-muted-foreground" />Pricing Recommendations</h3>
          <div className="space-y-2 relative z-10">
            {pricingRecommendations.map((p) => (
              <div key={p.plan} className="p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{p.plan}</span>
                  <span className="text-xs font-bold text-emerald-400">{p.impact}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage anomaly detection */}
        <div className={`relative bg-card border ${getCardThemeByIndex(4).border} rounded-2xl p-5 overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(4).topAccent} rounded-t-2xl pointer-events-none`} />
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 relative z-10"><AlertTriangle className="w-4 h-4 text-muted-foreground" />Usage Anomaly Detection</h3>
          <div className="space-y-2 relative z-10">
            {anomalies.map((a) => (
              <div key={a.title} className={`p-3 rounded-lg border ${a.severity === "high" ? "bg-rose-500/5 border-rose-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                <div className="flex items-center gap-2 mb-1">
                  {a.severity === "high" ? <TrendingUp className="w-3.5 h-3.5 text-rose-400" /> : <TrendingDown className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="text-sm font-medium">{a.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
