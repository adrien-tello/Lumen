import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import { getApiError } from '../../api/client';
import { Button } from '../../components/ui/Button';

type Mode = 'login' | 'register';

interface AuthPageProps {
  mode: Mode;
}

/** Login & registration page (mode-driven). */
export const AuthPage = ({ mode }: AuthPageProps) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') ?? '/';

  const setSession = useAuthStore((s) => s.setSession);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'login'
          ? await authService.login({ email: form.email, password: form.password })
          : await authService.register(form);

      setSession(result.user, result.accessToken, result.refreshToken);
      await mergeGuestCart();
      navigate(redirect);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-content flex min-h-[70vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-card"
      >
        <h1 className="font-display text-2xl font-extrabold">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === 'login'
            ? 'Sign in to continue shopping.'
            : 'Join Lumen for a faster, personalised experience.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">First name</label>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-accent focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Last name</label>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-accent focus:ring-2"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-accent focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-bg px-4 text-sm outline-none ring-accent focus:ring-2"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {mode === 'login' ? (
            <>
              New to Lumen?{' '}
              <Link to="/register" className="font-medium text-accent hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-accent hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};
