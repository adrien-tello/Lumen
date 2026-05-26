import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react';
import { ordersService } from '../../services/orders.service';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatPrice } from '../../utils/format';

export const OrderDetailPage = () => {
  const { id } = useParams();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id ?? ''),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="container-content py-10">
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container-content py-24 text-center">
        <ShoppingBag size={52} className="mx-auto text-muted" />
        <h1 className="mt-4 font-display text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-sm text-muted">We could not load this order.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={20} />
            <span className="text-sm font-semibold">Order placed</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Thank you for your order</h1>
          <p className="mt-1 text-sm text-muted">Order #{order.id.slice(0, 8)}</p>
        </div>
        <Link to="/products">
          <Button variant="secondary">Continue Shopping</Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Items</h2>
              <Badge tone="success">{order.status}</Badge>
            </div>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border bg-bg">
                    <Package size={20} className="text-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.titleSnapshot}</p>
                    <p className="text-xs text-muted">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.unitPriceCents * item.quantity, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className="font-medium">{order.paymentStatus}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Total</dt>
              <dd className="font-display text-lg font-extrabold">
                {formatPrice(order.totalCents, order.currency)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-sm font-semibold">Shipping to</h3>
            <address className="mt-2 not-italic text-sm leading-6 text-muted">
              {order.shippingName}
              <br />
              {order.shippingAddress}
              <br />
              {order.shippingCity}, {order.shippingZip}
              <br />
              {order.shippingCountry}
            </address>
          </div>
        </aside>
      </div>
    </div>
  );
};
