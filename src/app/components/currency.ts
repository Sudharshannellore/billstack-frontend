export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

export function getCurrencySymbol(code: string): string {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code)?.symbol ?? "₹";
}

// Indian numbering system: 1,000 -> 1K, 1,00,000 -> 1L, 1,00,00,000 -> 1Cr
export function formatCompactNumber(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  const trim = (n: number) => parseFloat(n.toFixed(2)).toString();

  if (abs >= 1_00_00_000) return `${sign}${trim(abs / 1_00_00_000)}Cr`;
  if (abs >= 1_00_000) return `${sign}${trim(abs / 1_00_000)}L`;
  if (abs >= 1_000) return `${sign}${trim(abs / 1_000)}K`;
  return `${sign}${abs.toLocaleString("en-IN")}`;
}

export function formatMoney(
  amount: number,
  code: string = "INR",
  options?: { compact?: boolean },
): string {
  const symbol = getCurrencySymbol(code);
  if (options?.compact) return `${symbol}${formatCompactNumber(amount)}`;
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}
