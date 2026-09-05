'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IGHomeOutline, IGSearchIcon, IGReelsIcon, IGShopIcon, IGProfileIcon } from '@/components/ui/IgIcons';

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border sm:hidden"
      aria-label="Primary"
    >
      <ul className="flex items-center justify-around h-12">
        <li>
          <Link href="/" aria-label="Home" aria-current={pathname === '/' ? 'page' : undefined}>
            <IGHomeOutline filled={pathname === '/'} className={['h-6 w-6', pathname === '/' ? 'text-text' : 'text-text'].join(' ')} />
          </Link>
        </li>
        <li>
          <Link href="/?filter=search" aria-label="Search">
            <IGSearchIcon className="h-6 w-6 text-text" />
          </Link>
        </li>
        <li>
          <Link href="/?filter=reels" aria-label="Reels">
            <IGReelsIcon filled={pathname.startsWith('/?filter=reels')} className="h-6 w-6 text-text" />
          </Link>
        </li>
        <li>
          <Link href="/?filter=shop" aria-label="Shop">
            <IGShopIcon className="h-6 w-6 text-text" />
          </Link>
        </li>
        <li>
          <Link href="/admin" aria-label="Profile">
            <IGProfileIcon filled={pathname.startsWith('/admin')} className="h-6 w-6 text-text" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
