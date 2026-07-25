import { motion } from "motion/react";
import { BookOpen, Copy, Check } from "lucide-react";
import { useState } from "react";

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

export function APIDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("authentication");

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-muted-foreground">
          Complete API reference for integrating BillStack into your application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-6 p-4 bg-card border border-border rounded-xl">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase">
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
          {apiSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="p-6 bg-card border border-border rounded-xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
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
                    <code className="text-sm font-mono text-foreground">{section.code}</code>
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
                              {endpoint.code}
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
          ))}

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
