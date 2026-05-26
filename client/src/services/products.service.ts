import { api } from '../api/client';
import type { ApiItem, ApiList, Product, ProductQuery } from '../types';

export const productsService = {
  list: async (query: ProductQuery = {}): Promise<ApiList<Product>> => {
    const { data } = await api.get<ApiList<Product>>('/products', { params: query });
    return data;
  },
  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get<ApiItem<Product>>(`/products/${slug}`);
    return data.data;
  },
};
