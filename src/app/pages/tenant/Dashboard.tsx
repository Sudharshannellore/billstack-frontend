import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { StatCard } from "../../components/StatCard";
import { getCardThemeByIndex } from "../../components/cardThemes";
import { formatMoney } from "../../components/currency";
import {
  IndianRupee,
  Users,
  Repeat,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  Maximize2,
  Minimize2,
  Save,
  RotateCcw,
  Wallet as WalletIcon,
  FileText,
  CalendarClock,
  Bell,
  Server,
  GripVertical,
} from "lucide-react";
import { Link } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

const revenueData = [
  { id: "mon", date: "Mon", revenue: 4200 },
  { id: "tue", date: "Tue", revenue: 3800 },
  { id: "wed", date: "Wed", revenue: 5100 },
  { id: "thu", date: "Thu", revenue: 4600 },
  { id: "fri", date: "Fri", revenue: 6200 },
  { id: "sat", date: "Sat", revenue: 5800 },
  { id: "sun", date: "Sun", revenue: 4900 },
];

const planDistribution = [
  { id: "pro", name: "Pro Plan", value: 45, color: "#8B5CF6" },
  { id: "business", name: "Business Plan", value: 30, color: "#06B6D4" },
  { id: "enterprise", name: "Enterprise Custom", value: 15, color: "#10B981" },
  { id: "free", name: "Free Tier", value: 10, color: "#71717A" },
];

const recentSubscriptions = [
  { customer: "Alice Johnson", plan: "Pro Plan", amount: "₹2,999/mo", status: "active", email: "alice@example.com" },
  { customer: "Bob Smith", plan: "Business Plan", amount: "₹9,999/mo", status: "active", email: "bob@company.com" },
  { customer: "Carol White", plan: "Enterprise Custom", amount: "₹29,999/mo", status: "trial", email: "carol@startup.io" },
  { customer: "David Brown", plan: "Pro Plan", amount: "₹2,999/mo", status: "active", email: "david@tech.com" },
];

type WidgetSize = "sm" | "md" | "lg";
const SIZE_SPAN: Record<WidgetSize, string> = { sm: "lg:col-span-4", md: "lg:col-span-6", lg: "lg:col-span-12" };
const NEXT_SIZE: Record<WidgetSize, WidgetSize> = { sm: "md", md: "lg", lg: "sm" };

interface WidgetDef {
  id: string;
  title: string;
  render: () => ReactNode;
}

const STORAGE_KEY = "billstack_dashboard_layout_v1";

function WidgetShell({
  title,
  themeIndex,
  children,
  size,
  onCycleSize,
  draggableProps,
}: {
  title: string;
  themeIndex: number;
  children: ReactNode;
  size: WidgetSize;
  onCycleSize: () => void;
  draggableProps: React.HTMLAttributes<HTMLDivElement>;
}) {
  const theme = getCardThemeByIndex(themeIndex);
  return (
    <div
      {...draggableProps}
      className={`relative p-5 bg-card border ${theme.border} rounded-2xl overflow-hidden group ${SIZE_SPAN[size]}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-2xl pointer-events-none`} />
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <button
          onClick={onCycleSize}
          title="Resize widget"
          className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {size === "lg" ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function TenantDashboard() {
  const [widgetOrder, setWidgetOrder] = useState<string[]>([
    "revenue", "planShare", "customers", "usage", "wallet", "invoices", "renewals", "apiHealth", "notifications",
  ]);
  const [widgetSizes, setWidgetSizes] = useState<Record<string, WidgetSize>>({
    revenue: "lg", planShare: "md", customers: "md", usage: "sm", wallet: "sm",
    invoices: "sm", renewals: "md", apiHealth: "sm", notifications: "sm",
  });
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.order) setWidgetOrder(parsed.order);
        if (parsed.sizes) setWidgetSizes(parsed.sizes);
      }
    } catch {
      // ignore malformed saved layout
    }
  }, []);

  const saveLayout = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ order: widgetOrder, sizes: widgetSizes }));
    toast.success("Dashboard layout saved");
  };

  const resetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setWidgetOrder(["revenue", "planShare", "customers", "usage", "wallet", "invoices", "renewals", "apiHealth", "notifications"]);
    setWidgetSizes({ revenue: "lg", planShare: "md", customers: "md", usage: "sm", wallet: "sm", invoices: "sm", renewals: "md", apiHealth: "sm", notifications: "sm" });
    toast.info("Dashboard layout reset to default");
  };

  const cycleSize = (id: string) => {
    setWidgetSizes((prev) => ({ ...prev, [id]: NEXT_SIZE[prev[id] ?? "md"] }));
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setWidgetOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragId);
      const to = next.indexOf(targetId);
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
    setDragId(null);
  };

  const widgets: Record<string, WidgetDef> = {
    revenue: {
      id: "revenue",
      title: "Revenue Operations Overview",
      render: () => (
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0B0B0F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    planShare: {
      id: "planShare",
      title: "Active Plan Share",
      render: () => (
        <div>
          <div className="h-[150px] w-full flex items-center justify-center relative mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={58} paddingAngle={3} dataKey="value">
                  {planDistribution.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active</span>
              <span className="text-lg font-extrabold text-white">892</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-muted-foreground">{plan.name}</span>
                </div>
                <span className="font-bold text-white">{plan.value}%</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    customers: {
      id: "customers",
      title: "Recent Active Subscriptions",
      render: () => (
        <div className="space-y-2">
          {recentSubscriptions.map((sub, index) => (
            <div key={index} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/[0.08] flex items-center justify-center font-bold text-[10px]">
                  {sub.customer.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="font-medium text-white">{sub.customer}</span>
              </div>
              <span className="font-bold text-white">{sub.amount}</span>
            </div>
          ))}
          <Link to="/tenant/subscriptions" className="flex items-center gap-1 text-xs text-primary font-bold hover:underline pt-1">
            <span>Manage all subscriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ),
    },
    usage: {
      id: "usage",
      title: "Usage",
      render: () => (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">API Calls</span><span className="font-bold">1,53,500</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Storage</span><span className="font-bold">64.2 GB</span></div>
          <Link to="/tenant/usage" className="text-xs text-primary font-bold hover:underline">View usage explorer →</Link>
        </div>
      ),
    },
    wallet: {
      id: "wallet",
      title: "Wallet",
      render: () => (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-2xl font-black text-white"><WalletIcon className="w-5 h-5 text-primary" />{formatMoney(19270, "INR", { compact: true })}</div>
          <p className="text-xs text-muted-foreground">Total balance across 6 customer wallets</p>
          <Link to="/tenant/wallet" className="text-xs text-primary font-bold hover:underline">Manage wallet →</Link>
        </div>
      ),
    },
    invoices: {
      id: "invoices",
      title: "Invoices",
      render: () => (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-2xl font-black text-white"><FileText className="w-5 h-5 text-primary" />3 overdue</div>
          <p className="text-xs text-muted-foreground">₹499 total overdue across 1 invoice</p>
          <Link to="/tenant/billing" className="text-xs text-primary font-bold hover:underline">Review invoices →</Link>
        </div>
      ),
    },
    renewals: {
      id: "renewals",
      title: "Upcoming Renewals",
      render: () => (
        <div className="space-y-2 text-sm">
          {[
            { name: "Alice Johnson", date: "Aug 15" },
            { name: "Bob Smith", date: "Aug 18" },
            { name: "Carol White", date: "Aug 20" },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="flex items-center gap-2"><CalendarClock className="w-3.5 h-3.5 text-muted-foreground" />{r.name}</span>
              <span className="text-muted-foreground">{r.date}</span>
            </div>
          ))}
        </div>
      ),
    },
    apiHealth: {
      id: "apiHealth",
      title: "API Health",
      render: () => (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><Server className="w-4 h-4 text-emerald-400" /><span className="font-bold text-emerald-400">All systems operational</span></div>
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>P99 latency</span><span>142ms</span></div>
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Uptime (30d)</span><span>99.98%</span></div>
        </div>
      ),
    },
    notifications: {
      id: "notifications",
      title: "Notifications",
      render: () => (
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2"><Bell className="w-3.5 h-3.5 text-amber-400 mt-0.5" /><span className="text-xs text-muted-foreground">Payment failed for Bob Smith's subscription</span></div>
          <div className="flex items-start gap-2"><Bell className="w-3.5 h-3.5 text-primary mt-0.5" /><span className="text-xs text-muted-foreground">3 customers trial ending this week</span></div>
          <Link to="/tenant/profile" className="text-xs text-primary font-bold hover:underline">Notification preferences →</Link>
        </div>
      ),
    },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Upper Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Business Dashboard</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Live Feed
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Here's your aggregated SaaS performance and billing lifecycle operations.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetLayout}
            className="px-4 py-3 bg-transparent border border-border rounded-xl text-foreground text-sm font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Layout</span>
          </button>
          <button
            onClick={saveLayout}
            className="px-4 py-3 bg-transparent border border-border rounded-xl text-foreground text-sm font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Layout</span>
          </button>
          <Link to="/tenant/plans/create">
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary-dark hover:to-violet-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Create New Plan</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Monthly Revenue" value={formatMoney(34680, "INR", { compact: true })} change="+18%" changeType="positive" icon={IndianRupee} delay={0} colorIndex={0} />
        <StatCard title="Active Customers" value="1.28K" change="+12%" changeType="positive" icon={Users} delay={0.1} colorIndex={1} />
        <StatCard title="Active Subscriptions" value="892" change="+8%" changeType="positive" icon={Repeat} delay={0.2} colorIndex={2} />
        <StatCard title="API Events Ingested" value="2.4M" change="+32%" changeType="positive" icon={Activity} delay={0.3} colorIndex={5} />
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <GripVertical className="w-3.5 h-3.5" />
        Drag the handle to reorder widgets, or hover a widget to resize it. Layouts persist locally per browser.
      </p>

      {/* Widget grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {widgetOrder.map((id) => {
          const widget = widgets[id];
          if (!widget) return null;
          return (
            <div
              key={id}
              draggable
              onDragStart={() => setDragId(id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(id)}
              className={SIZE_SPAN[widgetSizes[id] ?? "md"]}
            >
              <WidgetShell
                title={widget.title}
                themeIndex={Object.keys(widgets).indexOf(id)}
                size={widgetSizes[id] ?? "md"}
                onCycleSize={() => cycleSize(id)}
                draggableProps={{}}
              >
                {widget.render()}
              </WidgetShell>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
