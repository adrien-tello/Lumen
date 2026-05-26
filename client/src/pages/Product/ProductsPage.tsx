import { FormEvent, useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { ProductCard } from '../../components/product/ProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { Stagger, StaggerItem } from '../../components/animations/Stagger';
import type { ProductSort } from '../../types';

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export const ProductsPage = () => {
  const [params, setParams] = useSearchParams();

  const search = params.get('search') ?? '';
  const category = params.get('category') ?? '';
  const sort = (params.get('sort') as ProductSort | null) ?? 'newest';
  const page = Number(params.get('page') ?? 1);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data, isLoading, isFetching } = useProducts({
    search: search || undefined,
    category: category || undefined,
    sort,
    page,
    limit: 12,
  });
  const { data: categories } = useCategories();

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    const clean = value.trim();
    if (clean) next.set(key, clean);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParam('search', searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    setParams(new URLSearchParams());
  };

  const activeCategory = categories?.find((c) => c.slug === category);
  const hasFilters = Boolean(search || category || sort !== 'newest');

  return (
    <div className="container-content py-10">
      <header className="mb-8 flex flex-col gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-muted">
          <SlidersHorizontal size={16} />
          Product catalog
        </span>
        <h1 className="font-display text-3xl font-extrabold">
          {search
            ? `Results for "${search}"`
            : activeCategory
              ? activeCategory.name
              : 'All Products'}
        </h1>
        <p className="text-sm text-muted">
          {data ? `${data.pagination.total} products found` : 'Search and filter the catalog'}
          {isFetching && !isLoading ? ' - updating...' : ''}
        </p>
      </header>

      <section className="mb-8 space-y-4 rounded-2xl border border-border bg-surface p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <form onSubmit={submitSearch} className="flex min-w-0 items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search headphones, cookware, games..."
                className="h-11 w-full rounded-full border border-border bg-bg pl-10 pr-4 text-sm outline-none ring-accent focus:ring-2"
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-surface"
            >
              Search
            </button>
          </form>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="h-11 rounded-full border border-border bg-bg px-4 text-sm outline-none ring-accent focus:ring-2"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam('category', '')}
            className={
              !category
                ? 'rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface'
                : 'rounded-full border border-border px-4 py-2 text-sm hover:bg-border/50'
            }
          >
            All
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam('category', c.slug)}
              className={
                category === c.slug
                  ? 'rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface'
                  : 'rounded-full border border-border px-4 py-2 text-sm hover:bg-border/50'
              }
            >
              {c.name}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted hover:text-danger"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <Stagger className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {data.items.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>

          {data.pagination.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam('page', String(i + 1))}
                  className={
                    page === i + 1
                      ? 'grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-semibold text-surface'
                      : 'grid h-10 w-10 place-items-center rounded-full border border-border text-sm hover:bg-border/50'
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="py-24 text-center">
          <p className="font-display text-lg font-semibold">No products found</p>
          <p className="mt-1 text-sm text-muted">Try adjusting your filters or search terms.</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-5 rounded-full border border-border px-5 py-2 text-sm font-semibold hover:bg-border/50"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
