import { useState } from "react";
import { PROVIDER_BRAND_COLOR } from "../data/mock-payment-gateways";

export interface PaymentProviderLogoProps {
  name: string;
  slug: string;
  logoUrl?: string;
  size?: number;
}

/** Renders the provider's logoUrl image when it loads; falls back to a brand-colored initial badge otherwise. */
export function PaymentProviderLogo({ name, slug, logoUrl, size = 44 }: PaymentProviderLogoProps) {
  const [errored, setErrored] = useState(false);
  const color = PROVIDER_BRAND_COLOR[slug] ?? "#6366F1";

  if (logoUrl && !errored) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        onError={() => setErrored(true)}
        style={{ width: size, height: size }}
        className="rounded-xl object-contain bg-white/5 border border-white/[0.08] p-1.5"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: `${color}22`, borderColor: `${color}44` }}
      className="rounded-xl border flex items-center justify-center font-black shrink-0"
    >
      <span style={{ color, fontSize: size * 0.4 }}>{name.slice(0, 1).toUpperCase()}</span>
    </div>
  );
}
