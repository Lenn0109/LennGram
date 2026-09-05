import Link from 'next/link';

// Apple-style top nav: 44px height, hairline border, 12px nav text, system-ui.
// Light theme — solid white with subtle bottom border. The "glass" is reserved
// for dark sections; on white it would be invisible.

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-feed sm:max-w-2xl px-4 sm:px-6 h-11 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-text"
          aria-label="LennGram home"
        >
          <span className="font-display text-[17px] tracking-tightest">
            LennGram
          </span>
        </Link>
        <nav className="flex items-center gap-1.5 text-text" aria-label="Top">
          <Link
            href="https://github.com/Lenn0109"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-7 items-center px-2.5 rounded-pill text-[12px] font-medium text-text-2 hover:text-text"
            aria-label="GitHub"
          >
            GitHub
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-7 w-7 items-center justify-center rounded-pill text-text-2 hover:text-text hover:bg-bg-muted"
            aria-label="Sign in"
            title="Sign in"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
