import { motion } from "motion/react";
import { Database, Plus } from "lucide-react";

const resources = [
  { name: "TRADES", type: "Unit", description: "Stock trading transactions", price: "$0.10/trade" },
  { name: "API_CALLS", type: "Unit", description: "API request consumption", price: "$0.001/call" },
  { name: "DATA_GB", type: "Unit", description: "Data storage in gigabytes", price: "$0.50/GB" },
];

export function GlobalResources() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Global Resources</h1>
          <p className="text-muted-foreground">Define reusable billing resources</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Resource</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{resource.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{resource.type}</span>
              <span className="font-medium">{resource.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
