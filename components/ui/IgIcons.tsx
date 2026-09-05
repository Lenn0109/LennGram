// Instagram brand SVGs (manually traced, no scraped assets).
// Stroke 1.75, currentColor by default. Filled versions for active state.

export function InstagramWordmark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 103 26"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.36 4.5c-1.04 0-1.93.37-2.66 1.1A3.6 3.6 0 0 0 2.6 8.27V17.7c0 1.04.37 1.93 1.1 2.66a3.6 3.6 0 0 0 2.66 1.1h11.46c1.04 0 1.93-.37 2.66-1.1a3.6 3.6 0 0 0 1.1-2.66V8.27c0-1.04-.37-1.93-1.1-2.66a3.6 3.6 0 0 0-2.66-1.1H6.36Zm0 1.8h11.46c.55 0 1.02.2 1.42.6.4.4.6.87.6 1.42V17.7c0 .55-.2 1.02-.6 1.42-.4.4-.87.6-1.42.6H6.36c-.55 0-1.02-.2-1.42-.6-.4-.4-.6-.87-.6-1.42V8.32c0-.55.2-1.02.6-1.42.4-.4.87-.6 1.42-.6Zm13.7 1.2a.94.94 0 0 0-.94.94c0 .25.09.46.27.64s.39.27.64.27a.94.94 0 0 0 .94-.94.94.94 0 0 0-.94-.94Zm-7.97 1.74a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 1.8a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4Z" />
    </svg>
  );
}

export function IGHeartOutline({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function IGComment({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function IGPaperPlane({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function IGSaveOutline({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IGMore({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function IGHomeOutline({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M2 12L12 3l10 9v9a2 2 0 0 1-2 2h-4v-7h-4v7H4a2 2 0 0 1-2-2v-9z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2h-4v-7h-4v7H5a2 2 0 0 1-2-2V9.5z" />
    </svg>
  );
}

export function IGSearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function IGReelsIcon({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 4.5v9l6-4.5-6-4.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <polygon points="12 8 16 12 12 16 12 8" />
    </svg>
  );
}

export function IGShopIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9h18l-1.5 11a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7L3 9z" />
      <path d="M8 9V5a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function IGProfileIcon({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
