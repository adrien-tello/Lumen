import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag } from 'lucide-react';
import { ordersService } from '../../services/orders.service';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatPrice } from '../../utils/format';

export const OrdersPage = () => {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.list,
  });

  if (isLoading) {
    return (
      <div className="container-content py-10 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-content py-24 text-center">
        <p className="font-display text-lg font-semibold">Failed to load orders</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <ShoppingBag size={52} className="mx-auto text-muted" />
        <h1 className="mt-4 font-display text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-sm text-muted">Your order history will appear here.</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="mb-8 font-display text-3xl font-extrabold">Your Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-muted">Order #{order.id.slice(0, 8)}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="success">{order.status}</Badge>
                <span className="font-display font-bold">
                  {formatPrice(order.totalCents, order.currency)}
                </span>
                <Link to={`/account/orders/${order.id}`}>
                  <Button variant="secondary" size="sm">View</Button>
                </Link>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
              {order.items.map((i) => i.titleSnapshot).join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
