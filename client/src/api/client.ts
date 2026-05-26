import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

// Token storage keys
const ACCESS_KEY = 'lumen_access';
const REFRESH_KEY = 'lumen_refresh';

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- Request interceptor: attach the access token --------------------------
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Response interceptor: transparently refresh expired tokens ------------
let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh once, on a 401, when we have a refresh token.
    if (
      error.response?.status === 401 &&
      !original._retry &&
      tokenStore.getRefresh() &&
      !original.url?.includes('/auth/')
    ) {
      original._retry = true;
      try {
        // De-duplicate concurrent refreshes.
        refreshing ??= axios
          .post(`${API_URL}/auth/refresh`, { refreshToken: tokenStore.getRefresh() })
          .then((r) => {
            const { accessToken, refreshToken } = r.data.data;
            tokenStore.set(accessToken, refreshToken);
            return accessToken as string;
          })
          .finally(() => {
            refreshing = null;
          });

        const newToken = await refreshing;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        tokenStore.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

/** Extracts a human-readable message from an Axios error. */
export const getApiError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string })?.message ?? err.message;
  }
  return 'Something went wrong. Please try again.';
};
