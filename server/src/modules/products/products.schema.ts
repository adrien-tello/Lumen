import { z } from 'zod';

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(60).default(12),
    search: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined)),
    category: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined)),
    sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).default('newest'),
    featured: z
      .enum(['true', 'false'])
      .optional()
      .transform((v) => (v === undefined ? undefined : v === 'true')),
  }),
});

export const productSlugSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(160),
    description: z.string().min(10),
    priceCents: z.number().int().positive(),
    comparePriceCents: z.number().int().positive().optional(),
    stock: z.number().int().min(0).default(0),
    images: z.array(z.string().url()).default([]),
    categoryId: z.string().uuid(),
    isFeatured: z.boolean().default(false),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createProductSchema.shape.body.partial(),
});

export type ListProductsQuery = z.infer<typeof listProductsSchema>['query'];
