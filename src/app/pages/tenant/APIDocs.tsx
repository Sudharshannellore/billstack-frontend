import { motion } from "motion/react";
import { BookOpen, Copy, Check, FlaskConical, Radio, Download, Terminal, Send, Webhook, FileJson } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCardThemeByIndex } from "../../components/cardThemes";
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
    description: "All API requests require authentication using your API key",
    code: `curl https://api.billstack.com/v1/plans \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  {
    id: "plans",
    title: "Plans",
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
    "currency": "USD",
    "interval": "month"
  }'`,
        response: `{
  "id": "plan_abc123",
  "name": "Pro Plan",
  "product_id": "prod_123",
  "type": "subscription",
  "price": 99.00,
  "currency": "USD",
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
  "currency": "USD",
  "interval": "month"
}`,
      },
    ],
  },
  {
    id: "customers",
    title: "Customers",
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

export function APIDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("authentication");
  const [apiVersion, setApiVersion] = useState<"v1" | "v2">("v1");
  const [mode, setMode] = useState<"test" | "live">("test");
  const [playgroundEndpoint, setPlaygroundEndpoint] = useState(PLAYGROUND_ENDPOINTS[0]);
  const [playgroundBody, setPlaygroundBody] = useState('{\n  "customer_id": "cus_xyz789"\n}');
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-muted-foreground">
            Complete API reference for integrating BillStack into your application
          </p>
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

          <div className="flex items-center rounded-lg border border-border overflow-hidden">
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

      {apiVersion === "v2" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400"
        >
          You are viewing v2 (beta) docs — some endpoints are still test-mode-only and may change
          before general availability.
        </motion.div>
      )}

      <div className="p-3 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground">
        Showing code samples in{" "}
        <span className={mode === "live" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
          {mode === "live" ? "Live" : "Test"} Mode
        </span>{" "}
        — requests use a <code className="font-mono">{mode === "live" ? "sk_live_..." : "sk_test_..."}</code> key.
      </div>

      {/* Interactive Playground */}
      <div className={`relative p-5 bg-card border ${getCardThemeByIndex(2).border} rounded-xl overflow-hidden`}>
        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(2).topAccent} rounded-t-xl pointer-events-none`} />
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Terminal className="w-5 h-5 text-muted-foreground" />Interactive Playground</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <select
              value={playgroundEndpoint.label}
              onChange={(e) => setPlaygroundEndpoint(PLAYGROUND_ENDPOINTS.find((p) => p.label === e.target.value)!)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm outline-none"
            >
              {PLAYGROUND_ENDPOINTS.map((p) => (
                <option key={p.label} value={p.label}>{p.label}</option>
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
            <pre className="p-3 bg-background rounded-lg overflow-x-auto text-xs font-mono min-h-[140px] border border-border">
              {playgroundResponse ?? "// response will appear here"}
            </pre>
          </div>
        </div>
      </div>

      {/* SDK Downloads + spec links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`relative p-5 bg-card border ${getCardThemeByIndex(3).border} rounded-xl overflow-hidden`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(3).topAccent} rounded-t-xl pointer-events-none`} />
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Download className="w-5 h-5 text-muted-foreground" />SDK Downloads</h3>
          <div className="space-y-2">
            {SDKS.map((sdk) => (
              <div key={sdk.name} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/20 border border-border">
                <div>
                  <div className="text-sm font-medium">{sdk.name}</div>
                  <code className="text-[11px] text-muted-foreground">{sdk.cmd}</code>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(sdk.cmd); toast.success(`${sdk.name} install command copied`); }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative p-5 bg-card border ${getCardThemeByIndex(4).border} rounded-xl overflow-hidden space-y-4`}>
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(4).topAccent} rounded-t-xl pointer-events-none`} />
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><FileJson className="w-5 h-5 text-muted-foreground" />API Specs</h3>
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
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Webhook className="w-4 h-4 text-muted-foreground" />Webhook Payload Example</h3>
            <pre className="p-3 bg-background rounded-lg overflow-x-auto text-xs font-mono border border-border">{webhookExample}</pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className={`relative sticky top-6 p-4 bg-card border ${getCardThemeByIndex(0).border} rounded-xl overflow-hidden`}>
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getCardThemeByIndex(0).topAccent} rounded-t-xl pointer-events-none`} />
            <h3 className="relative z-10 text-sm font-semibold mb-4 text-muted-foreground uppercase">
              Navigation
            </h3>
            <nav className="space-y-1">
              {apiSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === section.id
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        <div className="lg:col-span-3 space-y-8">
          {apiSections.map((section, sectionIndex) => {
            const theme = getCardThemeByIndex(sectionIndex);
            return (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className={`relative p-6 bg-card border ${theme.border} rounded-xl overflow-hidden`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.topAccent} rounded-t-xl pointer-events-none`} />
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGlow} pointer-events-none`} />

              <div className="relative z-10 flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${theme.iconBg} rounded-lg flex items-center justify-center`}>
                  <BookOpen className={`w-5 h-5 ${theme.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>

              {section.code && !section.endpoints && (
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(section.code!, section.id)}
                      className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      {copiedCode === section.id ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </motion.button>
                  </div>
                  <pre className="p-4 bg-muted/30 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono text-foreground">{applyMode(section.code)}</code>
                  </pre>
                </div>
              )}

              {section.endpoints && (
                <div className="space-y-6 mt-6">
                  {section.endpoints.map((endpoint, endpointIndex) => (
                    <div
                      key={endpointIndex}
                      className="p-4 bg-muted/30 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-2 py-1 text-xs font-mono rounded ${
                            endpoint.method === "GET"
                              ? "bg-chart-2/10 text-chart-2"
                              : endpoint.method === "POST"
                              ? "bg-success/10 text-success"
                              : endpoint.method === "PUT"
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                              Request
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                copyToClipboard(
                                  endpoint.code,
                                  `${section.id}-${endpointIndex}-req`
                                )
                              }
                              className="p-1.5 bg-muted hover:bg-muted/80 rounded transition-colors"
                            >
                              {copiedCode === `${section.id}-${endpointIndex}-req` ? (
                                <Check className="w-3 h-3 text-success" />
                              ) : (
                                <Copy className="w-3 h-3 text-muted-foreground" />
                              )}
                            </motion.button>
                          </div>
                          <pre className="p-3 bg-background rounded-lg overflow-x-auto">
                            <code className="text-xs font-mono text-foreground">
                              {applyMode(endpoint.code)}
                            </code>
                          </pre>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                              Response
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                copyToClipboard(
                                  endpoint.response,
                                  `${section.id}-${endpointIndex}-res`
                                )
                              }
                              className="p-1.5 bg-muted hover:bg-muted/80 rounded transition-colors"
                            >
                              {copiedCode === `${section.id}-${endpointIndex}-res` ? (
                                <Check className="w-3 h-3 text-success" />
                              ) : (
                                <Copy className="w-3 h-3 text-muted-foreground" />
                              )}
                            </motion.button>
                          </div>
                          <pre className="p-3 bg-background rounded-lg overflow-x-auto">
                            <code className="text-xs font-mono text-foreground">
                              {endpoint.response}
                            </code>
                          </pre>
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
