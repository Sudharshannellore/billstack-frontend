import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Webhook,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  CheckCircle2,
  XCircle,
  Activity,
  RotateCw,
  KeyRound,
  Eye,
  Search,
  AlertOctagon,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";

const EVENT_TYPES = [
  "invoice.paid",
  "invoice.payment_failed",
  "subscription.created",
  "subscription.canceled",
  "customer.created",
  "topup.completed",
];

interface WebhookConfig {
  id: number;
  url: string;
  description: string;
  events: string[];
  active: boolean;
}

interface DeliveryLogEntry {
  id: number;
  webhookUrl: string;
  event: string;
  status: "delivered" | "failed" | "dead_letter";
  statusCode: number;
  timestamp: string;
  attempts: number;
  payload: string;
}

const initialWebhooks: WebhookConfig[] = [
  {
    id: 1,
    url: "https://api.acmecorp.com/webhooks/billstack",
    description: "Primary billing sync endpoint",
    events: ["invoice.paid", "invoice.payment_failed", "subscription.created"],
    active: true,
  },
  {
    id: 2,
    url: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    description: "Zapier automation for new customers",
    events: ["customer.created", "subscription.created"],
    active: true,
  },
  {
    id: 3,
    url: "https://staging.acmecorp.com/webhooks/billstack-test",
    description: "Staging environment testing",
    events: ["topup.completed", "subscription.canceled"],
    active: false,
  },
];

const initialDeliveryLog: DeliveryLogEntry[] = [
  {
    id: 1,
    webhookUrl: "https://api.acmecorp.com/webhooks/billstack",
    event: "invoice.paid",
    status: "delivered",
    statusCode: 200,
    timestamp: "Jul 28, 2026, 9:12 AM",
    attempts: 1,
    payload: '{ "id": "evt_1", "type": "invoice.paid", "data": { "id": "inv_1024", "amount": 9900 } }',
  },
  {
    id: 2,
    webhookUrl: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    event: "customer.created",
    status: "delivered",
    statusCode: 200,
    timestamp: "Jul 28, 2026, 8:47 AM",
    attempts: 1,
    payload: '{ "id": "evt_2", "type": "customer.created", "data": { "id": "cus_991" } }',
  },
  {
    id: 3,
    webhookUrl: "https://api.acmecorp.com/webhooks/billstack",
    event: "invoice.payment_failed",
    status: "failed",
    statusCode: 500,
    timestamp: "Jul 27, 2026, 6:03 PM",
    attempts: 2,
    payload: '{ "id": "evt_3", "type": "invoice.payment_failed", "data": { "id": "inv_1019" } }',
  },
  {
    id: 4,
    webhookUrl: "https://staging.acmecorp.com/webhooks/billstack-test",
    event: "topup.completed",
    status: "dead_letter",
    statusCode: 404,
    timestamp: "Jul 27, 2026, 2:21 PM",
    attempts: 5,
    payload: '{ "id": "evt_4", "type": "topup.completed", "data": { "id": "top_552" } }',
  },
  {
    id: 5,
    webhookUrl: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    event: "subscription.created",
    status: "delivered",
    statusCode: 200,
    timestamp: "Jul 26, 2026, 11:59 AM",
    attempts: 1,
    payload: '{ "id": "evt_5", "type": "subscription.created", "data": { "id": "sub_777" } }',
  },
];

const emptyForm = { url: "", description: "", events: [] as string[] };

export function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks);
  const [deliveryLog, setDeliveryLog] = useState<DeliveryLogEntry[]>(initialDeliveryLog);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [pingingId, setPingingId] = useState<number | null>(null);
  const [logQuery, setLogQuery] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState<"all" | "delivered" | "failed" | "dead_letter">("all");
  const [payloadEntry, setPayloadEntry] = useState<DeliveryLogEntry | null>(null);
  const [newSecret, setNewSecret] = useState<{ url: string; secret: string } | null>(null);

  const filteredLog = useMemo(() => {
    return deliveryLog.filter((e) => {
      if (logStatusFilter !== "all" && e.status !== logStatusFilter) return false;
      if (logQuery.trim() && !`${e.webhookUrl} ${e.event}`.toLowerCase().includes(logQuery.trim().toLowerCase())) return false;
      return true;
    });
  }, [deliveryLog, logQuery, logStatusFilter]);

  const deliveryStats = useMemo(() => {
    const delivered = deliveryLog.filter((e) => e.status === "delivered").length;
    const failed = deliveryLog.filter((e) => e.status === "failed").length;
    const dead = deliveryLog.filter((e) => e.status === "dead_letter").length;
    const total = deliveryLog.length;
    return { delivered, failed, dead, successRate: total ? Math.round((delivered / total) * 100) : 0 };
  }, [deliveryLog]);

  const retryDelivery = (id: number) => {
    setDeliveryLog((prev) => prev.map((e) => (e.id === id ? { ...e, status: "delivered", statusCode: 200, attempts: e.attempts + 1 } : e)));
    toast.success("Delivery retried successfully");
  };

  const replayFromDeadLetter = (id: number) => {
    setDeliveryLog((prev) => prev.map((e) => (e.id === id ? { ...e, status: "delivered", statusCode: 200 } : e)));
    toast.success("Event replayed from dead letter queue");
  };

  const rotateSecret = (webhook: WebhookConfig) => {
    const secret = `whsec_${Math.random().toString(36).slice(2, 18)}`;
    setNewSecret({ url: webhook.url, secret });
    toast.success("Webhook secret rotated");
  };

  const toggleEvent = (eventName: string) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.includes(eventName)
        ? prev.events.filter((e) => e !== eventName)
        : [...prev.events, eventName],
    }));
  };

  const handleSubmit = () => {
    if (!form.url || form.events.length === 0) {
      toast.error("Please provide an endpoint URL and select at least one event");
      return;
    }

    const newWebhook: WebhookConfig = {
      id: Date.now(),
      url: form.url,
      description: form.description,
      events: form.events,
      active: true,
    };

    setWebhooks((prev) => [...prev, newWebhook]);
    setForm(emptyForm);
    setIsDialogOpen(false);
    toast.success("Webhook added", {
      description: `Endpoint ${newWebhook.url} is now listening for ${newWebhook.events.length} event(s).`,
    });
  };

  const handleToggleActive = (id: number) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const handleDelete = (id: number) => {
    const target = webhooks.find((w) => w.id === id);
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    toast.success("Webhook deleted", {
      description: target ? `${target.url} has been removed.` : undefined,
    });
  };

  const handleSendTestPing = (webhook: WebhookConfig) => {
    setPingingId(webhook.id);
    toast.loading("Sending test ping...", { id: `ping-${webhook.id}` });
    setTimeout(() => {
      toast.success("Test ping delivered", {
        id: `ping-${webhook.id}`,
        description: `${webhook.url} responded with 200 OK.`,
      });
      setPingingId(null);
    }, 1200);
  };

  const dialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setForm(emptyForm);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
          <p className="text-muted-foreground">Configure event notifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={dialogOpenChange}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDialogOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Webhook</span>
          </motion.button>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Webhook</DialogTitle>
              <DialogDescription>
                Set up an endpoint to receive real-time event notifications.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://yourapp.com/webhooks/billstack"
                  value={form.url}
                  onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Events to subscribe to</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                  {EVENT_TYPES.map((eventName) => (
                    <div key={eventName} className="flex items-center gap-2">
                      <Checkbox
                        id={`event-${eventName}`}
                        checked={form.events.includes(eventName)}
                        onCheckedChange={() => toggleEvent(eventName)}
                      />
                      <Label htmlFor={`event-${eventName}`} className="font-mono text-xs font-normal cursor-pointer">
                        {eventName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-description">Description</Label>
                <Textarea
                  id="webhook-description"
                  placeholder="What is this webhook used for?"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => dialogOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 bg-card border border-border rounded-xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-2xl flex items-center justify-center mb-6">
            <Webhook className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No webhooks configured</h3>
          <p className="text-muted-foreground max-w-md">
            Set up webhooks to receive real-time notifications about events in your account.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook, index) => {
            const theme = getCardThemeByIndex(index);
            return (
              <motion.div
                key={webhook.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 bg-card border ${theme.border} rounded-xl transition-colors overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-xl pointer-events-none`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${theme.orb10} rounded-full blur-3xl pointer-events-none`} />

                <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 bg-gradient-to-br ${theme.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                      <Webhook className={`w-5 h-5 ${theme.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium font-mono text-sm break-all">{webhook.url}</div>
                      {webhook.description && (
                        <div className="text-sm text-muted-foreground mt-1">{webhook.description}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.active}
                        onCheckedChange={() => handleToggleActive(webhook.id)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {webhook.active ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={pingingId === webhook.id}
                          onClick={() => handleSendTestPing(webhook)}
                        >
                          <Send className="w-4 h-4" />
                          <span>Send test ping</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => rotateSecret(webhook)}>
                          <KeyRound className="w-4 h-4" />
                          <span>Rotate secret</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(webhook.id)}>
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap gap-2">
                  {webhook.events.map((eventName) => (
                    <Badge key={eventName} variant="outline" className="font-mono text-[11px]">
                      {eventName}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {webhooks.length > 0 && (
        <>
          {/* Delivery analytics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Delivered", value: deliveryStats.delivered, icon: CheckCircle2 },
              { label: "Failed", value: deliveryStats.failed, icon: XCircle },
              { label: "Dead Letter", value: deliveryStats.dead, icon: AlertOctagon },
              { label: "Success Rate", value: `${deliveryStats.successRate}%`, icon: BarChart3 },
            ].map((stat, i) => {
              const t = getCardThemeByIndex(i);
              return (
                <div key={stat.label} className={`relative overflow-hidden p-4 bg-card border ${t.border} rounded-2xl flex items-center gap-3`}>
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${t.topAccent} rounded-t-2xl pointer-events-none`} />
                  <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${t.iconBg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-5 h-5 ${t.iconColor}`} />
                  </div>
                  <div className="relative z-10">
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Delivery Log</h3>
                  <p className="text-sm text-muted-foreground">Recent webhook delivery attempts, including retry queue and dead letter events</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={logQuery}
                    onChange={(e) => setLogQuery(e.target.value)}
                    placeholder="Search endpoint or event…"
                    className="pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-xs outline-none w-48"
                  />
                </div>
                <select
                  value={logStatusFilter}
                  onChange={(e) => setLogStatusFilter(e.target.value as typeof logStatusFilter)}
                  className="px-3 py-2 bg-input-background border border-border rounded-lg text-xs outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed (retry queue)</option>
                  <option value="dead_letter">Dead letter</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.01] border-b border-white/[0.04]">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Endpoint</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Event</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Attempts</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredLog.map((entry, index) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-6 font-mono text-xs text-muted-foreground max-w-[240px] truncate">
                          {entry.webhookUrl}
                        </td>
                        <td className="py-3 px-6 font-mono text-xs">{entry.event}</td>
                        <td className="py-3 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded ${
                              entry.status === "delivered"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : entry.status === "dead_letter"
                                  ? "bg-rose-600/20 text-rose-400"
                                  : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {entry.status === "delivered" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : entry.status === "dead_letter" ? (
                              <AlertOctagon className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {entry.status === "delivered" ? "Delivered" : entry.status === "dead_letter" ? "Dead Letter" : "Failed"} ({entry.statusCode})
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-muted-foreground">{entry.attempts}</td>
                        <td className="py-3 px-6 text-sm text-muted-foreground">{entry.timestamp}</td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setPayloadEntry(entry)} title="View payload" className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            {entry.status === "failed" && (
                              <button onClick={() => retryDelivery(entry.id)} title="Retry" className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <RotateCw className="w-4 h-4 text-cyan-400" />
                              </button>
                            )}
                            {entry.status === "dead_letter" && (
                              <button onClick={() => replayFromDeadLetter(entry.id)} title="Replay from DLQ" className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <RotateCw className="w-4 h-4 text-rose-400" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* Payload viewer */}
      <Dialog open={!!payloadEntry} onOpenChange={(open) => !open && setPayloadEntry(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Event Payload</DialogTitle>
            <DialogDescription>{payloadEntry?.event} · {payloadEntry?.webhookUrl}</DialogDescription>
          </DialogHeader>
          <pre className="p-3 bg-background rounded-lg overflow-x-auto text-xs font-mono border border-border">{payloadEntry?.payload}</pre>
        </DialogContent>
      </Dialog>

      {/* Secret rotation reveal */}
      <Dialog open={!!newSecret} onOpenChange={(open) => !open && setNewSecret(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5 text-amber-400" />New Signing Secret</DialogTitle>
            <DialogDescription>
              For {newSecret?.url}. This secret will only be shown once — update your endpoint's signature verification immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-muted/30 rounded-lg font-mono text-sm break-all">{newSecret?.secret}</div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (newSecret) navigator.clipboard.writeText(newSecret.secret);
                toast.success("Secret copied to clipboard");
              }}
            >
              Copy Secret
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
