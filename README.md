
# Design BillStack SaaS Application

This is a code bundle for Design BillStack SaaS Application. The original project is available at https://www.figma.com/design/ScYAVxnwlarOAxL2MOxwZn/Design-BillStack-SaaS-Application.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

---

## Feature & Page Report

BillStack is a UI/UX prototype for a multi-tenant billing platform, built as a single Vite + React SPA with two main admin surfaces (a **Super-Admin** console for the platform operator and a **Tenant** console for a billing customer), plus a small set of public/marketing and end-customer pages. There is no backend integration — every page manages its own mock data in local state and simulates submissions with `console.log` + toast notifications.

### Tech Stack

- **Framework:** Vite 6, React 18.3, TypeScript
- **Routing:** `react-router` v7 (`createBrowserRouter`), one static route table in `src/app/routes.tsx`, nested layout routes with `<Outlet/>`
- **Styling/UI:** Tailwind CSS v4 + a locally vendored shadcn/ui component set (Radix UI primitives), `class-variance-authority` + `tailwind-merge`/`clsx`. Dark theme is forced globally.
- **Animation:** `motion` (Framer Motion successor) for transitions, staggered reveals, animated wizards, and shared-layout highlights
- **Charts:** `recharts` (Area/Bar/Line/Pie) across dashboards and analytics pages
- **Forms:** `react-hook-form` for wizard-style "Create*" pages; plain `useState` forms elsewhere
- **Toasts:** `sonner`
- **Dates:** `date-fns` + `react-day-picker`
- **State management:** No global store — each page owns its own mock data via `useState`; a couple of pages export their mock arrays for a related detail page to reuse (e.g. `Products.tsx` → `ProductDetails.tsx`). The tenant dashboard layout persists to `localStorage`.
- **Auth:** Not implemented — navigation between consoles is a plain UI choice; "Login as Tenant" impersonation is a client-side visual mock only.

### Routing

Single centralized route table (`src/app/routes.tsx`) using `createBrowserRouter`, statically imported (no code-splitting) via barrel files `pages/super-admin/index.ts` and `pages/tenant/index.ts`.

- `/` — Landing
- `/status` — Status page
- `/portal` — Customer self-service portal
- `/super-admin/*` — layout route (`SuperAdminLayout`) with 11 child routes
- `/tenant/*` — layout route (`TenantLayout`) with 29 child routes

`TenantSignup.tsx` exists in the codebase but is not currently wired into the route table.

---

### Public / Marketing Pages

| Page | Route | Description |
|---|---|---|
| **Landing** | `/` | Animated marketing homepage with a hero, an interactive "Choose Your Billing Architecture" simulator (subscription/usage/credits/telecom modes with live mock metrics and a copyable code snippet), a features grid, and an FAQ accordion. Links into both consoles. |
| **StatusPage** | `/status` | Public system-status page: overall health banner, per-service 30-day uptime strips, and a past-incidents list. |
| **TenantSignup** | *(unrouted)* | 4-step onboarding wizard (Company Info → Business Type → Monetization → Review) with an animated stepper. |
| **CustomerPortal** | `/portal` | End-customer self-service billing page: current plan card, payment method card with an update dialog, usage progress bar, and an invoice history table with CSV/text download. |

### Super-Admin Console (`/super-admin/*`)

Platform-operator surface for managing tenants, global resources, plan templates, platform revenue, infra health, and platform settings.

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/super-admin` | Platform KPI cards, an aggregated MRR area chart, a top-tenant volume bar chart, and a live system-action feed. |
| **TenantManagement** | `/super-admin/tenants` | Active/Pending tenant table with search, health/quota bars, approve/reject flow, and a "Login as Tenant" impersonation mock. |
| **CreateTenant** | `/super-admin/tenants/create` | Form to create a tenant (name, admin email, status, plan); usable as a page or embedded dialog. |
| **GlobalResources** | `/super-admin/resources` | Card grid of platform-wide metered resources (trades, API calls, data GB, compute hours) with usage/growth stats. |
| **CreateResource** | `/super-admin/resources/create` | Form to define a new global metered resource. |
| **PlanTemplates** | `/super-admin/templates` | Reusable pricing-blueprint cards tenants can adopt, with duplicate/delete actions. |
| **CreateTemplate** | `/super-admin/templates/create` | Form to author a new plan template. |
| **PlatformRevenue** | `/super-admin/revenue` | KPI cards, platform-vs-commission area chart, top-tenant revenue bars, and an ASC 606 revenue-recognition chart. |
| **Monitoring** | `/super-admin/monitoring` | Infra health dashboard: latency/DB/error/uptime metrics, an auto-refreshing response-time chart, and per-service status. |
| **AuditLogs** | `/super-admin/audit-logs` | Filterable/searchable audit log with category and severity filters, CSV export. |
| **Settings** | `/super-admin/settings` | Tabbed platform settings: General, Security (2FA/SSO), Team (RBAC + invite), Notifications, Webhooks, Data & Backup, and Platform (feature flags, white-labeling, regional deployment, quotas, announcements). |

### Tenant Console (`/tenant/*`)

The core billing-management surface for a tenant admin.

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/tenant` | Drag-and-drop, resizable widget dashboard (persisted to `localStorage`): revenue chart, plan-share pie, recent subscriptions, usage, wallet, invoices, renewals, API health, notifications. |
| **Products** | `/tenant/products` | Product catalog with search/filter, bulk actions, adoption-rate bars, and per-card lifecycle actions (clone, status cycle, archive, delete). |
| **ProductDetails** | `/tenant/products/:productId` | Product detail with stat cards and Overview/Activity/Notes tabs. |
| **CreateProduct** | `/tenant/products/create` | 2-step wizard (Identity → Publish) for creating a product. |
| **Plans** | `/tenant/plans` | Pricing plan table across 10 billing models, with version history, features, a customer-facing preview, an interactive price calculator, and plan comparison. |
| **CreatePlan** | `/tenant/plans/create` | 4-step wizard (Product → Billing Style → Payment Type → Configuration) with a live preview and proration preview when editing. |
| **PricingRules** | `/tenant/pricing-rules` | IF-THEN pricing rule engine with conflict detection and a live rule simulator. |
| **Customers** | `/tenant/customers` | Customer table with health scores, segments, and CSV export. |
| **CustomerDetails** | `/tenant/customers/:customerId` | Tabbed 360° customer view: subscriptions, invoices, wallet, usage, payments, timeline, notes. |
| **CreateCustomer** | `/tenant/customers/create` | Customer creation form. |
| **Subscriptions** | `/tenant/subscriptions` | Subscription table with renewal-risk badges, proration/forecast/timeline dialogs, and status transitions. |
| **CreateSubscription** | `/tenant/subscriptions/create` | 2-step wizard (Customer → Subscription Details). |
| **AddSubscriptionTopup** | `/tenant/subscriptions/:subscriptionId/add-topup` | Attaches a top-up to an existing subscription. |
| **Coupons** | `/tenant/coupons` | Coupon management (percentage/fixed/referral/free-trial/first-invoice/campaign) with usage bars and expiry countdowns. |
| **CreateCoupon** | `/tenant/coupons/create` | 3-step wizard (Target → Identity → Offer) with a date-picker for expiry. |
| **Topups** | `/tenant/topups` | Top-up pack catalog with redemption progress and active/draft toggles. |
| **CreateTopup** | `/tenant/topups/create` | 2-step wizard (Target → Price & Pack). |
| **Wallet** | `/tenant/wallet` | Customer wallet balances, auto-recharge config, and a transaction ledger. |
| **Usage** | `/tenant/usage` | Usage-event explorer: multi-metric charts and a live event stream table. |
| **UsageReports** | `/tenant/analytics/usage` | Lightweight 3-stat usage summary (API calls, storage, active users). |
| **Billing** | `/tenant/billing` | Billing-run history, upcoming renewals/charges, and payment-method management. |
| **Webhooks** | `/tenant/webhooks` | Webhook endpoint CRUD, delivery status, signing secrets, and test-send actions. |
| **Invoices** | `/tenant/invoices` | Invoice list/detail with line items, tax breakdown, status badges, resend/download. |
| **Notifications** | `/tenant/notifications` | Notification-center settings: channel toggles, event preferences, templates, delivery history. |
| **AIAssistant** | `/tenant/ai-assistant` | Mock AI insights: churn-risk predictions, pricing recommendations, anomaly detection, MRR forecast, and a canned Q&A box. |
| **APIKeys** | `/tenant/api-keys` | API key management: scopes, environments, IP whitelist, rate limits, per-key usage chart, revoke/rotate. |
| **APILogs** | `/tenant/api-logs` | Request log viewer with detail dialogs and CSV export. |
| **APIDocs** | `/tenant/api-docs` | Static interactive API reference with copyable curl snippets and sample responses. |
| **RevenueAnalytics** | `/tenant/analytics/revenue` | Time-range analytics: gross/net/expenses chart, plan-revenue pie, and cohort-retention chart. |
| **Profile** | `/tenant/profile` | Tenant/org settings: General, Notifications, Security tabs. |

### Shared Feature Components

| Component | Purpose |
|---|---|
| `layouts/TenantLayout`, `layouts/SuperAdminLayout` | Sidebar shell + `<Outlet/>` for each console. |
| `components/Sidebar` | Collapsible animated nav rail with active-route highlighting. |
| `components/Topbar`, `NotificationCenter` | Global header search and notification bell popover. |
| `components/DataTable` | Generic table primitive: search, sort, pagination, selection, loading/empty/error states. |
| `components/cardThemes` | Central color-theme palette applied consistently to cards app-wide. |
| `components/StatCard`, `StatusBadge` | Reusable KPI card and a single source of truth for ~30 domain status pill stylings. |
| `components/BulkActionsBar`, `ConfirmDialog` | Multi-select action bar and confirm/destructive-action dialog. |
| `components/EmptyState`, `ErrorState`, `TableSkeleton` | Shared list placeholder states. |
| `components/billing/BillingStyleSelector` | Shared 4-option billing-model picker used by plan/top-up wizards. |
| `components/currency.ts`, `exportToCsv.ts` | Currency formatting helpers and a generic CSV export utility. |
| `components/ui/*` | Full shadcn/ui primitive set (button, dialog, table, tabs, form, calendar, chart wrapper, etc.). |
| `types/common.ts` | Shared domain enums (product/subscription/invoice/coupon/wallet statuses, API scopes) and shared interfaces. |
| `data/mock-plans.ts` | Shared mock product/plan fixtures reused across creation wizards. |
