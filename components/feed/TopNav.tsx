import Link from 'next/link';

export function TopNav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tighter no-underline"
        >
          LennGram
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm text-text-muted hover:text-text no-underline"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
