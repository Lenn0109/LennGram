'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace('/admin');
        router.refresh();
        return;
      }
      if (res.status === 401) {
        setError('Wrong password. Try again.');
      } else if (res.status === 429) {
        setError('Too many attempts. Slow down.');
      } else {
        setError('Could not sign in.');
      }
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-muted px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6"
        noValidate
      >
        <div className="text-center space-y-2">
          <p className="text-eyebrow text-text-muted">LennGram · Admin</p>
          <h1 className="font-display text-[32px] sm:text-[40px] text-text">
            Sign in.
          </h1>
          <p className="text-[14px] text-text-2 tracking-tight">
            Enter the shared password to manage projects.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              aria-label="Admin password"
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              className="w-full h-12 px-5 rounded-pill bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-apple-soft border-0 focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="Password"
            />
          </label>

          {error && (
            <p
              id="login-error"
              role="alert"
              className="text-[13px] text-[#ff3b30] tracking-tight text-center"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !password}
          aria-busy={submitting}
          className="w-full h-12 btn-blue justify-center text-[15px] tracking-tight disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 ml-1" strokeWidth={2} />
            </>
          )}
        </button>

        <p className="text-center text-[12px] text-text-muted tracking-tight">
          <Link href="/" className="hover:text-text">
            ← Back to LennGram
          </Link>
        </p>
      </form>
    </main>
  );
}
