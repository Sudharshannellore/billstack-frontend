/** Shared domain types for the Payment Gateway Management module (Super Admin + Tenant). */

export type GatewayStatus = "active" | "disabled" | "maintenance";

export type GatewaySlug = "stripe" | "razorpay" | "paypal" | "cashfree" | "adyen" | "square";

export interface PaymentProvider {
  id: string;
  name: string;
  slug: GatewaySlug;
  description: string;
  logoUrl: string;
  status: GatewayStatus;
  supportedCountries: string[];
  supportedCurrencies: string[];
  docsUrl: string;
  webhookDocsUrl: string;
  activeTenantCount: number;
  totalProcessedTransactions: number;
  createdAt: string;
  updatedAt: string;
  apiVersion: string;
}

export type ConnectionStatus = "connected" | "not_connected" | "error";

export type GatewayEnvironment = "sandbox" | "live";

/** Provider-specific credential field values; kept generic so it can hold any provider's shape. */
export interface GatewayCredentials {
  [fieldKey: string]: string;
}

export interface TenantPaymentGateway {
  id: string;
  providerId: string;
  providerSlug: GatewaySlug;
  connectionStatus: ConnectionStatus;
  environment: GatewayEnvironment;
  isDefault: boolean;
  credentials: GatewayCredentials;
  webhookUrl: string;
  webhookSecret: string;
  connectedAt: string | null;
  lastTestedAt: string | null;
  lastTestResult: "success" | "failed" | null;
}

export type TransactionStatus = "success" | "failed" | "pending" | "refunded";

export interface PaymentTransaction {
  id: string;
  customer: string;
  invoiceId: string;
  gatewaySlug: GatewaySlug;
  amount: number;
  currency: string;
  status: TransactionStatus;
  date: string;
}

export interface GatewayAnalytics {
  totalProviders: number;
  activeProviders: number;
  disabledProviders: number;
  totalTransactions: number;
  successRate: number;
  transactionsByGateway: { gateway: string; transactions: number }[];
  successVsFailed: { name: string; value: number }[];
}

export interface TenantGatewayAnalytics {
  todaysTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  revenueProcessed: number;
  avgTransactionValue: number;
  paymentsByGateway: { gateway: string; transactions: number }[];
  successTrend: { date: string; success: number; failed: number }[];
  revenueTrend: { date: string; revenue: number }[];
}

export interface CountryOption {
  code: string;
  name: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
}
