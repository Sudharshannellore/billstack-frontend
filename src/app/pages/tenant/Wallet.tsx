import { motion } from "motion/react";
import { Wallet as WalletIcon, Plus } from "lucide-react";

export function Wallet() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage customer credit balances</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Credits</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-primary/10 to-primary-dark/10 border border-primary/20 rounded-xl"
      >
        <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
        <div className="text-5xl font-bold mb-4">₹12,450</div>
        <div className="text-sm text-success">+₹2,340 this month</div>
      </motion.div>
    </motion.div>
  );
}
