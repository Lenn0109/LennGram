'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
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
      if (res.status === 401) setError('Wrong password.');
      else if (res.status === 429) setError('Too many attempts.');
      else setError('Could not sign in.');
    } catch {
      setError('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] space-y-8">

        {/* Logo mark */}
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center shadow-vc">
            <span className="text-white font-semibold text-[20px] tracking-tight">L</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1.5">
          <p className="text-[12px] font-medium tracking-small uppercase text-text-muted">
            LennGram · Admin
          </p>
          <h1 className="font-sans font-semibold text-[32px] tracking-display leading-[0.95] text-text">
            Sign in.
          </h1>
          <p className="text-[14px] text-text-2 tracking-tight leading-relaxed">
            Enter the shared password to manage projects.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              aria-label="Admin password"
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              placeholder="Password"
              className="w-full h-11 pl-4 pr-11 rounded-xl bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors p-1"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {error && (
            <p
              id="login-error"
              role="alert"
              className="text-[13px] text-[#ff3b30] tracking-tight text-center"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            aria-busy={submitting}
            className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-semibold text-[15px] tracking-tight rounded-xl shadow-vc hover:shadow-vc-hover transition-all duration-base disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? 'Signing in…' : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[12px] text-text-muted tracking-tight">
          <Link href="/" className="hover:text-text transition-colors">
            ← Back to LennGram
          </Link>
        </p>
      </div>
    </main>
  );
}
