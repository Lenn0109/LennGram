'use client';

import { useRef, useState, useEffect } from 'react';
import { CoverArt } from './CoverArt';
import type { ProjectWithCount } from '@/lib/types';

interface ImageCarouselProps {
  images?: string[] | null;
  project: ProjectWithCount;
}

export function ImageCarousel({ images, project }: ImageCarouselProps) {
  const imgs = images?.filter(Boolean) ?? [];
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync active dot to scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || imgs.length <= 1) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setActive(Math.min(idx, imgs.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [imgs.length]);

  // Sync scroll to dot click
  function goTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
    setActive(idx);
  }

  if (imgs.length === 0) {
    return <CoverArt project={project} />;
  }

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden bg-bg-muted">
      <div
        ref={scrollRef}
        className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollBehavior: 'auto' }}
      >
        {imgs.map((src, i) => (
          <div
            key={src}
            className="w-full flex-shrink-0 snap-x snap-center overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${project.title} — image ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {imgs.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {imgs.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-150 ${
                i === active ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
