import { api } from '../api/client';
import type { ApiItem, Category } from '../types';

export const categoriesService = {
  list: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiItem<Category[]>>('/categories');
    return data.data;
  },
};
