'use client';

import { useState, useTransition, useEffect, useRef, useCallback } from 'react';
import type { ProjectWithCount } from '@/lib/types';
import { ProjectCard } from '@/components/feed/ProjectCard';
import { FilterChips } from '@/components/feed/FilterChips';
import { DoubleTapIndicator } from '@/components/feed/DoubleTapIndicator';
import { Loader2 } from 'lucide-react';

interface FeedProps {
  initialItems: ProjectWithCount[];
  tech: string | null;
  tags?: string[];
}

export function Feed({ initialItems, tech }: FeedProps) {
  const [items, setItems] = useState<ProjectWithCount[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialItems.length >= 12);
  const [pending, startTransition] = useTransition();
  const [activeTag, setActiveTag] = useState<string | null>(tech);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const initialTags = Array.from(
    new Set(initialItems.flatMap((p) => p.tech_stack))
  ).sort();

  const loadMore = useCallback(() => {
    if (pending || !hasMore) return;
    const next = page + 1;
    startTransition(async () => {
      const params = new URLSearchParams();
      params.set('page', String(next));
      if (activeTag) params.set('tech', activeTag);
      try {
        const res = await fetch(`/api/projects?${params.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          items: ProjectWithCount[];
          hasMore: boolean;
        };
        setItems((prev) => [...prev, ...data.items]);
        setPage(next);
        setHasMore(data.hasMore);
      } catch {
        // network blip — stop trying
        setHasMore(false);
      }
    });
  }, [page, activeTag, hasMore, pending]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '400px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  // Reset when tag filter changes
  useEffect(() => {
    setActiveTag(tech);
    setItems(initialItems);
    setPage(1);
    setHasMore(initialItems.length >= 12);
  }, [tech, initialItems]);

  if (items.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-16 text-center">
        <p className="text-lg font-semibold">No projects yet</p>
        <p className="mt-2 text-sm text-text-muted">
          Published projects will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-border bg-bg sticky top-14 z-20">
        <div className="px-4 sm:px-6 py-3 overflow-x-auto no-scrollbar">
          <FilterChips tags={initialTags} active={activeTag} />
        </div>
      </div>
      <main className="mx-auto max-w-2xl">
        {items.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
        <div ref={sentinelRef} aria-hidden className="h-1" />
        {pending && (
          <div className="flex items-center justify-center py-6 text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.5} />
          </div>
        )}
        {!hasMore && items.length > 6 && (
          <p className="text-center text-xs text-text-subtle py-8 tracking-widest uppercase">
            You&apos;re all caught up
          </p>
        )}
      </main>
      <DoubleTapIndicator />
    </>
  );
}
