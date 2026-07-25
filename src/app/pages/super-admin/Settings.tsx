import { motion } from "motion/react";
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Bell, 
  Webhook, 
  Percent, 
  Users, 
  Save,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Globe,
  Mail
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${enabled ? "bg-primary" : "bg-white/10"}`}
    >
      <motion.span
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}

export function SuperAdminSettings() {
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

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <nav className="space-y-1 bg-card border border-white/[0.06] rounded-2xl p-2">
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
          </nav>
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-card border border-white/[0.06] rounded-2xl p-6 space-y-6">
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
                    <Toggle
                      enabled={toggles[item.key as keyof typeof toggles]}
                      onChange={() => toggle(item.key as keyof typeof toggles)}
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
              {[
                { label: "Session Timeout (minutes)", defaultValue: "60" },
                { label: "Max Failed Login Attempts", defaultValue: "5" },
                { label: "Minimum Password Length", defaultValue: "12" },
              ].map(field => (
                <div key={field.label} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                  <label className="block text-xs font-bold text-white mb-2">{field.label}</label>
                  <input
                    type="number"
                    defaultValue={field.defaultValue}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.08] focus:border-primary/50 rounded-xl text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              ))}
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" /> Two-Factor Authentication
                </div>
                <p className="text-xs text-muted-foreground mb-3">Enforce 2FA for all admin accounts. This will require all admins to re-authenticate.</p>
                <Toggle enabled={true} onChange={() => {}} />
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
                  <Toggle
                    enabled={toggles[item.key as keyof typeof toggles]}
                    onChange={() => toggle(item.key as keyof typeof toggles)}
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
                <Toggle enabled={toggles.webhooks} onChange={() => toggle("webhooks")} />
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
    </motion.div>
  );
}
