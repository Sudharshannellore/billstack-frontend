import type {
  PaymentProvider,
  TenantPaymentGateway,
  PaymentTransaction,
  GatewayAnalytics,
  TenantGatewayAnalytics,
  CountryOption,
  CurrencyOption,
} from "../types/payment-gateway";

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "BR", name: "Brazil" },
  { code: "JP", name: "Japan" },
  { code: "NL", name: "Netherlands" },
];

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", name: "US Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "GBP", name: "British Pound" },
  { code: "EUR", name: "Euro" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "AED", name: "UAE Dirham" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "JPY", name: "Japanese Yen" },
];

export const PROVIDER_BRAND_COLOR: Record<string, string> = {
  stripe: "#635BFF",
  razorpay: "#0C2451",
  paypal: "#003087",
  cashfree: "#00C3B4",
  adyen: "#0ABF53",
  square: "#1A1A1A",
};

export const mockPaymentProviders: PaymentProvider[] = [
  {
    id: "prov_stripe",
    name: "Stripe",
    slug: "stripe",
    description: "Global payments platform supporting cards, wallets, and bank debits.",
    logoUrl: "",
    status: "active",
    supportedCountries: ["US", "GB", "CA", "AU", "DE", "FR", "SG"],
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "SGD"],
    docsUrl: "https://docs.stripe.com",
    webhookDocsUrl: "https://docs.stripe.com/webhooks",
    activeTenantCount: 428,
    totalProcessedTransactions: 1_284_500,
    createdAt: "2023-02-11",
    updatedAt: "2026-07-18",
    apiVersion: "2025-06-30",
  },
  {
    id: "prov_razorpay",
    name: "Razorpay",
    slug: "razorpay",
    description: "India-first payments suite covering UPI, cards, netbanking, and wallets.",
    logoUrl: "",
    status: "active",
    supportedCountries: ["IN"],
    supportedCurrencies: ["INR"],
    docsUrl: "https://razorpay.com/docs",
    webhookDocsUrl: "https://razorpay.com/docs/webhooks",
    activeTenantCount: 612,
    totalProcessedTransactions: 2_045_120,
    createdAt: "2023-04-02",
    updatedAt: "2026-07-22",
    apiVersion: "v1",
  },
  {
    id: "prov_paypal",
    name: "PayPal",
    slug: "paypal",
    description: "Widely trusted checkout and wallet payments for global commerce.",
    logoUrl: "",
    status: "active",
    supportedCountries: ["US", "GB", "CA", "AU", "DE", "FR", "BR"],
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "BRL"],
    docsUrl: "https://developer.paypal.com/docs",
    webhookDocsUrl: "https://developer.paypal.com/api/rest/webhooks",
    activeTenantCount: 355,
    totalProcessedTransactions: 918_400,
    createdAt: "2022-11-19",
    updatedAt: "2026-06-30",
    apiVersion: "v2",
  },
  {
    id: "prov_cashfree",
    name: "Cashfree",
    slug: "cashfree",
    description: "Indian payments and payouts gateway with UPI and card support.",
    logoUrl: "",
    status: "maintenance",
    supportedCountries: ["IN"],
    supportedCurrencies: ["INR"],
    docsUrl: "https://docs.cashfree.com",
    webhookDocsUrl: "https://docs.cashfree.com/docs/webhooks",
    activeTenantCount: 142,
    totalProcessedTransactions: 384_900,
    createdAt: "2023-08-05",
    updatedAt: "2026-07-10",
    apiVersion: "2023-08-01",
  },
  {
    id: "prov_adyen",
    name: "Adyen",
    slug: "adyen",
    description: "Enterprise-grade unified commerce payments platform.",
    logoUrl: "",
    status: "disabled",
    supportedCountries: ["NL", "DE", "FR", "GB", "US", "SG"],
    supportedCurrencies: ["EUR", "USD", "GBP", "SGD"],
    docsUrl: "https://docs.adyen.com",
    webhookDocsUrl: "https://docs.adyen.com/development-resources/webhooks",
    activeTenantCount: 58,
    totalProcessedTransactions: 152_300,
    createdAt: "2024-01-22",
    updatedAt: "2026-05-14",
    apiVersion: "v71",
  },
  {
    id: "prov_square",
    name: "Square",
    slug: "square",
    description: "Point-of-sale and online payments for SMBs and retailers.",
    logoUrl: "",
    status: "active",
    supportedCountries: ["US", "CA", "AU", "GB", "JP"],
    supportedCurrencies: ["USD", "CAD", "AUD", "GBP", "JPY"],
    docsUrl: "https://developer.squareup.com/docs",
    webhookDocsUrl: "https://developer.squareup.com/docs/webhooks/overview",
    activeTenantCount: 201,
    totalProcessedTransactions: 476_800,
    createdAt: "2023-06-14",
    updatedAt: "2026-07-01",
    apiVersion: "2026-06-18",
  },
];

export function buildGatewayAnalytics(providers: PaymentProvider[]): GatewayAnalytics {
  const activeProviders = providers.filter((p) => p.status === "active").length;
  const disabledProviders = providers.filter((p) => p.status === "disabled").length;
  const totalTransactions = providers.reduce((sum, p) => sum + p.totalProcessedTransactions, 0);

  return {
    totalProviders: providers.length,
    activeProviders,
    disabledProviders,
    totalTransactions,
    successRate: 97.4,
    transactionsByGateway: providers.map((p) => ({
      gateway: p.name,
      transactions: p.totalProcessedTransactions,
    })),
    successVsFailed: [
      { name: "Success", value: 97.4 },
      { name: "Failed", value: 2.6 },
    ],
  };
}

export const mockTenantGateways: TenantPaymentGateway[] = [
  {
    id: "tg_razorpay",
    providerId: "prov_razorpay",
    providerSlug: "razorpay",
    connectionStatus: "connected",
    environment: "live",
    isDefault: true,
    credentials: { keyId: "rzp_live_9K2h4mLpQxT8w1", keySecret: "sk_live_a83jf93jf9832jf98", webhookSecret: "whsec_r8f92jf92jf9" },
    webhookUrl: "https://api.billstack.io/webhooks/razorpay/tn_8821",
    webhookSecret: "whsec_r8f92jf92jf9",
    connectedAt: "2026-03-12",
    lastTestedAt: "2026-07-27",
    lastTestResult: "success",
  },
  {
    id: "tg_stripe",
    providerId: "prov_stripe",
    providerSlug: "stripe",
    connectionStatus: "connected",
    environment: "sandbox",
    isDefault: false,
    credentials: { publishableKey: "pk_test_51N8j2kLpQx", secretKey: "sk_test_51N8j2kLpQx", webhookSecret: "whsec_s7f82jf82jf8" },
    webhookUrl: "https://api.billstack.io/webhooks/stripe/tn_8821",
    webhookSecret: "whsec_s7f82jf82jf8",
    connectedAt: "2026-05-02",
    lastTestedAt: "2026-07-20",
    lastTestResult: "success",
  },
];

export const mockPaymentTransactions: PaymentTransaction[] = [
  { id: "txn_98231", customer: "Acme Corp", invoiceId: "INV-3021", gatewaySlug: "razorpay", amount: 4800, currency: "INR", status: "success", date: "2026-07-29" },
  { id: "txn_98230", customer: "TechFlow Ltd", invoiceId: "INV-3020", gatewaySlug: "stripe", amount: 129.99, currency: "USD", status: "success", date: "2026-07-29" },
  { id: "txn_98229", customer: "Alice Johnson", invoiceId: "INV-3019", gatewaySlug: "razorpay", amount: 999, currency: "INR", status: "failed", date: "2026-07-28" },
  { id: "txn_98228", customer: "DevTools Inc", invoiceId: "INV-3018", gatewaySlug: "stripe", amount: 49.0, currency: "USD", status: "pending", date: "2026-07-28" },
  { id: "txn_98227", customer: "DataHub Co", invoiceId: "INV-3017", gatewaySlug: "razorpay", amount: 15200, currency: "INR", status: "success", date: "2026-07-27" },
  { id: "txn_98226", customer: "Nimbus Systems", invoiceId: "INV-3016", gatewaySlug: "stripe", amount: 320.5, currency: "USD", status: "refunded", date: "2026-07-26" },
  { id: "txn_98225", customer: "BlueWave Media", invoiceId: "INV-3015", gatewaySlug: "razorpay", amount: 2400, currency: "INR", status: "success", date: "2026-07-26" },
  { id: "txn_98224", customer: "Acme Corp", invoiceId: "INV-3014", gatewaySlug: "stripe", amount: 199.0, currency: "USD", status: "success", date: "2026-07-25" },
  { id: "txn_98223", customer: "TechFlow Ltd", invoiceId: "INV-3013", gatewaySlug: "razorpay", amount: 8100, currency: "INR", status: "failed", date: "2026-07-24" },
  { id: "txn_98222", customer: "Alice Johnson", invoiceId: "INV-3012", gatewaySlug: "stripe", amount: 59.99, currency: "USD", status: "success", date: "2026-07-23" },
  { id: "txn_98221", customer: "DevTools Inc", invoiceId: "INV-3011", gatewaySlug: "razorpay", amount: 3600, currency: "INR", status: "success", date: "2026-07-22" },
  { id: "txn_98220", customer: "DataHub Co", invoiceId: "INV-3010", gatewaySlug: "stripe", amount: 89.5, currency: "USD", status: "success", date: "2026-07-21" },
];

export function buildTenantGatewayAnalytics(transactions: PaymentTransaction[]): TenantGatewayAnalytics {
  const today = "2026-07-29";
  const todaysTxns = transactions.filter((t) => t.date === today);
  const successful = transactions.filter((t) => t.status === "success");
  const failed = transactions.filter((t) => t.status === "failed");
  const revenueProcessed = successful.reduce((sum, t) => sum + t.amount, 0);
  const avgTransactionValue = successful.length > 0 ? revenueProcessed / successful.length : 0;

  const byGateway = new Map<string, number>();
  for (const t of transactions) {
    byGateway.set(t.gatewaySlug, (byGateway.get(t.gatewaySlug) ?? 0) + 1);
  }

  return {
    todaysTransactions: todaysTxns.length,
    successfulPayments: successful.length,
    failedPayments: failed.length,
    revenueProcessed,
    avgTransactionValue,
    paymentsByGateway: Array.from(byGateway.entries()).map(([gateway, count]) => ({ gateway, transactions: count })),
    successTrend: [
      { date: "Jul 23", success: 18, failed: 1 },
      { date: "Jul 24", success: 22, failed: 2 },
      { date: "Jul 25", success: 26, failed: 1 },
      { date: "Jul 26", success: 24, failed: 0 },
      { date: "Jul 27", success: 30, failed: 1 },
      { date: "Jul 28", success: 21, failed: 2 },
      { date: "Jul 29", success: 28, failed: 1 },
    ],
    revenueTrend: [
      { date: "Jul 23", revenue: 42800 },
      { date: "Jul 24", revenue: 51200 },
      { date: "Jul 25", revenue: 58900 },
      { date: "Jul 26", revenue: 49600 },
      { date: "Jul 27", revenue: 67200 },
      { date: "Jul 28", revenue: 54100 },
      { date: "Jul 29", revenue: 71800 },
    ],
  };
}
