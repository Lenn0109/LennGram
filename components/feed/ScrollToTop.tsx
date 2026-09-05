'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={[
        'fixed bottom-20 sm:bottom-6 right-4 z-30',
        'h-10 w-10 rounded-pill bg-bg/90 backdrop-blur shadow-apple-card border border-border',
        'flex items-center justify-center text-text',
        'transition-all duration-base ease-apple',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
        'hover:bg-bg',
      ].join(' ')}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}
