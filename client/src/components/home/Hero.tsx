import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { PhoneMockup } from '../layout/PhoneMockup';

const SLIDES = [
  {
    eyebrow: 'New Season · Up to 40% off',
    title: 'Shop Computers & Accessories',
    copy: 'Premium tech, curated for performance. Discover keyboards, monitors and audio built for the way you work.',
    image: 'https://picsum.photos/seed/hero-headphones/700/700',
    priceLabel: 'Wireless Headphones',
    priceFrom: '$249',
  },
];

/** Homepage hero — large left text, product spotlight right, floating cards. */
export const Hero = () => {
  const [active] = useState(0);
  const slide = SLIDES[active];

  return (
    <section className="container-content pt-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
        {/* Soft background blooms */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-ink">
              {slide.eyebrow}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-md text-base text-muted">{slide.copy}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/products">
                <Button size="lg">
                  View More <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/products?sort=rating">
                <Button variant="outline" size="lg">
                  Top Rated
                </Button>
              </Link>
            </div>

            {/* Carousel indicators */}
            <div className="mt-10 flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={
                    i === active
                      ? 'h-2 w-8 rounded-full bg-ink transition-all'
                      : 'h-2 w-2 rounded-full bg-border transition-all'
                  }
                />
              ))}
            </div>
          </motion.div>

          {/* Right — product spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="overflow-hidden rounded-3xl bg-bg">
              <img
                src={slide.image}
                alt={slide.priceLabel}
                className="aspect-square w-full object-cover"
              />
            </div>

            {/* Floating price card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-5 -left-5 rounded-2xl border border-border bg-surface p-4 shadow-lift"
            >
              <p className="text-xs text-muted">{slide.priceLabel}</p>
              <p className="font-display text-2xl font-extrabold">
                {slide.priceFrom}
                <span className="ml-1 text-sm font-medium text-muted">from</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating mobile mockup — desktop decorative composition */}
        <PhoneMockup
          delay={0.7}
          rotate={-8}
          className="absolute -right-10 bottom-[-90px] hidden scale-[0.62] xl:block"
        >
          <div className="flex flex-col gap-2 p-3">
            <div className="h-24 rounded-xl bg-accent/30" />
            <div className="h-3 w-3/4 rounded bg-border" />
            <div className="h-3 w-1/2 rounded bg-border" />
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div className="h-20 rounded-lg bg-border/70" />
              <div className="h-20 rounded-lg bg-border/70" />
            </div>
          </div>
        </PhoneMockup>
      </div>
    </section>
  );
};
