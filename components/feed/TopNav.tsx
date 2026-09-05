import Link from 'next/link';

export function TopNav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tighter no-underline"
        >
          LennGram
        </Link>
        <Link
          href="/admin"
          className="text-xs font-mono uppercase tracking-widest text-text-muted hover:text-text no-underline transition-colors duration-base ease-out"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
