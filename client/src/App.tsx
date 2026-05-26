import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/router';
import { useAuthStore } from './store/auth.store';
import { useCartStore } from './store/cart.store';
import { useThemeStore } from './store/theme.store';

// React Query client — sensible defaults for an e-commerce app.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  const bootstrapAuth = useAuthStore((s) => s.bootstrap);
  const syncCart = useCartStore((s) => s.sync);
  const applyTheme = useThemeStore((s) => s.apply);

  // One-time app initialisation.
  useEffect(() => {
    applyTheme();
    void bootstrapAuth().then(() => syncCart());
  }, [applyTheme, bootstrapAuth, syncCart]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
