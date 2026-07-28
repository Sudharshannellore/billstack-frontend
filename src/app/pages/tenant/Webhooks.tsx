import { useState } from "react";
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
  status: "delivered" | "failed";
  statusCode: number;
  timestamp: string;
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
  },
  {
    id: 2,
    webhookUrl: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    event: "customer.created",
    status: "delivered",
    statusCode: 200,
    timestamp: "Jul 28, 2026, 8:47 AM",
  },
  {
    id: 3,
    webhookUrl: "https://api.acmecorp.com/webhooks/billstack",
    event: "invoice.payment_failed",
    status: "failed",
    statusCode: 500,
    timestamp: "Jul 27, 2026, 6:03 PM",
  },
  {
    id: 4,
    webhookUrl: "https://staging.acmecorp.com/webhooks/billstack-test",
    event: "topup.completed",
    status: "failed",
    statusCode: 404,
    timestamp: "Jul 27, 2026, 2:21 PM",
  },
  {
    id: 5,
    webhookUrl: "https://hooks.zapier.com/hooks/catch/123456/abcdef",
    event: "subscription.created",
    status: "delivered",
    statusCode: 200,
    timestamp: "Jul 26, 2026, 11:59 AM",
  },
];

const emptyForm = { url: "", description: "", events: [] as string[] };

export function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks);
  const [deliveryLog] = useState<DeliveryLogEntry[]>(initialDeliveryLog);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [pingingId, setPingingId] = useState<number | null>(null);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Delivery Log</h3>
              <p className="text-sm text-muted-foreground">Recent webhook delivery attempts</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Endpoint</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Event</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {deliveryLog.map((entry, index) => (
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
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {entry.status === "delivered" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {entry.status === "delivered" ? "Delivered" : "Failed"} ({entry.statusCode})
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-muted-foreground">{entry.timestamp}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
