import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, MapPin, Globe, Moon, Sun } from 'lucide-react';
import { cn } from '../../utils/cn';
import { NAV_LINKS } from '../../constants';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const itemCount = useCartStore((s) => s.itemCount);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const user = useAuthStore((s) => s.user);
  const { theme, toggle } = useThemeStore();

  // Add a soft shadow once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-surface/95 backdrop-blur transition-shadow duration-300',
        scrolled ? 'shadow-soft' : 'shadow-none',
      )}
    >
      {/* Top thin bar */}
      <div className="hidden border-b border-border bg-bg/60 lg:block">
        <div className="container-content flex h-9 items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> Deliver to Yaoundé
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={13} /> EN / FCFA
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/help" className="hover:text-ink">
              Customer Service
            </Link>
            <Link to="/sell" className="hover:text-ink">
              Sell on Lumen
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container-content flex h-16 items-center gap-4 lg:gap-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink">
            <span className="font-display text-lg font-extrabold text-accent">L</span>
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">Lumen</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={submitSearch} className="ml-auto hidden flex-1 max-w-md md:block">
          <div className="flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2.5">
            <Search size={16} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands and more"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
        </form>

        {/* Action icons */}
        <div className="flex items-center gap-1 md:ml-0 ml-auto">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-border/60"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-border/60 sm:grid"
          >
            <Heart size={18} />
          </Link>

          <Link
            to={user ? '/account/orders' : '/login'}
            aria-label="Account"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-border/60"
          >
            <User size={18} />
          </Link>

          <button
            onClick={openDrawer}
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-border/60"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-ink">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-border/60 lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <div className="container-content flex flex-col gap-1 py-3">
              <form onSubmit={submitSearch} className="mb-2 md:hidden">
                <div className="flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2.5">
                  <Search size={16} className="text-muted" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                  />
                </div>
              </form>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-border/60"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
