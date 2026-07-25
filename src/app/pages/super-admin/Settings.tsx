import { motion } from "motion/react";
import { Settings as SettingsIcon } from "lucide-react";

export function SuperAdminSettings() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global platform settings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-card border border-border rounded-xl space-y-6"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4">Platform Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Default Commission Rate (%)</label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Auto-approve Tenants</label>
              <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Manual Review</option>
                <option>Auto-approve All</option>
                <option>Auto-approve Verified</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
