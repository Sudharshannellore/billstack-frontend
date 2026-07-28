import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BulkAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  destructive?: boolean;
}

export interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  actions: BulkAction[];
}

/** Floating bar shown when rows are selected in a DataTable, offering bulk operations. */
export function BulkActionsBar({ count, onClear, actions }: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="sticky bottom-4 z-20 mx-auto flex items-center gap-3 w-fit max-w-full px-4 py-3 bg-card border border-border rounded-2xl shadow-xl"
        >
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {count} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 flex-wrap">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-muted/30 transition-colors ${
                  action.destructive ? "text-rose-500" : "text-foreground"
                }`}
              >
                <action.icon className="w-3.5 h-3.5" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-muted/30 transition-colors"
            title="Clear selection"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
