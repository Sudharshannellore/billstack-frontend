/** Masks a secret value for display, e.g. "sk_live_a83jf93jf9832jf98" -> "************jf98". */
export function maskSecret(value: string): string {
  if (!value) return "";
  const visible = value.slice(-4);
  return "*".repeat(Math.max(8, value.length - 4)) + visible;
}
