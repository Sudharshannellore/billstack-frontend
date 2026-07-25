import { Search, Bell, User } from "lucide-react";
import { motion } from "motion/react";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-card border-b border-border flex items-center justify-between px-6"
    >
      <div>
        {title && <h1 className="text-2xl font-semibold text-foreground">{title}</h1>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-80 h-10 pl-10 pr-4 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 flex items-center justify-center bg-input-background border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-all"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark rounded-lg text-white"
        >
          <User className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
