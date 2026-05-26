import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { formatPrice } from '../../utils/format';
import { Button } from '../ui/Button';

/** Slide-in shopping cart panel. */
export const CartDrawer = () => {
  const navigate = useNavigate();
  const { isOpen, closeDrawer, items, subtotalCents, update, remove } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const handleCheckout = () => {
    closeDrawer();
    navigate(user ? '/checkout' : '/login?redirect=/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-surface shadow-lift"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-display text-lg font-bold">
                Your Cart{' '}
                <span className="text-muted">({items.reduce((s, i) => s + i.quantity, 0)})</span>
              </h3>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-border/60"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag size={48} className="text-muted" />
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted">Browse products and add your favourites.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="h-20 w-20 shrink-0 rounded-xl border border-border object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <p className="line-clamp-2 text-sm font-medium">{item.product.title}</p>
                        <p className="mt-0.5 text-sm font-bold">
                          {formatPrice(item.product.priceCents, item.product.currency)}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-border">
                            <button
                              onClick={() => update(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-border/60"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => update(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-border/60"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(item.productId)}
                            aria-label="Remove item"
                            className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-border/60 hover:text-danger"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="font-display text-lg font-bold">
                    {formatPrice(subtotalCents)}
                  </span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
