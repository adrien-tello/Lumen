import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products.service';
import type { ProductQuery } from '../types';

/** Paginated / filtered product list. */
export const useProducts = (query: ProductQuery = {}) =>
  useQuery({
    queryKey: ['products', query],
    queryFn: () => productsService.list(query),
    staleTime: 60_000,
  });

/** Single product by slug. */
export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsService.getBySlug(slug),
    enabled: Boolean(slug),
  });
