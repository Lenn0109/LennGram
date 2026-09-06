'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface StickyBreadcrumbProps {
  /** Title to show next to "Back" on the right side of the strip (optional) */
  trailing?: string;
}

/**
 * Apple-style sticky breadcrumb that appears once the user has scrolled past
 * the natural top breadcrumb. Mobile: hairline bar above. Desktop: floats
 * sticky under the top nav. Same content as the inline breadcrumb so users
 * never lose orientation.
 */
export function StickyBreadcrumb({ trailing }: StickyBreadcrumbProps) {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      // Show after scrolling past 200px (covers the inline breadcrumb)
      setShow(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={[
        'sticky top-11 z-30 bg-bg/85 backdrop-blur-xl border-b border-border transition-transform duration-200 ease-out',
        show ? 'translate-y-0' : '-translate-y-full',
      ].join(' ')}
    >
      <div className="mx-auto max-w-apple px-4 sm:px-6 h-11 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[13px] tracking-tight text-accent hover:underline"
          data-current-path={pathname}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Back to projects
        </Link>
        {trailing && (
          <span className="text-[12px] text-text-muted tracking-tight truncate max-w-[60%]">
            {trailing}
          </span>
        )}
      </div>
    </div>
  );
}
