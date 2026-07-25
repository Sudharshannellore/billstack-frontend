import { Outlet } from "react-router";
import { Sidebar, NavItem } from "../components/Sidebar";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Repeat,
  Activity,
  FileText,
  Key,
  BookOpen,
  BarChart3,
  User,
  Zap,
} from "lucide-react";

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/tenant", icon: LayoutDashboard },
  { label: "Products", path: "/tenant/products", icon: Package },
  { label: "Plans", path: "/tenant/plans", icon: CreditCard },
  { label: "Customers", path: "/tenant/customers", icon: Users },
  { label: "Subscriptions", path: "/tenant/subscriptions", icon: Repeat },
  { label: "Coupons", path: "/tenant/coupons", icon: FileText },
  { label: "Top-ups", path: "/tenant/topups", icon: Zap },
  { label: "Usage", path: "/tenant/usage", icon: Activity },
  { label: "Invoices", path: "/tenant/invoices", icon: FileText },
  { label: "API Keys", path: "/tenant/api-keys", icon: Key },
  { label: "API Docs", path: "/tenant/api-docs", icon: BookOpen },
  { label: "Analytics", path: "/tenant/analytics/revenue", icon: BarChart3 },
  { label: "Profile", path: "/tenant/profile", icon: User },
];

export function TenantLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar logo="BillStack" items={navItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}