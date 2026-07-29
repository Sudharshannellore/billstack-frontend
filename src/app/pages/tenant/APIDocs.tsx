import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Copy,
  Check,
  FlaskConical,
  Radio,
  Download,
  Terminal,
  Send,
  Webhook,
  FileJson,
  Search,
  KeyRound,
  Layers,
  Users,
  Repeat,
  Gauge,
  Sparkles,
  Hash,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const apiSections = [
  {
    id: "authentication",
    title: "Authentication",
    icon: KeyRound,
    accent: { text: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/10 border border-cyan-500/20", top: "from-cyan-500 to-sky-500", ring: "bg-cyan-500" },
    description: "All API requests require authentication using your API key",
    code: `curl https://api.billstack.com/v1/plans \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  {
    id: "plans",
    title: "Plans",
    icon: Layers,
    accent: { text: "text-purple-400", bg: "from-purple-500/20 to-indigo-500/10 border border-purple-500/20", top: "from-purple-500 to-indigo-500", ring: "bg-purple-500" },
    description: "Create and manage pricing plans",
    endpoints: [
      {
        method: "POST",
        path: "/v1/plans",
        description: "Create a new plan",
        code: `curl -X POST https://api.billstack.com/v1/plans \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Pro Plan",
    "product_id": "prod_123",
    "type": "subscription",
    "price": 99.00,
    "currency": "INR",
    "interval": "month"
  }'`,
        response: `{
  "id": "plan_abc123",
  "name": "Pro Plan",
  "product_id": "prod_123",
  "type": "subscription",
  "price": 99.00,
  "currency": "INR",
  "interval": "month",
  "created_at": "2026-04-13T10:30:00Z"
}`,
      },
      {
        method: "GET",
        path: "/v1/plans",
        description: "List all plans",
        code: `curl https://api.billstack.com/v1/plans \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{
  "data": [
    {
      "id": "plan_abc123",
      "name": "Pro Plan",
      "price": 99.00,
      "interval": "month"
    }
  ],
  "has_more": false
}`,
      },
      {
        method: "GET",
        path: "/v1/plans/:id",
        description: "Retrieve a specific plan",
        code: `curl https://api.billstack.com/v1/plans/plan_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{
  "id": "plan_abc123",
  "name": "Pro Plan",
  "product_id": "prod_123",
  "price": 99.00,
  "currency": "INR",
  "interval": "month"
}`,
      },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    icon: Users,
    accent: { text: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/10 border border-emerald-500/20", top: "from-emerald-500 to-teal-500", ring: "bg-emerald-500" },
    description: "Manage your customer base",
    endpoints: [
      {
        method: "POST",
        path: "/v1/customers",
        description: "Create a new customer",
        code: `curl -X POST https://api.billstack.com/v1/customers \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "customer@example.com",
    "name": "John Doe",
    "metadata": {
      "company": "Acme Inc"
    }
  }'`,
        response: `{
  "id": "cus_xyz789",
  "email": "customer@example.com",
  "name": "John Doe",
  "metadata": {
    "company": "Acme Inc"
  },
  "created_at": "2026-04-13T10:30:00Z"
}`,
      },
      {
        method: "GET",
        path: "/v1/customers/:id",
        description: "Retrieve customer details",
        code: `curl https://api.billstack.com/v1/customers/cus_xyz789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{
  "id": "cus_xyz789",
  "email": "customer@example.com",
  "name": "John Doe",
  "subscriptions": ["sub_123", "sub_456"],
  "balance": 0
}`,
      },
      {
        method: "PUT",
        path: "/v1/customers/:id",
        description: "Update customer information",
        code: `curl -X PUT https://api.billstack.com/v1/customers/cus_xyz789 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "metadata": {
      "company": "New Corp"
    }
  }'`,
        response: `{
  "id": "cus_xyz789",
  "email": "customer@example.com",
  "name": "Jane Doe",
  "metadata": {
    "company": "New Corp"
  }
}`,
      },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    icon: Repeat,
    accent: { text: "text-amber-400", bg: "from-amber-500/20 to-orange-500/10 border border-amber-500/20", top: "from-amber-500 to-orange-500", ring: "bg-amber-500" },
    description: "Manage customer subscriptions",
    endpoints: [
      {
        method: "POST",
        path: "/v1/subscriptions",
        description: "Create a subscription",
        code: `curl -X POST https://api.billstack.com/v1/subscriptions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "cus_xyz789",
    "plan_id": "plan_abc123",
    "trial_days": 14
  }'`,
        response: `{
  "id": "sub_def456",
  "customer_id": "cus_xyz789",
  "plan_id": "plan_abc123",
  "status": "trialing",
  "trial_end": "2026-04-27T10:30:00Z",
  "current_period_start": "2026-04-13T10:30:00Z",
  "current_period_end": "2026-05-13T10:30:00Z"
}`,
      },
      {
        method: "PUT",
        path: "/v1/subscriptions/:id",
        description: "Update a subscription",
        code: `curl -X PUT https://api.billstack.com/v1/subscriptions/sub_def456 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "plan_id": "plan_xyz999"
  }'`,
        response: `{
  "id": "sub_def456",
  "customer_id": "cus_xyz789",
  "plan_id": "plan_xyz999",
  "status": "active",
  "message": "Plan upgrade scheduled for next billing cycle"
}`,
      },
      {
        method: "POST",
        path: "/v1/subscriptions/:id/pause",
        description: "Pause a subscription",
        code: `curl -X POST https://api.billstack.com/v1/subscriptions/sub_def456/pause \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{
  "id": "sub_def456",
  "status": "paused",
  "paused_at": "2026-04-13T10:30:00Z"
}`,
      },
      {
        method: "POST",
        path: "/v1/subscriptions/:id/resume",
        description: "Resume a paused subscription",
        code: `curl -X POST https://api.billstack.com/v1/subscriptions/sub_def456/resume \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{
  "id": "sub_def456",
  "status": "active",
  "resumed_at": "2026-04-13T10:30:00Z"
}`,
      },
      {
        method: "DELETE",
        path: "/v1/subscriptions/:id",
        description: "Cancel a subscription",
        code: `curl -X DELETE https://api.billstack.com/v1/subscriptions/sub_def456 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{
  "id": "sub_def456",
  "status": "canceled",
  "canceled_at": "2026-04-13T10:30:00Z",
  "ends_at": "2026-05-13T10:30:00Z"
}`,
      },
    ],
  },
  {
    id: "usage",
    title: "Usage Reporting",
    icon: Gauge,
    accent: { text: "text-rose-400", bg: "from-rose-500/20 to-pink-500/10 border border-rose-500/20", top: "from-rose-500 to-pink-500", ring: "bg-rose-500" },
    description: "Report metered usage for usage-based billing",
    endpoints: [
      {
        method: "POST",
        path: "/v1/usage",
        description: "Report usage events",
        code: `curl -X POST https://api.billstack.com/v1/usage \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "cus_xyz789",
    "subscription_id": "sub_def456",
    "metric": "api_calls",
    "quantity": 1500,
    "timestamp": "2026-04-13T10:30:00Z"
  }'`,
        response: `{
  "id": "usage_123abc",
  "customer_id": "cus_xyz789",
  "subscription_id": "sub_def456",
  "metric": "api_calls",
  "quantity": 1500,
  "timestamp": "2026-04-13T10:30:00Z",
  "status": "processed"
}`,
      },
      {
        method: "POST",
        path: "/v1/usage/batch",
        description: "Report multiple usage events",
        code: `curl -X POST https://api.billstack.com/v1/usage/batch \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "events": [
      {
        "customer_id": "cus_xyz789",
        "metric": "api_calls",
        "quantity": 100
      },
      {
        "customer_id": "cus_abc123",
        "metric": "storage_gb",
        "quantity": 50
      }
    ]
  }'`,
        response: `{
  "processed": 2,
  "failed": 0,
  "events": [
    {"id": "usage_1", "status": "processed"},
    {"id": "usage_2", "status": "processed"}
  ]
}`,
      },
      {
        method: "GET",
        path: "/v1/usage",
        description: "Retrieve usage data",
        code: `curl "https://api.billstack.com/v1/usage?customer_id=cus_xyz789&start_date=2026-04-01&end_date=2026-04-13" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
        response: `{
  "data": [
    {
      "date": "2026-04-13",
      "metric": "api_calls",
      "quantity": 1500
    },
    {
      "date": "2026-04-12",
      "metric": "api_calls",
      "quantity": 1200
    }
  ],
  "total": 2700
}`,
      },
    ],
  },
];

const SDKS = [
  { name: "Node.js", cmd: "npm install @billstack/node" },
  { name: "Python", cmd: "pip install billstack" },
  { name: "Go", cmd: "go get github.com/billstack/billstack-go" },
  { name: "Java", cmd: "implementation 'com.billstack:billstack-java:1.0'" },
  { name: "PHP", cmd: "composer require billstack/billstack-php" },
];

const webhookExample = `{
  "id": "evt_1a2b3c",
  "type": "invoice.paid",
  "created": "2026-04-13T10:30:00Z",
  "data": {
    "object": {
      "id": "inv_1024",
      "customer_id": "cus_xyz789",
      "amount": 9900,
      "status": "paid"
    }
  }
}`;

const PLAYGROUND_ENDPOINTS = [
  { label: "GET /v1/plans", method: "GET", path: "/v1/plans", response: `{ "data": [ { "id": "plan_abc123", "name": "Pro Plan" } ] }` },
  { label: "GET /v1/customers/:id", method: "GET", path: "/v1/customers/cus_xyz789", response: `{ "id": "cus_xyz789", "email": "customer@example.com" }` },
  { label: "POST /v1/subscriptions", method: "POST", path: "/v1/subscriptions", response: `{ "id": "sub_def456", "status": "trialing" }` },
];

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  POST: "bg-success/10 text-success border-success/20",
  PUT: "bg-warning/10 text-warning border-warning/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
};

/** Lightweight token highlighter for curl/JSON code samples — no external syntax-highlighter dependency. */
const TOKEN_REGEX =
  /("[^"\\]*"(?=\s*:))|("[^"\\]*")|(\bhttps?:\/\/[^\s"'\\]+\b)|(^curl\b)|((?<=\s|^)-{1,2}[A-Za-z][\w-]*)|(\b-?\d+(?:\.\d+)?\b)|(\b(?:true|false|null)\b)/gm;

const TOKEN_CLASSES = [
  "text-sky-400", // 1: object key
  "text-emerald-400", // 2: string
  "text-cyan-400", // 3: url
  "text-pink-400 font-semibold", // 4: curl keyword
  "text-purple-400", // 5: flag
  "text-amber-400", // 6: number
  "text-purple-400", // 7: boolean/null
];

function highlightCode(code: string) {
  const regex = new RegExp(TOKEN_REGEX);
  const nodes: { text: string; className?: string }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code))) {
    if (match.index > lastIndex) nodes.push({ text: code.slice(lastIndex, match.index) });
    const groupIndex = match.slice(1).findIndex((g) => g !== undefined);
    nodes.push({ text: match[0], className: TOKEN_CLASSES[groupIndex] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < code.length) nodes.push({ text: code.slice(lastIndex) });
  return nodes;
}

function CodeBlock({
  code,
  label,
  copied,
  onCopy,
}: {
  code: string;
  label?: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="relative rounded-lg border border-border bg-[#0b0b0f] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          {label && (
            <span className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-wider">{label}</span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCopy}
          className="p-1.5 hover:bg-white/5 rounded-md transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
        </motion.button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
        <code className="font-mono">
          {highlightCode(code).map((node, i) =>
            node.className ? (
              <span key={i} className={node.className}>
                {node.text}
              </span>
            ) : (
              <span key={i}>{node.text}</span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}

export function APIDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("authentication");
  const [apiVersion, setApiVersion] = useState<"v1" | "v2">("v1");
  const [mode, setMode] = useState<"test" | "live">("test");
  const [search, setSearch] = useState("");
  const [playgroundEndpoint, setPlaygroundEndpoint] = useState(PLAYGROUND_ENDPOINTS[0]);
  const [playgroundBody, setPlaygroundBody] = useState('{\n  "customer_id": "cus_xyz789"\n}');
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const totalEndpoints = useMemo(
    () => apiSections.reduce((sum, s) => sum + (s.endpoints?.length ?? 1), 0),
    [],
  );

  const filteredSections = useMemo(() => {
    if (!search.trim()) return apiSections;
    const q = search.toLowerCase();
    return apiSections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.endpoints?.some((e) => e.path.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
    );
  }, [search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );
    apiSections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const goToSection = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sendPlaygroundRequest = () => {
    setPlaygroundLoading(true);
    setPlaygroundResponse(null);
    setTimeout(() => {
      setPlaygroundLoading(false);
      setPlaygroundResponse(playgroundEndpoint.response);
    }, 700);
  };

  const applyMode = (code: string) =>
    code.replace(/YOUR_API_KEY/g, mode === "live" ? "sk_live_51NxYourLiveKey" : "sk_test_51NxYourTestKey");

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(applyMode(code));
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Hero header */}
      <div className="relative rounded-2xl border border-border overflow-hidden bg-gradient-to-br from-primary/10 via-[#0b0b0f] to-indigo-500/5 p-6 sm:p-8">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <Sparkles className="w-3 h-3" />
              Developer Docs
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Complete API reference for integrating BillStack into your application.
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" /> {totalEndpoints} endpoints
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> {apiSections.length} resources
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Select value={apiVersion} onValueChange={(val) => setApiVersion(val as "v1" | "v2")}>
              <SelectTrigger className="w-[160px] bg-card">
                <SelectValue placeholder="Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">v1</SelectItem>
                <SelectItem value="v2">v2 (beta)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-lg border border-border overflow-hidden bg-card">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMode("test")}
                className={`rounded-none gap-1.5 ${
                  mode === "test" ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Test Mode
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMode("live")}
                className={`rounded-none gap-1.5 ${
                  mode === "live" ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                Live Mode
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {apiVersion === "v2" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="relative z-10 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400"
            >
              You are viewing v2 (beta) docs — some endpoints are still test-mode-only and may change before general
              availability.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 mt-4 p-3 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground">
          Showing code samples in{" "}
          <span className={mode === "live" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
            {mode === "live" ? "Live" : "Test"} Mode
          </span>{" "}
          — requests use a <code className="font-mono">{mode === "live" ? "sk_live_..." : "sk_test_..."}</code> key.
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="relative p-5 bg-card border border-cyan-500/20 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-sky-500 rounded-t-xl pointer-events-none" />
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-muted-foreground" />
          Interactive Playground
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <select
              value={playgroundEndpoint.label}
              onChange={(e) => setPlaygroundEndpoint(PLAYGROUND_ENDPOINTS.find((p) => p.label === e.target.value)!)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none"
            >
              {PLAYGROUND_ENDPOINTS.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>
            <textarea
              value={playgroundBody}
              onChange={(e) => setPlaygroundBody(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-xs font-mono outline-none"
            />
            <button
              onClick={sendPlaygroundRequest}
              disabled={playgroundLoading}
              className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {playgroundLoading ? "Sending…" : "Send Request"}
            </button>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-2">Response</div>
            <div className="rounded-lg border border-border bg-[#0b0b0f] min-h-[140px] p-3 overflow-x-auto">
              <pre className="text-xs font-mono">
                {playgroundResponse ? (
                  <code>
                    {highlightCode(playgroundResponse).map((node, i) =>
                      node.className ? (
                        <span key={i} className={node.className}>
                          {node.text}
                        </span>
                      ) : (
                        <span key={i}>{node.text}</span>
                      ),
                    )}
                  </code>
                ) : (
                  <span className="text-muted-foreground/50">// response will appear here</span>
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* SDK Downloads + spec links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative p-5 bg-card border border-purple-500/20 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-xl pointer-events-none" />
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 text-muted-foreground" />
            SDK Downloads
          </h3>
          <div className="space-y-2">
            {SDKS.map((sdk) => (
              <div
                key={sdk.name}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/20 border border-border hover:border-purple-500/30 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium">{sdk.name}</div>
                  <code className="text-[11px] text-muted-foreground">{sdk.cmd}</code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sdk.cmd);
                    toast.success(`${sdk.name} install command copied`);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="relative p-5 bg-card border border-amber-500/20 rounded-xl overflow-hidden space-y-4">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-xl pointer-events-none" />
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-muted-foreground" />
              API Specs
            </h3>
            <div className="flex flex-wrap gap-2">
              {["OpenAPI 3.0", "Swagger UI", "Postman Collection"].map((spec) => (
                <button
                  key={spec}
                  onClick={() => toast.info(`${spec} export`, { description: "Mock export — no real file generated." })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-border text-muted-foreground hover:bg-muted/30 transition-colors"
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Webhook className="w-4 h-4 text-muted-foreground" />
              Webhook Payload Example
            </h3>
            <CodeBlock
              code={webhookExample}
              label="json"
              copied={copiedCode === "webhook-example"}
              onCopy={() => copyToClipboard(webhookExample, "webhook-example")}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="relative sticky top-6 bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search docs…"
                  className="w-full pl-8 pr-3 py-1.5 bg-input-background border border-border rounded-lg text-xs outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <nav className="p-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => goToSection(section.id)}
                    className={`relative w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="api-docs-nav-active"
                        className="absolute inset-0 bg-primary rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : section.accent.text}`} />
                    <span className={isActive ? "text-white" : ""}>{section.title}</span>
                    {section.endpoints && (
                      <span
                        className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {section.endpoints.length}
                      </span>
                    )}
                  </button>
                );
              })}
              {filteredSections.length === 0 && (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">No matching sections</div>
              )}
            </nav>
          </div>
        </motion.div>

        <div className="lg:col-span-3 space-y-8">
          {apiSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: sectionIndex * 0.05 }}
                className="relative p-6 bg-card border border-border rounded-xl overflow-hidden scroll-mt-6"
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${section.accent.top} rounded-t-xl pointer-events-none`} />

                <div className="relative z-10 flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${section.accent.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${section.accent.text}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>

                {section.code && !section.endpoints && (
                  <CodeBlock
                    code={applyMode(section.code)}
                    label="curl"
                    copied={copiedCode === section.id}
                    onCopy={() => copyToClipboard(section.code!, section.id)}
                  />
                )}

                {section.endpoints && (
                  <div className="space-y-6 mt-6">
                    {section.endpoints.map((endpoint, endpointIndex) => (
                      <div key={endpointIndex} className="p-4 bg-muted/20 rounded-lg border border-border">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded-md border ${METHOD_STYLES[endpoint.method]}`}
                          >
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Request</div>
                            <CodeBlock
                              code={applyMode(endpoint.code)}
                              copied={copiedCode === `${section.id}-${endpointIndex}-req`}
                              onCopy={() => copyToClipboard(endpoint.code, `${section.id}-${endpointIndex}-req`)}
                            />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Response</div>
                            <CodeBlock
                              code={endpoint.response}
                              copied={copiedCode === `${section.id}-${endpointIndex}-res`}
                              onCopy={() => copyToClipboard(endpoint.response, `${section.id}-${endpointIndex}-res`)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-gradient-to-br from-primary/10 to-primary-dark/10 border border-primary/20 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Check out our comprehensive guides, tutorials, and support resources.
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
              >
                View Guides
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium"
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
