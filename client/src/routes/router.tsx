import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { Skeleton } from '../components/ui/Skeleton';

// Code-split each route for smaller initial bundles.
const HomePage = lazy(() =>
  import('../pages/Home/HomePage').then((m) => ({ default: m.HomePage })),
);
const ProductsPage = lazy(() =>
  import('../pages/Product/ProductsPage').then((m) => ({ default: m.ProductsPage })),
);
const ProductDetailPage = lazy(() =>
  import('../pages/Product/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
);
const CartPage = lazy(() =>
  import('../pages/Cart/CartPage').then((m) => ({ default: m.CartPage })),
);
const CheckoutPage = lazy(() =>
  import('../pages/Checkout/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
);
const OrderDetailPage = lazy(() =>
  import('../pages/Orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })),
);
const OrdersPage = lazy(() =>
  import('../pages/Orders/OrdersPage').then((m) => ({ default: m.OrdersPage })),
);
const AuthPage = lazy(() =>
  import('../pages/Auth/AuthPage').then((m) => ({ default: m.AuthPage })),
);
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

/** Suspense fallback shown while a route chunk loads. */
const PageFallback = () => (
  <div className="container-content py-16">
    <Skeleton className="h-64 w-full rounded-3xl" />
  </div>
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'products', element: withSuspense(<ProductsPage />) },
      { path: 'products/:slug', element: withSuspense(<ProductDetailPage />) },
      { path: 'cart', element: withSuspense(<CartPage />) },
      { path: 'checkout', element: withSuspense(<CheckoutPage />) },
      { path: 'account/orders', element: withSuspense(<OrdersPage />) },
      { path: 'account/orders/:id', element: withSuspense(<OrderDetailPage />) },
      { path: 'login', element: withSuspense(<AuthPage mode="login" />) },
      { path: 'register', element: withSuspense(<AuthPage mode="register" />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
