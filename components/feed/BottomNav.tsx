'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IGHomeOutline, IGSearchIcon, IGReelsIcon, IGShopIcon, IGProfileIcon } from '@/components/ui/IgIcons';

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const items = [
    { href: '/', label: 'Home', icon: IGHomeOutline, filled: true },
    { href: '/?filter=search', label: 'Search', icon: IGSearchIcon, filled: false },
    { href: '/?filter=reels', label: 'Reels', icon: IGReelsIcon, filled: true },
    { href: '/?filter=shop', label: 'Shop', icon: IGShopIcon, filled: false },
    { href: '/admin', label: 'Profile', icon: IGProfileIcon, filled: true },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t border-border sm:hidden"
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-around h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center justify-center h-full gap-0.5 transition-opacity hover:opacity-70 focus-visible:outline-none"
              >
                <Icon
                  filled={item.filled && active}
                  className="h-6 w-6 text-text"
                />
                <span className="text-[10px] font-medium text-text leading-none">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
