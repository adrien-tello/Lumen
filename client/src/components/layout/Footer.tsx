import { Link } from 'react-router-dom';
import { FOOTER_COLUMNS } from '../../constants';

export const Footer = () => (
  <footer className="mt-24 border-t border-border bg-surface">
    {/* Back-to-top strip */}
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="w-full bg-ink py-4 text-center text-sm font-medium text-surface transition-opacity hover:opacity-90"
    >
      Back to top
    </button>

    {/* Link columns */}
    <div className="container-content grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
      {FOOTER_COLUMNS.map((col) => (
        <div key={col.title}>
          <h4 className="font-display text-sm font-semibold">{col.title}</h4>
          <ul className="mt-4 space-y-2.5">
            {col.links.map((link) => (
              <li key={link}>
                <Link to="#" className="text-sm text-muted transition-colors hover:text-ink">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom bar */}
    <div className="border-t border-border">
      <div className="container-content flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink">
            <span className="font-display text-sm font-extrabold text-accent">L</span>
          </span>
          <span className="font-display font-bold">Lumen</span>
        </Link>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Lumen Marketplace. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-muted">
          <Link to="#" className="hover:text-ink">Privacy</Link>
          <Link to="#" className="hover:text-ink">Terms</Link>
          <Link to="#" className="hover:text-ink">Cookies</Link>
        </div>
      </div>
    </div>
  </footer>
);
