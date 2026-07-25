import { motion, AnimatePresence } from "motion/react";
import { Plus, CreditCard, MoreVertical, Edit, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { CreatePlan } from "./CreatePlan";
import { cn } from "../../components/ui/utils";

const plans = [
  {
    id: 1,
    name: "Starter",
    product: "Cloud Storage API",
    type: "Subscription",
    price: "₹29/month",
    customers: 156,
    status: "active",
  },
  {
    id: 2,
    name: "Pro",
    product: "Cloud Storage API",
    type: "Hybrid",
    price: "₹99/month + usage",
    customers: 89,
    status: "active",
  },
  {
    id: 3,
    name: "Pay as you go",
    product: "Analytics Platform",
    type: "Usage-based",
    price: "₹0.05/query",
    customers: 234,
    status: "active",
  },
  {
    id: 4,
    name: "Enterprise",
    product: "Cloud Storage API",
    type: "Subscription",
    price: "₹499/month",
    customers: 23,
    status: "active",
  },
];

export function Plans() {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Plans</h1>
          <p className="text-muted-foreground">Manage pricing plans for your products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Plan</span>
        </motion.button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] w-[calc(100%-2rem)] max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-[1.5rem] sm:rounded-[2.5rem] border-border bg-card shadow-2xl">
          <div className="p-6 border-b border-border bg-muted/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic tracking-tight">Create New Plan</DialogTitle>
              <DialogDescription className="italic">
                Configure your pricing roadmap in 3 easy steps.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
            <CreatePlan 
              onSuccess={() => setIsDialogOpen(false)} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Plan Name
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Product
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Customers
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <motion.tr
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-muted/30 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{plan.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-muted-foreground">{plan.product}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {plan.type}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium">{plan.price}</td>
                <td className="py-4 px-6 text-muted-foreground">{plan.customers}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-success/10 text-success text-xs rounded">
                    {plan.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu(showMenu === plan.id ? null : plan.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    {showMenu === plan.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2">
                          <Copy className="w-4 h-4" />
                          <span>Duplicate</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
