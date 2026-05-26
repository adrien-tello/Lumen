import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { Reveal } from '../animations/Reveal';
import { Skeleton } from '../ui/Skeleton';

/** 4-column category grid with image cards and hover zoom. */
export const CategoryGrid = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="container-content mt-20">
      <Reveal>
        <div className="mb-6">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Shop by Category</h2>
          <p className="mt-1 text-sm text-muted">Explore our most popular departments.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))
          : categories?.slice(0, 4).map((category, i) => (
              <Reveal key={category.id} delay={i * 0.08}>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-shadow hover:shadow-card"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-bg">
                    <img
                      src={category.imageUrl ?? ''}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-semibold">{category.name}</h3>
                    <p className="mt-0.5 text-xs text-muted">
                      {category._count?.products ?? 0} products
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
      </div>
    </section>
  );
};
