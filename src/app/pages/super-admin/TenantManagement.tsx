import { motion, AnimatePresence } from "motion/react";
import { Building2, Check, X, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";

const allTenants = [
  { name: "Acme Corp", email: "admin@acme.com", status: "active", revenue: "$28.5K", users: 245, joined: "Jan 15, 2026" },
  { name: "TechFlow", email: "team@techflow.io", status: "active", revenue: "$24.2K", users: 189, joined: "Feb 3, 2026" },
  { name: "DataHub", email: "hello@datahub.co", status: "active", revenue: "$18.9K", users: 156, joined: "Mar 8, 2026" },
  { name: "CloudSync", email: "info@cloudsync.com", status: "pending", revenue: "$0", users: 0, joined: "Apr 10, 2026" },
  { name: "DevTools Inc", email: "team@devtools.io", status: "pending", revenue: "$0", users: 0, joined: "Apr 12, 2026" },
  { name: "API Master", email: "contact@apimaster.com", status: "pending", revenue: "$0", users: 0, joined: "Apr 13, 2026" },
];

export function TenantManagement() {
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");

  const activeTenants = allTenants.filter((t) => t.status === "active");
  const pendingTenants = allTenants.filter((t) => t.status === "pending");

  const displayedTenants = activeTab === "active" ? activeTenants : pendingTenants;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tenant Management</h1>
          <p className="text-muted-foreground">Manage platform tenants and approvals</p>
        </div>
        {activeTab === "active" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Tenant</span>
          </motion.button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="border-b border-border">
          <div className="flex items-center gap-1 p-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("active")}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "active"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "active" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-muted rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                Active Tenants
                <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                  {activeTenants.length}
                </span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("pending")}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "pending"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "pending" && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-muted rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                Pending Approval
                <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                  {pendingTenants.length}
                </span>
              </span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Tenant
                  </th>
                  {activeTab === "active" && (
                    <>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Revenue
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                        Users
                      </th>
                    </>
                  )}
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Joined
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedTenants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-2xl flex items-center justify-center mb-4">
                          <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No {activeTab} tenants
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {activeTab === "active"
                            ? "Add a tenant to get started"
                            : "No tenants waiting for approval"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedTenants.map((tenant, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{tenant.name}</div>
                            <div className="text-sm text-muted-foreground">{tenant.email}</div>
                          </div>
                        </div>
                      </td>
                      {activeTab === "active" && (
                        <>
                          <td className="py-4 px-6 font-medium">{tenant.revenue}</td>
                          <td className="py-4 px-6 text-muted-foreground">{tenant.users}</td>
                        </>
                      )}
                      <td className="py-4 px-6 text-muted-foreground">{tenant.joined}</td>
                      <td className="py-4 px-6">
                        {activeTab === "pending" ? (
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="px-3 py-1.5 bg-success/10 text-success rounded-lg hover:bg-success/20 text-sm font-medium flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 text-sm font-medium flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
