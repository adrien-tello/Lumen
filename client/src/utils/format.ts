/** Formats a price stored in minor units (cents) into a localized string. */
export const DEFAULT_CURRENCY = 'XAF';
export const FREE_SHIPPING_THRESHOLD_CENTS = 50_000 * 100;
export const SHIPPING_FEE_CENTS = 2_500 * 100;

export const getShippingCents = (subtotalCents: number) =>
  subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;

export const formatPrice = (cents: number, currency = DEFAULT_CURRENCY): string =>
  new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'XAF' ? 0 : undefined,
  }).format(cents / 100);

/** Percentage discount between a compare price and the current price. */
export const discountPercent = (priceCents: number, compareCents?: number | null): number => {
  if (!compareCents || compareCents <= priceCents) return 0;
  return Math.round(((compareCents - priceCents) / compareCents) * 100);
};
