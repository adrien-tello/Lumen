import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../animations/Reveal';
import { Button } from '../ui/Button';

/** Large centred promotional banner. */
export const PromoBanner = () => (
  <section className="container-content mt-20">
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-accent-soft">
        <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">
              Fast & Free
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Lumen Delivers
              <br /> Right to You
            </h2>
            <p className="mt-4 max-w-sm text-sm text-ink/70">
              Free same-day delivery on thousands of items. Members get even more — no minimum
              spend required.
            </p>
            <Link to="/products" className="mt-7 inline-block">
              <Button size="lg">
                Start Shopping <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-3xl bg-surface shadow-card">
              <img
                src="https://picsum.photos/seed/promo-delivery/640/520"
                alt="Fast delivery"
                className="aspect-[6/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);
