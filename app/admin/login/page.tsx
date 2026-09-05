'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      setError('Invalid password');
    } catch {
      setError('Could not reach server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-border bg-bg p-6 space-y-4"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tighter">Admin login</h1>
          <p className="text-sm text-text-muted mt-1">
            Enter the shared admin password.
          </p>
        </div>

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
            className="w-full px-3 py-2 border border-border-strong bg-bg text-base rounded-sm"
          />
        </label>

        {error && (
          <p className="text-sm" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !password}
          aria-busy={submitting}
          className="w-full px-4 py-2 border border-border bg-bg hover:bg-bg-muted transition-colors duration-fast ease-out disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
