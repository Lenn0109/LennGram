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
    { href: '/', label: 'Home', icon: IGHomeOutline, supportsFill: true },
    { href: '/liked', label: 'Liked', icon: IGHeartOutline, supportsFill: true },
    { href: '/saved', label: 'Saved', icon: IGSaveOutline, supportsFill: true },
    { href: '/you', label: 'You', icon: IGProfileIcon, supportsFill: true },
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
            <li key={item.label} className="flex-1 relative">
              {/* Top active indicator — Apple tab bar pattern */}
              <span
                aria-hidden
                className={[
                  'absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-b-pill transition-opacity duration-200',
                  active ? 'bg-accent opacity-100' : 'bg-transparent opacity-0',
                ].join(' ')}
              />
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex flex-col items-center justify-center h-full gap-0.5',
                  'focus-visible:outline-none focus-visible:bg-bg-muted',
                  'transition-colors',
                  active ? 'bg-accent/10 rounded-sm' : '',
                ].join(' ')}
              >
                <Icon
                  filled={item.supportsFill && active}
                  className={['h-[24px] w-[24px] transition-colors', active ? 'text-accent' : 'text-text-2'].join(' ')}
                />
                <span
                  className={[
                    'text-[10px] tracking-tight leading-none transition-colors',
                    active ? 'text-accent font-semibold' : 'text-text-muted font-medium',
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
