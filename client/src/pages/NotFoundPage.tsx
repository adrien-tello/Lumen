import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

/** 404 fallback page. */
export const NotFoundPage = () => (
  <div className="container-content flex min-h-[60vh] flex-col items-center justify-center text-center">
    <p className="font-display text-7xl font-extrabold text-accent">404</p>
    <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
    <p className="mt-2 text-sm text-muted">
      The page you&apos;re looking for doesn&apos;t exist or has moved.
    </p>
    <Link to="/" className="mt-6">
      <Button size="lg">Back to Home</Button>
    </Link>
  </div>
);
