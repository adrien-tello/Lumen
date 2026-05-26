import { Link } from 'react-router-dom';
import { Sparkles, Package, Cpu, Home } from 'lucide-react';
import { Reveal } from '../animations/Reveal';

const CARDS = [
  { icon: Sparkles, title: 'Recommended for you', sub: 'Picked from your activity', to: '/products?sort=rating' },
  { icon: Package, title: 'Your orders', sub: 'Track & reorder', to: '/account/orders' },
  { icon: Cpu, title: 'Electronics', sub: 'Latest tech deals', to: '/products?category=computers-accessories' },
  { icon: Home, title: 'Home & Kitchen', sub: 'Refresh your space', to: '/products?category=home-kitchen' },
];

/** Horizontal recommendation shortcut strip below the hero. */
export const RecommendationStrip = () => (
  <section className="container-content mt-6">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map((card, i) => (
        <Reveal key={card.title} delay={i * 0.06}>
          <Link
            to={card.to}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-ink transition-transform group-hover:scale-110">
              <card.icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{card.title}</p>
              <p className="truncate text-xs text-muted">{card.sub}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);
