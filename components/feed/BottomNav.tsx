'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IGHomeOutline, IGHeartOutline, IGSaveOutline, IGProfileIcon } from '@/components/ui/IgIcons';

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const items = [
    { href: '/', label: 'Projects', icon: IGHomeOutline, filled: true },
    { href: '/liked', label: 'Liked', icon: IGHeartOutline, filled: false },
    { href: '/saved', label: 'Saved', icon: IGSaveOutline, filled: false },
    { href: '/you', label: 'You', icon: IGProfileIcon, filled: true },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-xl border-t border-border sm:hidden pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-around h-[52px]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center justify-center h-full gap-0.5 focus-visible:outline-none focus-visible:bg-bg-muted transition-colors"
              >
                <Icon
                  filled={item.filled && active}
                  className={['h-[22px] w-[22px]', active ? 'text-accent' : 'text-text-2'].join(' ')}
                />
                <span
                  className={[
                    'text-[10px] font-medium tracking-tight leading-none',
                    active ? 'text-accent' : 'text-text-muted',
                  ].join(' ')}
                >
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
