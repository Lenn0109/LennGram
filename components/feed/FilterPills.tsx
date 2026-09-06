'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { formatTechName } from '@/lib/mock';

interface FilterPillsProps {
  tags: string[];
  active: string | null;
}

export function FilterPills({ tags, active }: FilterPillsProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function select(next: string | null) {
    if ((next ?? null) === (active ?? null)) return;
    const params = new URLSearchParams(sp.toString());
    if (next) params.set('tech', next);
    else params.delete('tech');
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/?${qs}` : '/', { scroll: false });
      // smooth scroll to top of feed after a tick so the new content is in DOM
      requestAnimationFrame(() => {
        const target = document.getElementById('feed-top');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  const items: Array<{ label: string; value: string | null }> = [
    { label: 'All', value: null },
    ...tags.map((t) => ({ label: formatTechName(t), value: t })),
  ];

  return (
    <nav
      aria-label="Filter by tech"
      className="bg-bg border-b border-border sticky top-11 z-30 relative"
    >
      {/* Right-edge scroll affordance for mobile — fades into content */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg to-transparent sm:hidden"
      />
      <ul
        className="flex items-center gap-1.5 overflow-x-auto px-4 sm:px-6 py-2.5 no-scrollbar"
        style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 100ms' }}
      >
        {items.map((item) => {
          const isActive = (item.value ?? null) === (active ?? null);
          return (
            <li key={item.label} className="shrink-0">
              <button
                type="button"
                onClick={() => select(item.value)}
                aria-pressed={isActive}
                className={[
                  'inline-flex h-7 items-center px-3 rounded-pill text-[12px] tracking-tight',
                  'transition-colors duration-fast ease-out',
                  'active:scale-95',
                  isActive
                    ? 'bg-accent text-bg font-semibold shadow-vc'
                    : 'bg-bg text-text shadow-vc hover:shadow-vc-hover',
                ].join(' ')}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
