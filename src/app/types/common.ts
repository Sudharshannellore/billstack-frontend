/** Shared domain enums/types reused across modules (Products, Plans, Subscriptions, Invoices, etc.). */

export type ProductStatus = "draft" | "published" | "archived";

export type BillingModel =
  | "flat_rate"
  | "usage_based"
  | "tiered"
  | "volume"
  | "hybrid"
  | "seat_based"
  | "wallet"
  | "telecom"
  | "one_time"
  | "marketplace_commission";

export type BillingInterval = "monthly" | "quarterly" | "annual" | "custom";

export type SubscriptionStatus =
  | "trial"
  | "active"
  | "paused"
  | "grace_period"
  | "past_due"
  | "cancelled"
  | "expired"
  | "suspended";

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "finalized"
  | "sent"
  | "viewed"
  | "paid"
  | "partial"
  | "refunded"
  | "overdue"
  | "voided";

export type CouponType = "percentage" | "fixed" | "referral" | "free_trial" | "first_invoice" | "campaign";

export type WalletTransactionType = "credit" | "debit" | "refund" | "adjustment" | "bonus" | "expiration";

export type CustomerSegment = "high_value" | "enterprise" | "trial" | "inactive" | "churn_risk";

export type ApiScope = "read" | "write" | "delete" | "admin";

export interface TimelineEvent {
  id: string;
  actor: string;
  action: string;
  description?: string;
  timestamp: string;
}

export interface Note {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
}
