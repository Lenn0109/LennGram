'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, Heart, User } from 'lucide-react';

const items = [
  { href: '/', label: 'Feed', icon: Home },
  { href: '/?filter=liked', label: 'Liked', icon: Heart },
  { href: '/admin', label: 'New', icon: Plus, admin: true },
  { href: '/admin', label: 'Profile', icon: User, admin: true },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur border-t border-border sm:hidden"
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-around h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            (item.href === '/' && pathname === '/') ||
            (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={[
                  'flex flex-col items-center justify-center h-full gap-0.5',
                  'transition-colors duration-base ease-out',
                  active ? 'text-text' : 'text-text-muted hover:text-text',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.5} />
                <span className="text-[10px] font-medium tracking-wide uppercase">
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
