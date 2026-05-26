import { api } from '../api/client';
import type { ApiItem, Order } from '../types';

export const ordersService = {
  list: async (): Promise<Order[]> => {
    const { data } = await api.get<ApiItem<Order[]>>('/orders');
    return data.data;
  },
  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get<ApiItem<Order>>(`/orders/${id}`);
    return data.data;
  },
};
