import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice, discountPercent } from '../../utils/format';
import { useCartStore } from '../../store/cart.store';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';

interface ProductCardProps {
  product: Product;
}

/** Premium product card — hover lift, image zoom, quick add-to-cart. */
export const ProductCard = ({ product }: ProductCardProps) => {
  const add = useCartStore((s) => s.add);
  const discount = discountPercent(product.priceCents, product.comparePriceCents);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    void add(product, 1);
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="h-full">
      <Link
        to={`/products/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-shadow duration-300 hover:shadow-card"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-bg">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge tone="danger" className="absolute left-3 top-3">
              -{discount}%
            </Badge>
          )}
          {product.isFeatured && (
            <Badge tone="accent" className="absolute right-3 top-3">
              Bestseller
            </Badge>
          )}

          {/* Quick add — appears on hover */}
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
            className="absolute bottom-3 right-3 grid h-11 w-11 translate-y-3 place-items-center rounded-full bg-ink text-surface opacity-0 shadow-lift transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ShoppingCart size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          {product.category && (
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {product.category.name}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.title}</h3>

          <Rating value={product.rating} count={product.reviewCount} className="mt-0.5" />

          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <span className="font-display text-lg font-bold">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            {product.comparePriceCents && discount > 0 && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.comparePriceCents, product.currency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
