import type { ReactNode } from "react";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

export interface StatusStyle {
  tone: StatusTone;
  label?: string;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  danger: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  neutral: "bg-muted text-muted-foreground border border-border",
  primary: "bg-primary/10 text-primary border border-primary/20",
};

/**
 * Central status→tone map for every domain status used across modules.
 * Add new keys here instead of hand-rolling conditional pill classes per page.
 */
export const STATUS_TONE_MAP: Record<string, StatusTone> = {
  // generic
  draft: "neutral",
  published: "success",
  archived: "neutral",
  active: "success",
  inactive: "neutral",
  disabled: "neutral",
  enabled: "success",

  // subscriptions
  trial: "info",
  paused: "warning",
  grace_period: "warning",
  past_due: "danger",
  cancelled: "danger",
  expired: "neutral",
  suspended: "danger",

  // invoices
  pending: "warning",
  finalized: "info",
  sent: "info",
  viewed: "info",
  paid: "success",
  partial: "warning",
  refunded: "neutral",
  overdue: "danger",
  voided: "neutral",

  // risk / health
  low: "success",
  medium: "warning",
  high: "danger",
  healthy: "success",
  "at-risk": "warning",
  churned: "danger",

  // webhooks / api
  delivered: "success",
  failed: "danger",
  retrying: "warning",
  dead_letter: "danger",

  // billing runs
  scheduled: "info",
  running: "warning",
  completed: "success",
};

function toTitle(value: string): string {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function toneForStatus(status: string): StatusTone {
  return STATUS_TONE_MAP[status.toLowerCase()] ?? "neutral";
}

export interface StatusBadgeProps {
  status: string;
  tone?: StatusTone;
  label?: ReactNode;
  className?: string;
  dot?: boolean;
}

/** Reproduces the pill pattern used across list pages, centralized so status→color is consistent everywhere. */
export function StatusBadge({ status, tone, label, className = "", dot = false }: StatusBadgeProps) {
  const resolvedTone = tone ?? toneForStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded capitalize font-medium ${TONE_CLASSES[resolvedTone]} ${className}`}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            resolvedTone === "success"
              ? "bg-success"
              : resolvedTone === "warning"
                ? "bg-amber-500"
                : resolvedTone === "danger"
                  ? "bg-rose-500"
                  : resolvedTone === "info"
                    ? "bg-cyan-400"
                    : resolvedTone === "primary"
                      ? "bg-primary"
                      : "bg-muted-foreground"
          }`}
        />
      )}
      {label ?? toTitle(status)}
    </span>
  );
}
