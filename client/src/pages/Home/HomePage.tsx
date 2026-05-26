import { Hero } from '../../components/home/Hero';
import { RecommendationStrip } from '../../components/home/RecommendationStrip';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { PromoBanner } from '../../components/home/PromoBanner';
import { FashionCards } from '../../components/home/FashionCards';
import { Newsletter } from '../../components/home/Newsletter';
import { ProductCarousel } from '../../components/product/ProductCarousel';
import { useProducts } from '../../hooks/useProducts';

/** Marketplace homepage. */
export const HomePage = () => {
  const featured = useProducts({ featured: true, limit: 12 });
  const newest = useProducts({ sort: 'newest', limit: 12 });
  const topRated = useProducts({ sort: 'rating', limit: 12 });

  return (
    <div className="pb-8">
      <Hero />
      <RecommendationStrip />

      <div className="mt-20">
        <ProductCarousel
          title="Featured Bestsellers"
          subtitle="Hand-picked favourites our customers love."
          products={featured.data?.items ?? []}
          loading={featured.isLoading}
        />
      </div>

      <CategoryGrid />
      <PromoBanner />

      <div className="mt-20">
        <ProductCarousel
          title="New Arrivals"
          subtitle="Fresh additions to the catalogue."
          products={newest.data?.items ?? []}
          loading={newest.isLoading}
        />
      </div>

      <FashionCards />

      <div className="mt-20">
        <ProductCarousel
          title="Top Rated"
          subtitle="The highest-reviewed products on Lumen."
          products={topRated.data?.items ?? []}
          loading={topRated.isLoading}
        />
      </div>

      <Newsletter />
    </div>
  );
};
