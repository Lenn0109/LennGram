import Link from 'next/link';

export function Footer() {
  return (
    <footer className="hidden sm:block bg-bg border-t border-border mt-8">
      <div className="mx-auto max-w-2xl px-6 py-6 text-xs text-text-muted space-y-1">
        <p>
          <Link href="/admin" className="text-[#00376b] no-underline hover:underline">About</Link>
          {' · '}
          <a href="https://github.com/Lenn0109" className="text-[#00376b] no-underline hover:underline">Help</a>
          {' · '}
          <a href="https://github.com/Lenn0109/LennGram" className="text-[#00376b] no-underline hover:underline">Press</a>
          {' · '}
          <Link href="/admin" className="text-[#00376b] no-underline hover:underline">API</Link>
          {' · '}
          <Link href="/admin" className="text-[#00376b] no-underline hover:underline">Jobs</Link>
          {' · '}
          <Link href="/admin" className="text-[#00376b] no-underline hover:underline">Privacy</Link>
          {' · '}
          <Link href="/admin" className="text-[#00376b] no-underline hover:underline">Terms</Link>
          {' · '}
          <Link href="/admin" className="text-[#00376b] no-underline hover:underline">Locations</Link>
        </p>
        <p>© 2026 LennGram from lenn0109</p>
      </div>
    </footer>
  );
}
