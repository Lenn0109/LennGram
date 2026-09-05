import Link from 'next/link';
import { Lock } from 'lucide-react';

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tighter no-underline flex items-center gap-1.5"
        >
          <span className="inline-block h-5 w-5 bg-text text-bg text-xs font-mono font-bold flex items-center justify-center rounded-sm">
            L
          </span>
          LennGram
        </Link>
        <Link
          href="/admin"
          className="text-text-muted hover:text-text no-underline transition-colors duration-base ease-out"
          aria-label="Admin"
        >
          <Lock className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}
