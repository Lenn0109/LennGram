'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted">
          Error
        </p>
        <h1 className="text-3xl font-bold tracking-tightest">
          Something went wrong
        </h1>
        <p className="text-sm text-text-muted">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-block px-4 py-2 border border-border bg-bg hover:bg-bg-muted text-sm transition-colors duration-fast ease-out"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
