import { motion } from "motion/react";
import { Key, Plus, Copy, RotateCw, Trash2, ShieldAlert, BarChart3, Globe, Gauge, CalendarClock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import type { ApiScope } from "../../types/common";

const SCOPE_OPTIONS = [
  "Read Plans",
  "Write Plans",
  "Read Customers",
  "Write Customers",
  "Read Subscriptions",
  "Write Subscriptions",
  "Read Usage Events",
  "Write Usage Events",
];

type Environment = "Test" | "Live";

interface ApiKeyRecord {
  id: number;
  name: string;
  key: string;
  scopes: string[];
  environment: Environment;
  created: string;
  lastUsed: string;
  accessScopes: ApiScope[];
  ipWhitelist: string;
  rateLimit: number;
  expiresAt: string;
  requestsThisMonth: number;
}

const ACCESS_SCOPES: ApiScope[] = ["read", "write", "delete", "admin"];
const requestSeries = [1200, 1800, 1500, 2100, 2600, 2300, 3100, 2800, 3400, 3900, 3600, 4200];

let keyIdCounter = 1000;
let hexCounter = 0;

/** Generates a fixed-length pseudo-random-looking hex string without relying on crypto/Math.random. */
function generateHex(length: number): string {
  const chars = "0123456789abcdef";
  let out = "";
  let seed = (Date.now() % 100000) + hexCounter * 7919;
  for (let i = 0; i < length; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    out += chars[seed % chars.length];
  }
  hexCounter++;
  return out;
}

function generateKeyValue(environment: Environment) {
  const prefix = environment === "Live" ? "sk_live_" : "sk_test_";
  return `${prefix}${generateHex(32)}`;
}

function maskKey(key: string) {
  const last4 = key.slice(-4);
  return `${key.slice(0, 8)}${"*".repeat(24)}${last4}`;
}

const initialKeys: ApiKeyRecord[] = [
  {
    id: 1,
    name: "Production Key",
    key: generateKeyValue("Live"),
    scopes: ["Read Plans", "Read Customers", "Read Subscriptions"],
    environment: "Live",
    created: "Jan 15, 2026",
    lastUsed: "2 hours ago",
    accessScopes: ["read"],
    ipWhitelist: "203.0.113.5, 198.51.100.0/24",
    rateLimit: 1000,
    expiresAt: "Never",
    requestsThisMonth: 284000,
  },
  {
    id: 2,
    name: "Development Key",
    key: generateKeyValue("Test"),
    scopes: ["Read Plans", "Write Plans", "Read Usage Events", "Write Usage Events"],
    environment: "Test",
    created: "Feb 3, 2026",
    lastUsed: "5 minutes ago",
    accessScopes: ["read", "write"],
    ipWhitelist: "Any",
    rateLimit: 100,
    expiresAt: "Dec 31, 2026",
    requestsThisMonth: 41200,
  },
];

export function APIKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(initialKeys);

  const [generateOpen, setGenerateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([]);
  const [newKeyEnv, setNewKeyEnv] = useState<Environment>("Test");
  const [newAccessScopes, setNewAccessScopes] = useState<ApiScope[]>(["read"]);
  const [newIpWhitelist, setNewIpWhitelist] = useState("");
  const [newRateLimit, setNewRateLimit] = useState(100);
  const [newExpiresAt, setNewExpiresAt] = useState("Never");

  const [revealKey, setRevealKey] = useState<{ name: string; key: string } | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyRecord | null>(null);
  const [analyticsTarget, setAnalyticsTarget] = useState<ApiKeyRecord | null>(null);

  const toggleScope = (scope: string) => {
    setNewKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const toggleAccessScope = (scope: ApiScope) => {
    setNewAccessScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));
  };

  const resetGenerateForm = () => {
    setNewKeyName("");
    setNewKeyScopes([]);
    setNewKeyEnv("Test");
    setNewAccessScopes(["read"]);
    setNewIpWhitelist("");
    setNewRateLimit(100);
    setNewExpiresAt("Never");
  };

  const handleGenerate = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    if (newKeyScopes.length === 0) {
      toast.error("Select at least one scope");
      return;
    }

    const keyValue = generateKeyValue(newKeyEnv);
    const record: ApiKeyRecord = {
      id: keyIdCounter++,
      name: newKeyName.trim(),
      key: keyValue,
      scopes: newKeyScopes,
      environment: newKeyEnv,
      created: "Just now",
      lastUsed: "Never",
      accessScopes: newAccessScopes.length > 0 ? newAccessScopes : ["read"],
      ipWhitelist: newIpWhitelist.trim() || "Any",
      rateLimit: newRateLimit,
      expiresAt: newExpiresAt,
      requestsThisMonth: 0,
    };

    setApiKeys((prev) => [record, ...prev]);
    setGenerateOpen(false);
    resetGenerateForm();
    setRevealKey({ name: record.name, key: keyValue });
    toast.success("API key generated");
  };

  const handleRotate = (target: ApiKeyRecord) => {
    const keyValue = generateKeyValue(target.environment);
    setApiKeys((prev) =>
      prev.map((k) => (k.id === target.id ? { ...k, key: keyValue, created: k.created, lastUsed: "Never" } : k))
    );
    setRevealKey({ name: target.name, key: keyValue });
    toast.success(`${target.name} rotated`);
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;
    setApiKeys((prev) => prev.filter((k) => k.id !== revokeTarget.id));
    toast.success(`${revokeTarget.name} revoked`);
    setRevokeTarget(null);
  };

  const copyRevealedKey = () => {
    if (!revealKey) return;
    navigator.clipboard.writeText(revealKey.key);
    toast.success("Copied to clipboard");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">Manage your API authentication keys</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGenerateOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Generate Key</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {apiKeys.map((keyRecord, index) => {
          const theme = getCardThemeByIndex(index);
          return (
            <motion.div
              key={keyRecord.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 bg-card border ${theme.border} rounded-xl transition-colors overflow-hidden`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-xl pointer-events-none`} />
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
              {/* Glow orb */}
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${theme.orb10} rounded-full blur-3xl pointer-events-none`} />

              <div className="relative z-10 flex items-start justify-between mb-4 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${theme.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Key className={`w-5 h-5 ${theme.iconColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{keyRecord.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          keyRecord.environment === "Live"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        }
                      >
                        {keyRecord.environment}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Created {keyRecord.created}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setAnalyticsTarget(keyRecord)}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleRotate(keyRecord)}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive"
                    onClick={() => setRevokeTarget(keyRecord)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Revoke
                  </Button>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg font-mono text-sm">
                <span>{maskKey(keyRecord.key)}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-muted rounded-lg shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(maskKey(keyRecord.key));
                    toast.success("Masked key copied");
                  }}
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>

              <div className="relative z-10 flex items-center gap-2 flex-wrap mt-3">
                {keyRecord.accessScopes.map((scope) => (
                  <Badge key={scope} className="font-normal uppercase text-[10px]">
                    {scope}
                  </Badge>
                ))}
                {keyRecord.scopes.map((scope) => (
                  <Badge key={scope} variant="secondary" className="font-normal">
                    {scope}
                  </Badge>
                ))}
              </div>

              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{keyRecord.ipWhitelist}</div>
                <div className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" />{keyRecord.rateLimit} req/min</div>
                <div className="flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" />Expires {keyRecord.expiresAt}</div>
                <div className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" />{keyRecord.requestsThisMonth.toLocaleString()} reqs/mo</div>
              </div>

              <div className="relative z-10 text-sm text-muted-foreground mt-3">
                Last used {keyRecord.lastUsed}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Generate key dialog */}
      <Dialog
        open={generateOpen}
        onOpenChange={(open) => {
          setGenerateOpen(open);
          if (!open) resetGenerateForm();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
            <DialogDescription>
              Choose a name, scopes, and environment for the new key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g. Production Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Scopes</Label>
              <div className="grid grid-cols-2 gap-3">
                {SCOPE_OPTIONS.map((scope) => (
                  <label
                    key={scope}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={newKeyScopes.includes(scope)}
                      onCheckedChange={() => toggleScope(scope)}
                    />
                    {scope}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Environment</Label>
              <Select value={newKeyEnv} onValueChange={(val) => setNewKeyEnv(val as Environment)}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Test">Test</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Access Level</Label>
              <div className="flex items-center gap-3 flex-wrap">
                {ACCESS_SCOPES.map((scope) => (
                  <label key={scope} className="flex items-center gap-2 text-sm cursor-pointer capitalize">
                    <Checkbox checked={newAccessScopes.includes(scope)} onCheckedChange={() => toggleAccessScope(scope)} />
                    {scope}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                <Input id="ip-whitelist" placeholder="Any" value={newIpWhitelist} onChange={(e) => setNewIpWhitelist(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate-limit">Rate Limit (req/min)</Label>
                <Input id="rate-limit" type="number" value={newRateLimit} onChange={(e) => setNewRateLimit(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires-at">Expiration</Label>
              <Input id="expires-at" placeholder="Never" value={newExpiresAt} onChange={(e) => setNewExpiresAt(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate}>Generate Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal-once dialog */}
      <Dialog open={!!revealKey} onOpenChange={(open) => !open && setRevealKey(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Copy your API key now
            </DialogTitle>
            <DialogDescription>
              For security reasons, this key will only be shown once. Store it somewhere safe —
              you won't be able to view it again.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg font-mono text-sm break-all">
            <span>{revealKey?.key}</span>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRevealKey(null)}>
              Done
            </Button>
            <Button onClick={copyRevealedKey} className="gap-1.5">
              <Copy className="w-4 h-4" />
              Copy Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke confirmation dialog */}
      <Dialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke "{revokeTarget?.name}"? Any application using this
              key will immediately lose access. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke}>
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Usage analytics dialog */}
      <Dialog open={!!analyticsTarget} onOpenChange={(open) => !open && setAnalyticsTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>{analyticsTarget?.name} — Usage Analytics</span>
            </DialogTitle>
            <DialogDescription>Requests over the last 12 days.</DialogDescription>
          </DialogHeader>
          {analyticsTarget && (
            <div className="space-y-4">
              <div className="flex items-end gap-1.5 h-24">
                {requestSeries.map((v, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-primary to-primary-dark rounded-t" style={{ height: `${(v / Math.max(...requestSeries)) * 100}%` }} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Requests this month</div>
                  <div className="text-lg font-bold">{analyticsTarget.requestsThisMonth.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Last Used</div>
                  <div className="text-lg font-bold">{analyticsTarget.lastUsed}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
