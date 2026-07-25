import { motion } from "motion/react";
import { Key, Plus, Copy } from "lucide-react";

const apiKeys = [
  { name: "Production Key", key: "sk_live_****************************", created: "Jan 15, 2026", lastUsed: "2 hours ago" },
  { name: "Development Key", key: "sk_test_****************************", created: "Feb 3, 2026", lastUsed: "5 minutes ago" },
];

export function APIKeys() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">Manage your API authentication keys</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Generate Key</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {apiKeys.map((key, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{key.name}</div>
                  <div className="text-sm text-muted-foreground">Created {key.created}</div>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} className="p-2 hover:bg-muted rounded-lg">
                <Copy className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg font-mono text-sm">{key.key}</div>
            <div className="text-sm text-muted-foreground mt-2">Last used {key.lastUsed}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
