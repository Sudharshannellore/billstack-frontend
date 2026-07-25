import { motion } from "motion/react";
import { FileText, Plus } from "lucide-react";

const templates = [
  { name: "SaaS Starter", type: "Subscription", price: "$29/month", tenants: 12 },
  { name: "API Usage", type: "Usage-based", price: "$0.01/call", tenants: 8 },
  { name: "Freemium Model", type: "Hybrid", price: "$0 + overage", tenants: 15 },
];

export function PlanTemplates() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Plan Templates</h1>
          <p className="text-muted-foreground">Reusable pricing templates for tenants</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Template</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{template.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">{template.price}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Used by {template.tenants} tenants</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
