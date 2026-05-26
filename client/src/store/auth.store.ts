import { create } from 'zustand';
import type { User } from '../types';
import { tokenStore } from '../api/client';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (user: User, access: string, refresh: string) => void;
  logout: () => Promise<void>;
  /** Restores the session on app boot if a token exists. */
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  setSession: (user, access, refresh) => {
    tokenStore.set(access, refresh);
    set({ user, status: 'authenticated' });
  },

  logout: async () => {
    const refresh = tokenStore.getRefresh();
    if (refresh) await authService.logout(refresh).catch(() => undefined);
    tokenStore.clear();
    set({ user: null, status: 'unauthenticated' });
  },

  bootstrap: async () => {
    if (!tokenStore.getAccess()) {
      set({ status: 'unauthenticated' });
      return;
    }
    set({ status: 'loading' });
    try {
      const user = await authService.me();
      set({ user, status: 'authenticated' });
    } catch {
      tokenStore.clear();
      set({ user: null, status: 'unauthenticated' });
    }
  },
}));
