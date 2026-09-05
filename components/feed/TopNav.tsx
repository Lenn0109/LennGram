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
        <nav className="flex items-center gap-1 text-text" aria-label="Top">
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
            className="inline-flex h-7 items-center px-3 rounded-pill text-[12px] font-medium bg-text text-bg hover:opacity-90"
            aria-label="Sign in"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
