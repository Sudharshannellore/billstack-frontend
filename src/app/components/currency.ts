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

export function formatMoney(amount: number, code: string = "INR"): string {
  const symbol = getCurrencySymbol(code);
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}
