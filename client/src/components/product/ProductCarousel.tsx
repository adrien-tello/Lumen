import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
}

/** Horizontally scrollable product strip with arrow controls. */
export const ProductCarousel = ({ title, subtitle, products, loading }: ProductCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.8;
    track.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="container-content">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface transition-colors hover:bg-border/50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface transition-colors hover:bg-border/50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[240px] shrink-0 snap-start">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="mt-3 h-4 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id} className="w-[240px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
};
