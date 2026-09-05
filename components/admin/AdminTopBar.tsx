import Link from 'next/link';
import { LogoutButton } from '@/components/admin/LogoutButton';

export function AdminTopBar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href="/admin"
          className="text-lg font-semibold tracking-tighter no-underline"
        >
          LennGram / admin
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-text no-underline"
          >
            View site
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
