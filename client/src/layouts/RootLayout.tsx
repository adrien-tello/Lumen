import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/product/CartDrawer';

/** Shared shell — navbar, page outlet, footer, cart drawer. */
export const RootLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <CartDrawer />
    <ScrollRestoration />
  </div>
);
