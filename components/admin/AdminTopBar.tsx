import Link from 'next/link';
import { LogoutButton } from '@/components/admin/LogoutButton';

export function AdminTopBar() {
  return (
    <header className="sticky top-0 z-50 bg-bg shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <Link
          href="/admin"
          className="font-sans font-semibold tracking-tight text-[15px] text-text hover:text-accent transition-colors duration-base no-underline"
        >
          LennGram
          <span className="text-text-muted font-normal"> / admin</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[13px] text-text-muted hover:text-text tracking-tight transition-colors duration-base no-underline"
          >
            View site
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
