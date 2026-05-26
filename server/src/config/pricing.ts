export const DEFAULT_CURRENCY = 'XAF';

export const FREE_SHIPPING_THRESHOLD_CENTS = 50_000 * 100;
export const SHIPPING_FEE_CENTS = 2_500 * 100;

export const getShippingCents = (subtotalCents: number) =>
  subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
