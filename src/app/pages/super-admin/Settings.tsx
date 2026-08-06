import { motion } from "motion/react";
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Bell,
  Webhook,
  Percent,
  Save,
  ChevronRight,
  Globe,
  Mail,
  Copy,
  KeyRound,
  DatabaseBackup,
  RefreshCw,
  Flag,
  Palette,
  MapPin,
  Megaphone,
  Gauge,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "data", label: "Data & Backup", icon: DatabaseBackup },
  { id: "platform", label: "Platform", icon: Flag },
];

export function SuperAdminSettings() {
  const sidebarTheme = getCardThemeByIndex(1);
  const contentTheme = getCardThemeByIndex(2);
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({
    autoApprove: false,
    maintenanceMode: false,
    trialEnabled: true,
    emailAlerts: true,
    slackAlerts: false,
    webhooks: true,
  });
  const [commission, setCommission] = useState("10");
  const [trialDays, setTrialDays] = useState("14");

  // SSO state
  const [ssoEnforced, setSsoEnforced] = useState(false);
  const samlMetadataUrl = "https://auth.billstack.com/saml/metadata";

  // Data & Backup state
  const [lastBackup, setLastBackup] = useState("Jul 28, 2026, 3:12 AM");
  const [runningBackup, setRunningBackup] = useState(false);
  const [retentionDays, setRetentionDays] = useState("90");

  // Platform: feature flags, white label, regions, quotas, announcements
  const [featureFlags, setFeatureFlags] = useState({
    aiInsights: true,
    usageBasedBilling: true,
    walletExpiration: false,
    newPricingEngine: true,
    customerPortalV2: false,
  });
  const [brandName, setBrandName] = useState("BillStack");
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [logoUrl, setLogoUrl] = useState("");
  const [regions, setRegions] = useState({
    "US East": true,
    "EU West": true,
    "Asia Pacific": false,
  });
  const [defaultQuota, setDefaultQuota] = useState("100000");
  const [announcement, setAnnouncement] = useState("");
  const [announcementActive, setAnnouncementActive] = useState(false);

  const toggleFeatureFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleRegion = (region: keyof typeof regions) => {
    setRegions((prev) => ({ ...prev, [region]: !prev[region] }));
  };

  const publishAnnouncement = () => {
    if (!announcement.trim()) {
      toast.error("Enter an announcement message first");
      return;
    }
    setAnnouncementActive(true);
    toast.success("Announcement published platform-wide");
  };

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSsoToggle = () => {
    const next = !ssoEnforced;
    setSsoEnforced(next);
    if (next) {
      toast.success("SSO enforcement enabled — admins must re-authenticate via SSO on next login.");
    } else {
      toast.info("SSO enforcement disabled.");
    }
  };

  const handleCopyMetadataUrl = () => {
    navigator.clipboard?.writeText(samlMetadataUrl);
    toast.success("SAML metadata URL copied to clipboard");
  };

  const handleRunBackup = () => {
    setRunningBackup(true);
    toast("Backup started…", { description: "Backing up all tenant and platform data." });
    setTimeout(() => {
      setRunningBackup(false);
      setLastBackup(new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }));
      toast.success("Backup completed");
    }, 2500);
  };

  const handleRetentionChange = (value: string) => {
    setRetentionDays(value);
    toast.success(`Data retention period set to ${value} days`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Platform Settings</h1>
        <p className="text-muted-foreground text-sm">Configure global platform behavior, security policies, and integration settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-56 shrink-0">
          <nav className={`relative overflow-hidden space-y-1 bg-card border ${sidebarTheme.border} rounded-2xl p-2`}>
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${sidebarTheme.topAccent} rounded-t-2xl pointer-events-none z-10`} />
            {/* Gradient tint */}
            <div className={`absolute inset-0 bg-gradient-to-br ${sidebarTheme.bgGlow} pointer-events-none`} />

            <div className="relative z-10 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <div className={`relative overflow-hidden flex-1 bg-card border ${contentTheme.border} rounded-2xl p-6 space-y-6`}>
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${contentTheme.topAccent} rounded-t-2xl pointer-events-none z-10`} />
          {/* Gradient tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${contentTheme.bgGlow} pointer-events-none`} />
          {/* Glow orb */}
          <div className={`absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br ${contentTheme.bgGlow} rounded-full blur-3xl pointer-events-none`} />

          <div className="relative z-10 space-y-6">
            {activeTab === "general" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Platform Configuration</h2>
                <p className="text-xs text-muted-foreground">Core billing and tenant management settings.</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                  <label className="block text-xs font-bold text-white mb-2">Default Commission Rate (%)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={commission}
                      onChange={e => setCommission(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white focus:outline-none transition-all"
                    />
                    <div className="flex items-center gap-1 text-sm text-primary font-black">
                      <Percent className="w-4 h-4" />
                      {commission}%
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                  <label className="block text-xs font-bold text-white mb-2">Trial Period (days)</label>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={e => setTrialDays(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: "autoApprove", label: "Auto-approve Tenants", desc: "Automatically approve new tenant registrations without manual review." },
                  { key: "maintenanceMode", label: "Maintenance Mode", desc: "Put the platform in maintenance mode to block external access." },
                  { key: "trialEnabled", label: "Allow Trial Accounts", desc: "Enable free trial period for newly registered tenants." },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                    <div className="flex-1 pr-4">
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <Switch
                      checked={toggles[item.key as keyof typeof toggles]}
                      onCheckedChange={() => toggle(item.key as keyof typeof toggles)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Security Policies</h2>
                <p className="text-xs text-muted-foreground">Authentication and access control settings.</p>
              </div>
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <KeyRound className="w-4 h-4 text-primary" /> Single Sign-On
                  </div>
                  <Switch checked={ssoEnforced} onCheckedChange={handleSsoToggle} />
                </div>
                <p className="text-xs text-muted-foreground -mt-2">Require SSO login for all admins across the platform.</p>
                <div>
                  <label className="block text-xs font-bold text-white mb-2">SAML Metadata URL</label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={samlMetadataUrl}
                      className="font-mono text-xs bg-white/[0.02] border-white/[0.08] text-muted-foreground"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleCopyMetadataUrl}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Notification Channels</h2>
                <p className="text-xs text-muted-foreground">Configure how platform alerts and events are delivered.</p>
              </div>
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <label className="block text-xs font-bold text-white mb-2">Alert Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    defaultValue="ops@billstack.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>
              {[
                { key: "emailAlerts", label: "Email Alerts", desc: "Send critical system alerts to the configured email address." },
                { key: "slackAlerts", label: "Slack Alerts", desc: "Post system notifications to a configured Slack channel." },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                  <div className="flex-1 pr-4">
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <Switch
                    checked={toggles[item.key as keyof typeof toggles]}
                    onCheckedChange={() => toggle(item.key as keyof typeof toggles)}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "webhooks" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Webhook Configuration</h2>
                <p className="text-xs text-muted-foreground">Send real-time event payloads to external systems.</p>
              </div>
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <label className="block text-xs font-bold text-white mb-2">Webhook Endpoint URL</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="url"
                    defaultValue="https://hooks.example.com/billstack"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white font-mono focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <div>
                  <div className="text-xs font-bold text-white">Enable Webhooks</div>
                  <div className="text-xs text-muted-foreground">Deliver real-time platform events to the configured endpoint.</div>
                </div>
                <Switch checked={toggles.webhooks} onCheckedChange={() => toggle("webhooks")} />
              </div>
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <label className="block text-xs font-bold text-white mb-2">Signing Secret</label>
                <input
                  type="password"
                  defaultValue="whsec_abc123secretkey"
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white font-mono focus:outline-none transition-all"
                />
              </div>
            </motion.div>
          )}

          {activeTab === "data" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Data & Backup</h2>
                <p className="text-xs text-muted-foreground">Automated backup schedule and data retention policy.</p>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Last automated backup</div>
                    <div className="text-sm font-bold text-white">{lastBackup}</div>
                    <div className="text-xs text-muted-foreground">Backup frequency: Daily</div>
                  </div>
                  <Button
                    onClick={handleRunBackup}
                    disabled={runningBackup}
                    className="gap-2 shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${runningBackup ? "animate-spin" : ""}`} />
                    {runningBackup ? "Running Backup…" : "Run Backup Now"}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <label className="block text-xs font-bold text-white mb-2">Data Retention Period</label>
                <p className="text-xs text-muted-foreground mb-3">How long deleted records and logs are retained before permanent purge.</p>
                <Select value={retentionDays} onValueChange={handleRetentionChange}>
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {activeTab === "platform" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Platform Administration</h2>
                <p className="text-xs text-muted-foreground">Feature flags, white-labeling, regional deployments, quotas, and announcements.</p>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <Flag className="w-4 h-4 text-primary" /> Feature Flags
                </div>
                {Object.entries(featureFlags).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <Switch checked={value} onCheckedChange={() => toggleFeatureFlag(key as keyof typeof featureFlags)} />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <Palette className="w-4 h-4 text-primary" /> White Label
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Brand Name</label>
                  <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/[0.08] bg-transparent" />
                      <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 px-3 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Logo URL</label>
                    <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…" className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <MapPin className="w-4 h-4 text-primary" /> Regional Deployments
                </div>
                {Object.entries(regions).map(([region, enabled]) => (
                  <div key={region} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">{region}</span>
                    <Switch checked={enabled} onCheckedChange={() => toggleRegion(region as keyof typeof regions)} />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-2">
                  <Gauge className="w-4 h-4 text-primary" /> Default Tenant Quota (API calls/mo)
                </div>
                <input
                  type="number"
                  value={defaultQuota}
                  onChange={(e) => setDefaultQuota(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white focus:outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground mt-2">Applied to newly onboarded tenants; existing tenants keep their current quota.</p>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <Megaphone className="w-4 h-4 text-primary" /> Platform Announcement
                </div>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Scheduled maintenance on Aug 3rd, 2–4 AM UTC."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white focus:outline-none transition-all resize-none"
                />
                {announcementActive && announcement && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    Live preview: {announcement}
                  </div>
                )}
                <Button onClick={publishAnnouncement} className="gap-2">
                  <Megaphone className="w-4 h-4" /> Publish Announcement
                </Button>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-white/[0.04]">
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all ${
                saved 
                  ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                  : "bg-gradient-to-r from-primary to-violet-600 text-white shadow-primary/20"
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </motion.button>
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
