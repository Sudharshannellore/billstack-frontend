import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { StatusPage } from "./pages/StatusPage";
import { CustomerPortal } from "./pages/portal/CustomerPortal";
import { SuperAdminLayout } from "./layouts/SuperAdminLayout";
import { TenantLayout } from "./layouts/TenantLayout";

// Centralized Page Imports
import {
  SuperAdminDashboard,
  TenantManagement,
  CreateTenant,
  GlobalResources,
  CreateResource,
  PlanTemplates,
  CreateTemplate,
  PlatformRevenue,
  Monitoring,
  AuditLogs,
  SuperAdminSettings,
} from "./pages/super-admin";

import {
  TenantDashboard,
  Products,
  CreateProduct,
  Plans,
  CreatePlan,
  PricingRules,
  Customers,
  CreateCustomer,
  Subscriptions,
  CreateSubscription,
  AddSubscriptionTopup,
  Usage,
  Billing,
  Invoices,
  Coupons,
  CreateCoupon,
  Topups,
  CreateTopup,
  APIKeys,
  APILogs,
  APIDocs,
  RevenueAnalytics,
  UsageReports,
  TenantProfile,
  Wallet,
  Webhooks,
} from "./pages/tenant";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/status",
    Component: StatusPage,
  },
  {
    path: "/portal",
    Component: CustomerPortal,
  },
  {
    path: "/super-admin",
    Component: SuperAdminLayout,
    children: [
      { index: true, Component: SuperAdminDashboard },
      { path: "tenants", Component: TenantManagement },
      { path: "tenants/create", Component: CreateTenant },
      { path: "resources", Component: GlobalResources },
      { path: "resources/create", Component: CreateResource },
      { path: "templates", Component: PlanTemplates },
      { path: "templates/create", Component: CreateTemplate },
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
      { path: "products/create", Component: CreateProduct },
      { path: "plans", Component: Plans },
      { path: "plans/create", Component: CreatePlan },
      { path: "pricing-rules", Component: PricingRules },
      { path: "customers", Component: Customers },
      { path: "customers/create", Component: CreateCustomer },
      { path: "subscriptions", Component: Subscriptions },
      { path: "subscriptions/create", Component: CreateSubscription },
      { path: "subscriptions/:subscriptionId/add-topup", Component: AddSubscriptionTopup },
      { path: "coupons", Component: Coupons },
      { path: "coupons/create", Component: CreateCoupon },
      { path: "topups", Component: Topups },
      { path: "topups/create", Component: CreateTopup },
      { path: "wallet", Component: Wallet },
      { path: "usage", Component: Usage },
      { path: "billing", Component: Billing },
      { path: "webhooks", Component: Webhooks },
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