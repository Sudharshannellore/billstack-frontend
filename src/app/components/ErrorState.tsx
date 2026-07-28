import { motion } from "motion/react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Drop-in replacement for a <tbody>/list body when data failed to load. */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-rose-500" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">{description}</p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-5 py-2.5 bg-transparent border border-border rounded-lg text-foreground text-sm font-medium flex items-center gap-2 hover:bg-muted/30 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </motion.button>
      )}
    </motion.div>
  );
}
