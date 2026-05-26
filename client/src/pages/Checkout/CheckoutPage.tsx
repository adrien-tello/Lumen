import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getApiError } from '../../api/client';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { formatPrice, getShippingCents } from '../../utils/format';
import { Button } from '../../components/ui/Button';

interface ShippingForm {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingZip: string;
}

const EMPTY: ShippingForm = {
  shippingName: '',
  shippingAddress: '',
  shippingCity: '',
  shippingCountry: '',
  shippingZip: '',
};

const FIELDS: { name: keyof ShippingForm; label: string; full?: boolean }[] = [
  { name: 'shippingName', label: 'Full name', full: true },
  { name: 'shippingAddress', label: 'Street address', full: true },
  { name: 'shippingCity', label: 'City' },
  { name: 'shippingZip', label: 'Postal / ZIP code' },
  { name: 'shippingCountry', label: 'Country', full: true },
];

/** Checkout page — shipping form + order placement. */
export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotalCents, sync } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState<ShippingForm>(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shippingCents = getShippingCents(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const set = (key: keyof ShippingForm, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/orders/checkout', form);
      await sync();
      navigate(`/account/orders/${data.data.id}`);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <p className="font-display text-lg font-semibold">Your cart is empty</p>
        <Button className="mt-4" onClick={() => navigate('/products')}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="mb-8 font-display text-3xl font-extrabold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-bold">Shipping Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                  <label className="mb-1.5 block text-sm font-medium">{field.label}</label>
                  <input
                    required
                    value={form[field.name]}
                    onChange={(e) => set(field.name, e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-accent focus:ring-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" size="lg" disabled={submitting} className="mt-6 w-full lg:w-auto">
            {submitting ? 'Placing order...' : `Place Order · ${formatPrice(totalCents)}`}
          </Button>
        </form>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Your Order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="h-12 w-12 rounded-lg border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.product.title}</p>
                  <p className="text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(item.product.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shippingCents === 0 ? 'Free' : formatPrice(shippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-display font-bold">
              <dt>Total</dt>
              <dd>{formatPrice(totalCents)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
};
