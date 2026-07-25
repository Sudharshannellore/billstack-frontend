import { motion } from "motion/react";
import { Webhook, Plus } from "lucide-react";

export function Webhooks() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
          <p className="text-muted-foreground">Configure event notifications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Webhook</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-12 bg-card border border-border rounded-xl flex flex-col items-center justify-center text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-2xl flex items-center justify-center mb-6">
          <Webhook className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No webhooks configured</h3>
        <p className="text-muted-foreground max-w-md">Set up webhooks to receive real-time notifications about events in your account.</p>
      </motion.div>
    </motion.div>
  );
}
