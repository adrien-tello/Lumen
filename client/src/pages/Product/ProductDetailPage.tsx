import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Check, Truck, ShieldCheck } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import { useCartStore } from '../../store/cart.store';
import { formatPrice, discountPercent } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Rating } from '../../components/ui/Rating';
import { Skeleton } from '../../components/ui/Skeleton';

/** Single product detail page. */
export const ProductDetailPage = () => {
  const { slug = '' } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const add = useCartStore((s) => s.add);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container-content grid gap-10 py-12 lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-content py-24 text-center">
        <p className="font-display text-lg font-semibold">Product not found</p>
        <Link to="/products" className="mt-3 inline-block text-sm text-accent underline">
          Back to all products
        </Link>
      </div>
    );
  }

  const discount = discountPercent(product.priceCents, product.comparePriceCents);

  return (
    <div className="container-content py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-ink">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-3xl border border-border bg-surface"
          >
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="aspect-square w-full object-cover"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={
                    i === activeImage
                      ? 'h-20 w-20 overflow-hidden rounded-xl border-2 border-ink'
                      : 'h-20 w-20 overflow-hidden rounded-xl border border-border opacity-70'
                  }
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Link
              to={`/products?category=${product.category.slug}`}
              className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight">
            {product.title}
          </h1>

          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewCount} size={16} />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-display text-3xl font-extrabold">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            {product.comparePriceCents && discount > 0 && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.comparePriceCents, product.currency)}
                </span>
                <Badge tone="danger">-{discount}%</Badge>
              </>
            )}
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-[112px_1fr]">
            <img
              src={product.images[1] ?? product.images[0]}
              alt={`${product.title} detail`}
              className="aspect-square w-full rounded-xl object-cover sm:w-28"
            />
            <div>
              <h2 className="font-display text-base font-bold">About this item</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>
            </div>
          </div>

          {/* Stock */}
          <p className="mt-5 flex items-center gap-1.5 text-sm">
            {product.stock > 0 ? (
              <>
                <Check size={16} className="text-success" />
                <span className="font-medium text-success">In stock</span>
                <span className="text-muted">— {product.stock} available</span>
              </>
            ) : (
              <span className="font-medium text-danger">Out of stock</span>
            )}
          </p>

          {/* Quantity + add */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-border p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-border/60"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-border/60"
              >
                <Plus size={15} />
              </button>
            </div>
            <Button
              size="lg"
              disabled={product.stock === 0}
              onClick={() => void add(product, qty)}
              className="flex-1 sm:flex-none"
            >
              <ShoppingCart size={18} /> Add to Cart
            </Button>
          </div>

          {/* Perks */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-muted" />
              <span>Free delivery over 50,000 FCFA</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-muted" />
              <span>30-day easy returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-xl font-bold">Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <ul className="mt-6 space-y-5">
            {product.reviews.map((review) => (
              <li key={review.id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {review.user.firstName} {review.user.lastName.charAt(0)}.
                  </span>
                  <Rating value={review.rating} />
                </div>
                {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No reviews yet — be the first to review.</p>
        )}
      </section>
    </div>
  );
};
