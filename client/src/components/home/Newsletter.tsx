import { useState } from 'react';
import { Reveal } from '../animations/Reveal';
import { Button } from '../ui/Button';
import { PhoneMockup } from '../layout/PhoneMockup';

/** Newsletter subscription banner. */
export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    // Wire to a real endpoint in production.
    setDone(true);
  };

  return (
    <section className="container-content mt-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-ink text-surface">
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Get 10% off your
                <br /> first order
              </h2>
              <p className="mt-3 max-w-sm text-sm text-surface/70">
                Join the Lumen newsletter for exclusive drops, member deals and early access to
                sales.
              </p>

              {done ? (
                <p className="mt-6 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-ink">
                  Thanks for subscribing — check your inbox!
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="h-12 flex-1 rounded-full bg-surface px-5 text-sm text-ink outline-none ring-accent placeholder:text-muted focus:ring-2"
                  />
                  <Button type="submit" variant="secondary" size="lg">
                    Subscribe
                  </Button>
                </form>
              )}
              <p className="mt-3 text-xs text-surface/50">
                No spam. Unsubscribe at any time.
              </p>
            </div>

            {/* Floating mobile mockup */}
            <div className="relative hidden h-72 lg:block">
              <PhoneMockup
                delay={0.2}
                rotate={6}
                className="absolute right-10 top-1/2 -translate-y-1/2 scale-75"
              >
                <div className="flex flex-col gap-2 p-3">
                  <div className="h-28 rounded-xl bg-accent/40" />
                  <div className="h-3 w-2/3 rounded bg-border" />
                  <div className="h-8 rounded-full bg-accent" />
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
