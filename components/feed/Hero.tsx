'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Hero() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    function onScroll() {
      setCompact(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className={[
        'bg-bg-muted border-b border-border',
        'transition-all duration-base ease-apple',
        compact ? 'py-3 sm:py-10' : 'py-10 sm:py-24',
      ].join(' ')}
    >
      <div className="mx-auto max-w-apple px-4 sm:px-6 text-center">
        <p
          className={[
            'text-eyebrow text-text-muted',
            compact ? 'mb-0.5' : 'mb-2 sm:mb-3',
            'transition-all duration-base ease-apple',
          ].join(' ')}
        >
          Project Portfolio
        </p>
        <h1
          className={[
            'font-display text-text',
            'transition-all duration-base ease-apple',
            compact
              ? 'text-[20px] sm:text-[32px]'
              : 'text-[32px] sm:text-[56px]',
          ].join(' ')}
        >
          LennGram.
        </h1>
        {!compact && (
          <>
            <p className="mt-2 sm:mt-3 text-[15px] sm:text-[21px] text-text-2 max-w-prose mx-auto tracking-tight">
              A small set of projects I&apos;ve built, shipped, and learned from.
            </p>
            <div className="mt-5 sm:mt-7 flex items-center justify-center gap-3">
              <Link href="#feed-top" className="btn-blue">
                View work
              </Link>
              <Link
                href="https://github.com/Lenn0109"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-link text-accent border border-accent/40"
              >
                GitHub
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
