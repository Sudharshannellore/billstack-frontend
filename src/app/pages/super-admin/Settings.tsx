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
  Globe,
  Mail,
  UserPlus,
  Copy,
  KeyRound,
  DatabaseBackup,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "data", label: "Data & Backup", icon: DatabaseBackup },
];

type MemberRole = "Owner" | "Admin" | "Billing" | "Read-only";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  lastActive: string;
  pending?: boolean;
}

const initialTeam: TeamMember[] = [
  { id: 1, name: "Priya Sharma", email: "priya@billstack.com", role: "Owner", lastActive: "Just now" },
  { id: 2, name: "Marcus Lee", email: "marcus@billstack.com", role: "Admin", lastActive: "2 hours ago" },
  { id: 3, name: "Elena Ortiz", email: "elena@billstack.com", role: "Billing", lastActive: "1 day ago" },
  { id: 4, name: "Sam Whitfield", email: "sam@billstack.com", role: "Read-only", lastActive: "5 days ago" },
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

  // Team / RBAC state
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("Read-only");

  // SSO state
  const [ssoEnforced, setSsoEnforced] = useState(false);
  const samlMetadataUrl = "https://auth.billstack.com/saml/metadata";

  // Data & Backup state
  const [lastBackup, setLastBackup] = useState("Jul 28, 2026, 3:12 AM");
  const [runningBackup, setRunningBackup] = useState(false);
  const [retentionDays, setRetentionDays] = useState("90");

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: TeamMember = {
      id: Date.now(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      lastActive: "Never",
      pending: true,
    };
    setTeam(prev => [...prev, newMember]);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("Read-only");
    toast.success(`Invite sent to ${newMember.email}`);
  };

  const handleRoleChange = (id: number, role: MemberRole) => {
    setTeam(prev => prev.map(m => (m.id === id ? { ...m, role } : m)));
    toast.success("Role updated");
  };

  const handleRemoveMember = (id: number) => {
    const member = team.find(m => m.id === id);
    if (!member || member.role === "Owner") return;
    if (!window.confirm(`Remove ${member.name} from the team?`)) return;
    setTeam(prev => prev.filter(m => m.id !== id));
    toast.success(`${member.name} removed from team`);
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

          {activeTab === "team" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white mb-1">Team Members</h2>
                  <p className="text-xs text-muted-foreground">Manage platform admin access and roles.</p>
                </div>
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <UserPlus className="w-4 h-4" /> Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>Send an invitation to join the platform admin team.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="invite-email">Email</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          placeholder="name@company.com"
                          value={inviteEmail}
                          onChange={e => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={inviteRole} onValueChange={v => setInviteRole(v as MemberRole)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Read-only">Read-only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                      <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>Send Invite</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border border-white/[0.06] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/[0.06]">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.map(member => (
                      <TableRow key={member.id} className="border-white/[0.06]">
                        <TableCell className="font-semibold text-white">
                          {member.name}
                          {member.pending && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.email}</TableCell>
                        <TableCell>
                          <Select
                            value={member.role}
                            onValueChange={v => handleRoleChange(member.id, v as MemberRole)}
                            disabled={member.role === "Owner"}
                          >
                            <SelectTrigger size="sm" className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Owner">Owner</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Billing">Billing</SelectItem>
                              <SelectItem value="Read-only">Read-only</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5"
                            disabled={member.role === "Owner"}
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
