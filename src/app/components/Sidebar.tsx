import { useState } from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./ui/utils";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

interface SidebarProps {
  logo: string;
  items: NavItem[];
}

export function Sidebar({ logo, items }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" || path === "/super-admin" || path === "/tenant") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
      className="h-full bg-sidebar border-r border-sidebar-border flex flex-col relative shrink-0"
    >
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-6 z-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="h-16 flex items-center px-6 border-b border-sidebar-border overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-semibold text-foreground whitespace-nowrap">{logo}</span>
          )}
        </motion.div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link key={item.path} to={item.path} title={collapsed ? item.label : undefined}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: collapsed ? 0 : 4 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer",
                  collapsed && "justify-center",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-dark/10 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium relative z-10 whitespace-nowrap">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full relative z-10">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
