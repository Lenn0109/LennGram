'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for diagnostics — keeps the user-facing surface clean.
    // eslint-disable-next-line no-console
    console.error('[lenngram] Unhandled error:', error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 bg-bg-muted">
      <div className="max-w-md w-full text-center">
        <p className="text-eyebrow text-text-muted">Something went wrong</p>
        <h1 className="mt-2 font-display text-[40px] sm:text-[56px] text-text">
          Try again.
        </h1>
        <p className="mt-3 text-[17px] text-text-2 tracking-tight leading-relaxed">
          A temporary hiccup broke this page. Reload, or head back to the feed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="btn-blue"
            aria-label="Retry loading this page"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" strokeWidth={2} />
            Try again
          </button>
          <Link
            href="/"
            className="pill-link text-text-2 border border-border"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" strokeWidth={2} />
            Back home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-[12px] text-text-muted tracking-tight font-mono">
            ref: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
