import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, GitBranch, Trash2, Edit, AlertTriangle, PlayCircle, X, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { StatusBadge } from "../../components/StatusBadge";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EmptyState } from "../../components/EmptyState";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../../components/ui/dialog";

type RuleField = "country" | "segment" | "usage" | "subscription" | "plan" | "currency" | "region" | "time";
type RuleOperator = "equals" | "greater_than" | "less_than" | "in";
type RuleActionType = "discount" | "multiplier" | "tax" | "override_price";

const FIELD_LABELS: Record<RuleField, string> = {
  country: "Customer Country",
  segment: "Customer Segment",
  usage: "Usage",
  subscription: "Subscription",
  plan: "Plan",
  currency: "Currency",
  region: "Region",
  time: "Time",
};

const ACTION_LABELS: Record<RuleActionType, string> = {
  discount: "Apply Discount",
  multiplier: "Apply Multiplier",
  tax: "Apply Tax",
  override_price: "Override Price",
};

interface RuleCondition {
  field: RuleField;
  operator: RuleOperator;
  value: string;
}

interface RuleAction {
  type: RuleActionType;
  value: string;
}

interface PricingRule {
  id: number;
  name: string;
  status: "active" | "disabled" | "draft";
  priority: number;
  conditions: RuleCondition[];
  action: RuleAction;
}

const initialRules: PricingRule[] = [
  {
    id: 1,
    name: "India regional discount",
    status: "active",
    priority: 1,
    conditions: [{ field: "country", operator: "equals", value: "India" }],
    action: { type: "discount", value: "15%" },
  },
  {
    id: 2,
    name: "Enterprise segment override",
    status: "active",
    priority: 2,
    conditions: [{ field: "segment", operator: "equals", value: "Enterprise" }],
    action: { type: "multiplier", value: "0.9x" },
  },
  {
    id: 3,
    name: "High usage surcharge",
    status: "active",
    priority: 3,
    conditions: [{ field: "usage", operator: "greater_than", value: "100000 events" }],
    action: { type: "multiplier", value: "1.1x" },
  },
  {
    id: 4,
    name: "EU VAT",
    status: "active",
    priority: 4,
    conditions: [{ field: "region", operator: "equals", value: "European Union" }],
    action: { type: "tax", value: "20%" },
  },
  {
    id: 5,
    name: "Legacy India promo",
    status: "disabled",
    priority: 5,
    conditions: [{ field: "country", operator: "equals", value: "India" }],
    action: { type: "discount", value: "10%" },
  },
];

const emptyCondition: RuleCondition = { field: "country", operator: "equals", value: "" };

export function PricingRules() {
  const theme = getCardThemeByIndex(2);
  const [rules, setRules] = useState(initialRules);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PricingRule | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const [name, setName] = useState("");
  const [conditions, setConditions] = useState<RuleCondition[]>([emptyCondition]);
  const [actionType, setActionType] = useState<RuleActionType>("discount");
  const [actionValue, setActionValue] = useState("");
  const [priority, setPriority] = useState(rules.length + 1);

  const [simCountry, setSimCountry] = useState("India");
  const [simSegment, setSimSegment] = useState("Enterprise");
  const [simUsage, setSimUsage] = useState(50000);
  const [simRegion, setSimRegion] = useState("Asia Pacific");

  // Conflict detection: two active rules whose conditions share the exact same field+value pair conflict.
  const conflictIds = useMemo(() => {
    const active = rules.filter((r) => r.status === "active");
    const seen = new Map<string, number[]>();
    for (const rule of active) {
      for (const c of rule.conditions) {
        const key = `${c.field}:${c.value}`;
        seen.set(key, [...(seen.get(key) ?? []), rule.id]);
      }
    }
    const conflicted = new Set<number>();
    for (const ids of seen.values()) {
      if (ids.length > 1) ids.forEach((id) => conflicted.add(id));
    }
    return conflicted;
  }, [rules]);

  function resetBuilder() {
    setName("");
    setConditions([emptyCondition]);
    setActionType("discount");
    setActionValue("");
    setPriority(rules.length + 1);
    setEditingId(null);
  }

  function openCreate() {
    resetBuilder();
    setBuilderOpen(true);
  }

  function openEdit(rule: PricingRule) {
    setEditingId(rule.id);
    setName(rule.name);
    setConditions(rule.conditions);
    setActionType(rule.action.type);
    setActionValue(rule.action.value);
    setPriority(rule.priority);
    setBuilderOpen(true);
  }

  function saveRule() {
    if (!name.trim() || !actionValue.trim() || conditions.some((c) => !c.value.trim())) {
      toast.error("Fill in the rule name, all conditions, and the action value.");
      return;
    }
    if (editingId !== null) {
      setRules((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, name, conditions, action: { type: actionType, value: actionValue }, priority } : r)),
      );
      toast.success("Rule updated");
    } else {
      const id = Math.max(0, ...rules.map((r) => r.id)) + 1;
      setRules((prev) => [...prev, { id, name, status: "draft", priority, conditions, action: { type: actionType, value: actionValue } }]);
      toast.success("Rule created as draft");
    }
    setBuilderOpen(false);
  }

  function toggleStatus(id: number) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "active" ? "disabled" : "active" } : r)),
    );
  }

  function deleteRule(id: number) {
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Rule deleted");
  }

  // Simulator: evaluate which active rules match the simulated customer/context, in priority order.
  const simulatedContext: Record<RuleField, string | number> = {
    country: simCountry,
    segment: simSegment,
    usage: simUsage,
    region: simRegion,
    subscription: "active",
    plan: "Pro",
    currency: "INR",
    time: "business_hours",
  };

  function conditionMatches(c: RuleCondition): boolean {
    const contextValue = simulatedContext[c.field];
    if (c.operator === "greater_than") return Number(contextValue) > parseFloat(c.value);
    if (c.operator === "less_than") return Number(contextValue) < parseFloat(c.value);
    return String(contextValue).toLowerCase().includes(c.value.toLowerCase()) || c.value.toLowerCase().includes(String(contextValue).toLowerCase());
  }

  const matchedRules = useMemo(() => {
    return rules
      .filter((r) => r.status === "active" && r.conditions.every(conditionMatches))
      .sort((a, b) => a.priority - b.priority);
  }, [rules, simCountry, simSegment, simUsage, simRegion]);

  const basePrice = 999;
  const finalPrice = useMemo(() => {
    let price = basePrice;
    for (const rule of matchedRules) {
      const num = parseFloat(rule.action.value);
      if (rule.action.type === "discount") price -= price * (num / 100);
      else if (rule.action.type === "multiplier") price *= num;
      else if (rule.action.type === "tax") price += price * (num / 100);
      else if (rule.action.type === "override_price") price = num;
    }
    return price;
  }, [matchedRules]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pricing Rules</h1>
          <p className="text-muted-foreground">Configure IF-THEN pricing logic and simulate outcomes</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSimulatorOpen(true)}
            className="px-5 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Simulate</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreate}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Rule</span>
          </motion.button>
        </div>
      </div>

      {rules.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="No rules configured yet"
          description="Create IF-THEN rules to customize your pricing logic based on usage, customer tier, or other conditions."
          action={{ label: "Create Rule", onClick: openCreate }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative bg-card border ${theme.border} rounded-2xl overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none z-10`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
          <div className="relative z-10 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Rule</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">IF</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">THEN</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules
                  .slice()
                  .sort((a, b) => a.priority - b.priority)
                  .map((rule, index) => (
                    <motion.tr
                      key={rule.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono text-sm text-muted-foreground">#{rule.priority}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{rule.name}</span>
                          {conflictIds.has(rule.id) && (
                            <span title="Conflicts with another active rule on the same condition">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-muted-foreground">
                        {rule.conditions.map((c, i) => (
                          <span key={i} className="inline-block mr-1">
                            {FIELD_LABELS[c.field]} {c.operator.replace("_", " ")} <span className="text-foreground font-medium">{c.value}</span>
                            {i < rule.conditions.length - 1 && " AND "}
                          </span>
                        ))}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {ACTION_LABELS[rule.action.type]}: {rule.action.value}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button onClick={() => toggleStatus(rule.id)}>
                          <StatusBadge status={rule.status} />
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(rule)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => setPendingDelete(rule)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Rule Builder Dialog */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              <span>{editingId !== null ? "Edit Rule" : "Create Rule"}</span>
            </DialogTitle>
            <DialogDescription>Define conditions and the pricing action to apply when they match.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Rule name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. India regional discount"
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">IF (conditions)</label>
              <div className="space-y-2">
                {conditions.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={c.field}
                      onChange={(e) => setConditions((prev) => prev.map((x, xi) => (xi === i ? { ...x, field: e.target.value as RuleField } : x)))}
                      className="px-2 py-2 bg-input-background border border-border rounded-lg text-xs outline-none"
                    >
                      {Object.entries(FIELD_LABELS).map(([k, label]) => (
                        <option key={k} value={k}>{label}</option>
                      ))}
                    </select>
                    <select
                      value={c.operator}
                      onChange={(e) => setConditions((prev) => prev.map((x, xi) => (xi === i ? { ...x, operator: e.target.value as RuleOperator } : x)))}
                      className="px-2 py-2 bg-input-background border border-border rounded-lg text-xs outline-none"
                    >
                      <option value="equals">equals</option>
                      <option value="greater_than">greater than</option>
                      <option value="less_than">less than</option>
                      <option value="in">in</option>
                    </select>
                    <input
                      value={c.value}
                      onChange={(e) => setConditions((prev) => prev.map((x, xi) => (xi === i ? { ...x, value: e.target.value } : x)))}
                      placeholder="value"
                      className="flex-1 px-2 py-2 bg-input-background border border-border rounded-lg text-xs outline-none"
                    />
                    {conditions.length > 1 && (
                      <button onClick={() => setConditions((prev) => prev.filter((_, xi) => xi !== i))} className="p-1.5 hover:bg-muted rounded-lg">
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setConditions((prev) => [...prev, { ...emptyCondition }])}
                className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add condition (AND)
              </button>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <ArrowRight className="w-3.5 h-3.5" /> THEN
            </div>

            <div className="flex items-center gap-2">
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as RuleActionType)}
                className="px-2 py-2 bg-input-background border border-border rounded-lg text-xs outline-none"
              >
                {Object.entries(ACTION_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
              <input
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                placeholder={actionType === "multiplier" ? "e.g. 0.9x" : actionType === "override_price" ? "e.g. 499" : "e.g. 15%"}
                className="flex-1 px-2 py-2 bg-input-background border border-border rounded-lg text-xs outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Priority (lower runs first)</label>
              <input
                type="number"
                min={1}
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none"
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setBuilderOpen(false)} className="px-4 py-2 bg-transparent border border-border rounded-lg text-sm hover:bg-muted/30 transition-colors">
              Cancel
            </button>
            <button onClick={saveRule} className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white text-sm font-medium shadow-lg shadow-primary/30">
              Save Rule
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rule Simulator Dialog */}
      <Dialog open={simulatorOpen} onOpenChange={setSimulatorOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              <span>Rule Simulator</span>
            </DialogTitle>
            <DialogDescription>Test which active rules apply to a hypothetical customer context.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Country</label>
              <input value={simCountry} onChange={(e) => setSimCountry(e.target.value)} className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Segment</label>
              <input value={simSegment} onChange={(e) => setSimSegment(e.target.value)} className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Region</label>
              <input value={simRegion} onChange={(e) => setSimRegion(e.target.value)} className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Monthly usage (events)</label>
              <input type="number" value={simUsage} onChange={(e) => setSimUsage(Number(e.target.value))} className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none" />
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Matched rules (in priority order)</div>
            {matchedRules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active rules match this context.</p>
            ) : (
              matchedRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border text-sm">
                  <span className="font-medium">#{rule.priority} {rule.name}</span>
                  <span className="text-primary font-semibold">{ACTION_LABELS[rule.action.type]}: {rule.action.value}</span>
                </div>
              ))
            )}
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 flex items-center justify-between mt-2">
            <div>
              <div className="text-xs text-muted-foreground">Base price ₹{basePrice}</div>
              <div className="text-sm text-muted-foreground">After {matchedRules.length} rule(s) applied</div>
            </div>
            <span className="text-2xl font-black text-primary">₹{finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete rule?"
        description={pendingDelete ? `This will permanently delete "${pendingDelete.name}".` : undefined}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (pendingDelete) deleteRule(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </motion.div>
  );
}
