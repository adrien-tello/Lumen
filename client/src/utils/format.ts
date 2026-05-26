/** Formats a price stored in minor units (cents) into a localized string. */
export const formatPrice = (cents: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);

/** Percentage discount between a compare price and the current price. */
export const discountPercent = (priceCents: number, compareCents?: number | null): number => {
  if (!compareCents || compareCents <= priceCents) return 0;
  return Math.round(((compareCents - priceCents) / compareCents) * 100);
};
