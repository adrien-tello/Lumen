import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    shippingName: z.string().min(2),
    shippingAddress: z.string().min(3),
    shippingCity: z.string().min(2),
    shippingCountry: z.string().min(2),
    shippingZip: z.string().min(2),
  }),
});
