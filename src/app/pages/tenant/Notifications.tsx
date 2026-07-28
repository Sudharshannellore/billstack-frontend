import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, Slack, Webhook as WebhookIcon, Bell, Send, History, FileText } from "lucide-react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { StatusBadge } from "../../components/StatusBadge";

type ChannelKey = "email" | "sms" | "slack" | "teams" | "discord" | "webhook";

const CHANNELS: { key: ChannelKey; label: string; icon: typeof Mail; connected: boolean }[] = [
  { key: "email", label: "Email", icon: Mail, connected: true },
  { key: "sms", label: "SMS", icon: MessageSquare, connected: true },
  { key: "slack", label: "Slack", icon: Slack, connected: true },
  { key: "teams", label: "Microsoft Teams", icon: Bell, connected: false },
  { key: "discord", label: "Discord", icon: Bell, connected: false },
  { key: "webhook", label: "Webhook", icon: WebhookIcon, connected: true },
];

const PREFERENCE_EVENTS = [
  "Invoice paid", "Payment failed", "Subscription cancelled", "Trial ending soon",
  "Wallet low balance", "Usage quota exceeded", "New customer signup",
];

const TEMPLATES = [
  { id: "t1", name: "Invoice Paid", channel: "email" as ChannelKey, subject: "Your invoice has been paid" },
  { id: "t2", name: "Payment Failed", channel: "email" as ChannelKey, subject: "Action needed: payment failed" },
  { id: "t3", name: "Trial Ending", channel: "sms" as ChannelKey, subject: "Your trial ends in 3 days" },
  { id: "t4", name: "Low Wallet Balance", channel: "slack" as ChannelKey, subject: "Wallet balance below threshold" },
];

const DELIVERY_HISTORY = [
  { id: "d1", channel: "Email", event: "Invoice paid", recipient: "alice@example.com", status: "delivered", time: "2 hours ago" },
  { id: "d2", channel: "Slack", event: "Low wallet balance", recipient: "#billing-alerts", status: "delivered", time: "5 hours ago" },
  { id: "d3", channel: "SMS", event: "Trial ending soon", recipient: "+1 415 555 0102", status: "failed", time: "1 day ago" },
  { id: "d4", channel: "Webhook", event: "Payment failed", recipient: "https://api.acmecorp.com/hooks", status: "delivered", time: "2 days ago" },
];

export function Notifications() {
  const [enabledChannels, setEnabledChannels] = useState<Record<ChannelKey, boolean>>({
    email: true, sms: true, slack: true, teams: false, discord: false, webhook: true,
  });
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFERENCE_EVENTS.map((e) => [e, true])),
  );

  const toggleChannel = (key: ChannelKey) => {
    setEnabledChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePreference = (event: string) => {
    setPreferences((prev) => ({ ...prev, [event]: !prev[event] }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
        <p className="text-muted-foreground">Manage channels, delivery preferences, and message templates</p>
      </div>

      <Tabs defaultValue="channels">
        <TabsList>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Delivery History</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map((channel, i) => {
              const t = getCardThemeByIndex(i);
              return (
                <div key={channel.key} className={`relative overflow-hidden p-4 bg-card border ${t.border} rounded-2xl`}>
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${t.topAccent} rounded-t-2xl pointer-events-none`} />
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.iconBg} flex items-center justify-center`}>
                      <channel.icon className={`w-5 h-5 ${t.iconColor}`} />
                    </div>
                    <Switch checked={enabledChannels[channel.key]} onCheckedChange={() => toggleChannel(channel.key)} />
                  </div>
                  <div className="font-medium text-sm">{channel.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{channel.connected ? "Connected" : "Not connected"}</div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <div className={`relative bg-card border ${getCardThemeByIndex(1).border} rounded-2xl overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(1).topAccent} rounded-t-2xl pointer-events-none`} />
            <div className="relative z-10 divide-y divide-border">
              {PREFERENCE_EVENTS.map((event) => (
                <div key={event} className="flex items-center justify-between p-4">
                  <span className="text-sm">{event}</span>
                  <Switch checked={preferences[event]} onCheckedChange={() => togglePreference(event)} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map((tpl, i) => {
              const t = getCardThemeByIndex(i);
              return (
                <div key={tpl.id} className={`relative overflow-hidden p-4 bg-card border ${t.border} rounded-2xl`}>
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${t.topAccent} rounded-t-2xl pointer-events-none`} />
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{tpl.name}</span>
                    <span className="ml-auto px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-muted-foreground border border-white/[0.06] capitalize">{tpl.channel}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{tpl.subject}</p>
                  <button
                    onClick={() => toast.success(`Test "${tpl.name}" sent`, { description: "Mock delivery — no real message was sent." })}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Send test
                  </button>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className={`relative bg-card border ${getCardThemeByIndex(2).border} rounded-2xl overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-2xl pointer-events-none z-10`} />
            <table className="w-full relative z-10">
              <thead className="bg-white/[0.01] border-b border-white/[0.04]">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Channel</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Event</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Recipient</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {DELIVERY_HISTORY.map((d) => (
                  <tr key={d.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-6 text-sm flex items-center gap-2"><History className="w-3.5 h-3.5 text-muted-foreground" />{d.channel}</td>
                    <td className="py-3 px-6 text-sm">{d.event}</td>
                    <td className="py-3 px-6 text-sm text-muted-foreground">{d.recipient}</td>
                    <td className="py-3 px-6"><StatusBadge status={d.status} /></td>
                    <td className="py-3 px-6 text-sm text-muted-foreground">{d.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
