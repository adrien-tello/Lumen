import { api } from '../api/client';
import type { ApiItem, AuthResult, User } from '../types';

export const authService = {
  register: async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResult> => {
    const { data } = await api.post<ApiItem<AuthResult>>('/auth/register', payload);
    return data.data;
  },
  login: async (payload: { email: string; password: string }): Promise<AuthResult> => {
    const { data } = await api.post<ApiItem<AuthResult>>('/auth/login', payload);
    return data.data;
  },
  me: async (): Promise<User> => {
    const { data } = await api.get<ApiItem<User>>('/auth/me');
    return data.data;
  },
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },
};
