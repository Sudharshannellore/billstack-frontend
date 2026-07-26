import { Outlet } from "react-router";
import { Sidebar, NavItem } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import {
  LayoutDashboard,
  Building2,
  Database,
  FileText,
  DollarSign,
  Activity,
  FileSearch,
  Settings,
} from "lucide-react";

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/super-admin", icon: LayoutDashboard },
  { label: "Tenants", path: "/super-admin/tenants", icon: Building2, badge: "3" },
  { label: "Global Resources", path: "/super-admin/resources", icon: Database },
  { label: "Plan Templates", path: "/super-admin/templates", icon: FileText },
  { label: "Revenue", path: "/super-admin/revenue", icon: DollarSign },
  { label: "Monitoring", path: "/super-admin/monitoring", icon: Activity },
  { label: "Audit Logs", path: "/super-admin/audit-logs", icon: FileSearch },
  { label: "Settings", path: "/super-admin/settings", icon: Settings },
];

export function SuperAdminLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar logo="BillStack" items={navItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}