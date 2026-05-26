import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Wallet, CheckCircle2 } from 'lucide-react';
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

type PaymentMethod = 'mtn_momo' | 'orange_money' | 'cash_on_delivery';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string }[] = [
  { id: 'mtn_momo', label: 'MTN Mobile Money', description: 'Pay via MTN MoMo' },
  { id: 'orange_money', label: 'Orange Money', description: 'Pay via Orange Money' },
  { id: 'cash_on_delivery', label: 'Cash on Delivery', description: 'Pay when you receive' },
];

const EMPTY: ShippingForm = {
  shippingName: '',
  shippingAddress: '',
  shippingCity: '',
  shippingCountry: 'Cameroon',
  shippingZip: '00000',
};

const FIELDS: { name: keyof ShippingForm; label: string; full?: boolean }[] = [
  { name: 'shippingName', label: 'Full name', full: true },
  { name: 'shippingAddress', label: 'Street address', full: true },
  { name: 'shippingCity', label: 'City' },
  { name: 'shippingZip', label: 'Postal / ZIP code' },
  { name: 'shippingCountry', label: 'Country', full: true },
];

type Step = 'shipping' | 'payment' | 'confirm';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotalCents, sync } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  const [step, setStep] = useState<Step>('shipping');
  const [form, setForm] = useState<ShippingForm>(EMPTY);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Block unauthenticated users immediately on mount.
  useEffect(() => {
    if (status !== 'idle' && status !== 'loading' && !user) {
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [user, status, navigate]);

  const shippingCents = getShippingCents(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const set = (key: keyof ShippingForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handlePlaceOrder = async () => {
    setError('');
    if (paymentMethod !== 'cash_on_delivery' && !phone.trim()) {
      setError('Please enter your mobile money phone number.');
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

  // Still bootstrapping auth — show nothing to avoid flash.
  if (status === 'idle' || status === 'loading') return null;

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
      <h1 className="mb-2 font-display text-3xl font-extrabold">Checkout</h1>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2 text-sm">
        {(['shipping', 'payment', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <span className="text-border">›</span>}
            <span
              className={
                step === s
                  ? 'font-semibold text-ink'
                  : i < (['shipping', 'payment', 'confirm'] as Step[]).indexOf(step)
                    ? 'text-success'
                    : 'text-muted'
              }
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* ── Step 1: Shipping ── */}
          {step === 'shipping' && (
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
              <Button
                size="lg"
                className="mt-6"
                onClick={() => {
                  if (FIELDS.every((f) => form[f.name].trim())) setStep('payment');
                  else setError('Please fill in all shipping fields.');
                }}
              >
                Continue to Payment
              </Button>
              {error && (
                <p className="mt-3 rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
              )}
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 'payment' && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-lg font-bold">Payment Method</h2>
              <p className="mt-1 text-sm text-muted">All amounts in FCFA (XAF)</p>

              <div className="mt-5 space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      paymentMethod === m.id
                        ? 'border-ink bg-ink/5'
                        : 'border-border hover:bg-border/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className="accent-ink"
                    />
                    <Wallet size={18} className="shrink-0 text-muted" />
                    <div>
                      <p className="text-sm font-semibold">{m.label}</p>
                      <p className="text-xs text-muted">{m.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod !== 'cash_on_delivery' && (
                <div className="mt-5">
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                    <Phone size={15} /> Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 6XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-accent focus:ring-2"
                  />
                </div>
              )}

              {error && (
                <p className="mt-3 rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => { setStep('shipping'); setError(''); }}>
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    if (paymentMethod !== 'cash_on_delivery' && !phone.trim()) {
                      setError('Please enter your mobile money phone number.');
                      return;
                    }
                    setError('');
                    setStep('confirm');
                  }}
                >
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 'confirm' && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-lg font-bold">Confirm Your Order</h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="rounded-xl bg-bg p-4">
                  <p className="font-semibold">Shipping to</p>
                  <p className="mt-1 text-muted">
                    {form.shippingName} · {form.shippingAddress}, {form.shippingCity},{' '}
                    {form.shippingCountry}
                  </p>
                </div>
                <div className="rounded-xl bg-bg p-4">
                  <p className="font-semibold">Payment</p>
                  <p className="mt-1 text-muted">
                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                    {phone ? ` · ${phone}` : ''}
                  </p>
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => { setStep('payment'); setError(''); }}>
                  Back
                </Button>
                <Button size="lg" disabled={submitting} onClick={handlePlaceOrder}>
                  {submitting
                    ? 'Placing order...'
                    : `Place Order · ${formatPrice(totalCents)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
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

          {!user && (
            <div className="mt-5 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">
              <p className="font-semibold">Account required</p>
              <p className="mt-1 text-muted">
                You need an account to place an order.{' '}
                <Link to="/login?redirect=/checkout" className="font-medium text-accent underline">
                  Sign in
                </Link>{' '}
                or{' '}
                <Link to="/register?redirect=/checkout" className="font-medium text-accent underline">
                  create one
                </Link>
                .
              </p>
            </div>
          )}

          {step === 'confirm' && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <CheckCircle2 size={14} className="text-success" />
              Secured · FCFA payment
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
