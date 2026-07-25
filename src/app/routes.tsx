import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { SuperAdminLayout } from "./layouts/SuperAdminLayout";
import { TenantLayout } from "./layouts/TenantLayout";

// Centralized Page Imports
import {
  SuperAdminDashboard,
  TenantManagement,
  GlobalResources,
  PlanTemplates,
  PlatformRevenue,
  Monitoring,
  AuditLogs,
  SuperAdminSettings,
} from "./pages/super-admin";

import {
  TenantDashboard,
  Products,
  Plans,
  CreatePlan,
  PricingRules,
  Customers,
  Subscriptions,
  Usage,
  Billing,
  Invoices,
  Coupons,
  Topups,
  APIKeys,
  APILogs,
  APIDocs,
  RevenueAnalytics,
  UsageReports,
  TenantProfile,
} from "./pages/tenant";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/super-admin",
    Component: SuperAdminLayout,
    children: [
      { index: true, Component: SuperAdminDashboard },
      { path: "tenants", Component: TenantManagement },
      { path: "resources", Component: GlobalResources },
      { path: "templates", Component: PlanTemplates },
      { path: "revenue", Component: PlatformRevenue },
      { path: "monitoring", Component: Monitoring },
      { path: "audit-logs", Component: AuditLogs },
      { path: "settings", Component: SuperAdminSettings },
    ],
  },
  {
    path: "/tenant",
    Component: TenantLayout,
    children: [
      { index: true, Component: TenantDashboard },
      { path: "products", Component: Products },
      { path: "plans", Component: Plans },
      { path: "plans/create", Component: CreatePlan },
      { path: "pricing-rules", Component: PricingRules },
      { path: "customers", Component: Customers },
      { path: "subscriptions", Component: Subscriptions },
      { path: "coupons", Component: Coupons },
      { path: "topups", Component: Topups },
      { path: "usage", Component: Usage },
      { path: "billing", Component: Billing },
      { path: "invoices", Component: Invoices },
      { path: "api-keys", Component: APIKeys },
      { path: "api-logs", Component: APILogs },
      { path: "api-docs", Component: APIDocs },
      { path: "analytics/revenue", Component: RevenueAnalytics },
      { path: "analytics/usage", Component: UsageReports },
      { path: "profile", Component: TenantProfile },
    ],
  },
]);