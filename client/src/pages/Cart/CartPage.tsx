import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { formatPrice } from '../../utils/format';
import { Button } from '../../components/ui/Button';

/** Full-page cart view. */
export const CartPage = () => {
  const { items, subtotalCents, update, remove } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <ShoppingBag size={56} className="mx-auto text-muted" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">Looks like you haven&apos;t added anything yet.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  // Simple shipping rule mirrored from the product page perk.
  const shippingCents = subtotalCents >= 5000 ? 0 : 599;
  const totalCents = subtotalCents + shippingCents;

  return (
    <div className="container-content py-10">
      <h1 className="mb-8 font-display text-3xl font-extrabold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-2xl border border-border bg-surface p-4"
              >
                <Link to={`/products/${item.product.slug}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="h-24 w-24 rounded-xl border border-border object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="line-clamp-2 text-sm font-semibold hover:text-accent"
                  >
                    {item.product.title}
                  </Link>
                  <p className="mt-1 text-sm font-bold">
                    {formatPrice(item.product.priceCents, item.product.currency)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full border border-border">
                      <button
                        onClick={() => update(item.productId, item.quantity - 1)}
                        aria-label="Decrease"
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-border/60"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => update(item.productId, item.quantity + 1)}
                        aria-label="Increase"
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-border/60"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.productId)}
                      className="flex items-center gap-1 text-sm text-muted hover:text-danger"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium">{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-medium">
                {shippingCents === 0 ? 'Free' : formatPrice(shippingCents)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-display font-bold">Total</dt>
              <dd className="font-display text-lg font-extrabold">{formatPrice(totalCents)}</dd>
            </div>
          </dl>
          <Link to="/checkout" className="mt-6 block">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
};
