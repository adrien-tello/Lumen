import { Link } from 'react-router-dom';
import { Reveal } from '../animations/Reveal';

const CARDS = [
  {
    title: 'Fashion for Her',
    sub: 'New arrivals every week',
    image: 'https://picsum.photos/seed/fashion-her/700/560',
    to: '/products?category=beauty-picks',
  },
  {
    title: 'Fashion for Him',
    sub: 'Curated style essentials',
    image: 'https://picsum.photos/seed/fashion-him/700/560',
    to: '/products?category=beauty-picks',
  },
];

/** Two side-by-side lifestyle promotion cards. */
export const FashionCards = () => (
  <section className="container-content mt-20">
    <div className="grid gap-5 md:grid-cols-2">
      {CARDS.map((card, i) => (
        <Reveal key={card.title} delay={i * 0.1}>
          <Link
            to={card.to}
            className="group relative block overflow-hidden rounded-3xl border border-border"
          >
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              className="aspect-[7/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7 text-white">
              <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                {card.sub}
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold">{card.title}</h3>
              <span className="mt-3 inline-block border-b border-white pb-0.5 text-sm font-medium">
                Shop now
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);
