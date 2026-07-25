import { motion } from "motion/react";
import { CreditCard } from "lucide-react";

export function Billing() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground">Manage payment methods and billing settings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-card border border-border rounded-xl"
      >
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="font-medium">Visa ending in 4242</div>
            <div className="text-sm text-muted-foreground">Expires 12/2027</div>
          </div>
          <div className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs rounded">Default</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
