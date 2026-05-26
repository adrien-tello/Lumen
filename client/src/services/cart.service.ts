import { api } from '../api/client';
import type { ApiItem, Cart } from '../types';

export const cartService = {
  get: async (): Promise<Cart> => {
    const { data } = await api.get<ApiItem<Cart>>('/cart');
    return data.data;
  },
  addItem: async (productId: string, quantity = 1): Promise<Cart> => {
    const { data } = await api.post<ApiItem<Cart>>('/cart/items', { productId, quantity });
    return data.data;
  },
  updateItem: async (productId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.patch<ApiItem<Cart>>(`/cart/items/${productId}`, { quantity });
    return data.data;
  },
  removeItem: async (productId: string): Promise<Cart> => {
    const { data } = await api.delete<ApiItem<Cart>>(`/cart/items/${productId}`);
    return data.data;
  },
};
