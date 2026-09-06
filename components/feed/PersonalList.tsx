'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Bookmark, ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/feed/ProjectCard';
import { ScrollToTop } from '@/components/feed/ScrollToTop';
import type { ProjectWithCount } from '@/lib/types';

interface PersonalListProps {
  storageKey: 'lenngram:liked' | 'lenngram:saved';
  icon: 'heart' | 'bookmark';
  iconFilled: 'heart' | 'bookmark';
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: { label: string; href: string };
  toastOnRemove: string;
}

const ICON: Record<string, typeof Heart> = { heart: Heart, bookmark: Bookmark };

export function PersonalList({
  storageKey,
  icon,
  title,
  subtitle,
  emptyTitle,
  emptyBody,
  emptyCta,
  toastOnRemove: _toastOnRemove,
}: PersonalListProps) {
  const [items, setItems] = useState<ProjectWithCount[] | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Read localStorage
    let ids: string[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) ids = arr.filter((x) => typeof x === 'string');
      }
    } catch {
      // ignore
    }

    if (ids.length === 0) {
      setItems([]);
      return;
    }

    // Fetch the feed, then filter
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) {
          if (!cancelled) setItems([]);
          return;
        }
        const data = (await res.json()) as { items?: ProjectWithCount[] };
        const all = data.items ?? [];
        const byId = new Map(all.map((p) => [p.id, p]));
        const matched: ProjectWithCount[] = [];
        const missingSet = new Set<string>();
        // Newest-liked-first = reverse of insertion order
        for (let i = ids.length - 1; i >= 0; i--) {
          const id = ids[i];
          const found = byId.get(id);
          if (found) matched.push(found);
          else missingSet.add(id);
        }
        if (!cancelled) {
          setItems(matched);
          setMissing(missingSet);
        }
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  // Listen for storage changes so /liked updates when user unlikes from the feed
  useEffect(() => {
    function onChange(e: StorageEvent) {
      if (e.key === storageKey) {
        // re-trigger by reloading page state — easiest: reload
        window.location.reload();
      }
    }
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, [storageKey]);

  const Icon = ICON[icon];
  const isEmpty = items !== null && items.length === 0;
  const isLoading = items === null;

  return (
    <main className="bg-bg">
      <header className="bg-bg-muted border-b border-border">
        <div className="mx-auto max-w-feed sm:max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-text-muted">
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            <p className="text-eyebrow">{title}</p>
          </div>
          <h1 className="mt-2 font-display text-[32px] sm:text-[48px] text-text">
            {subtitle}
          </h1>
          {missing.size > 0 && items && items.length > 0 && (
            <p className="mt-3 text-[13px] text-text-muted tracking-tight">
              {missing.size} project{missing.size === 1 ? '' : 's'} no longer
              available
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-feed sm:max-w-2xl">
        {isLoading && (
          <div className="px-4 sm:px-5 py-20 text-center">
            <div className="inline-block h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
            <p className="mt-3 text-[13px] text-text-muted">Loading…</p>
          </div>
        )}

        {isEmpty && (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-bg-muted flex items-center justify-center text-text-subtle">
              <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="mt-5 text-eyebrow text-text-muted">Nothing here yet</p>
            <h2 className="mt-2 font-display text-[24px] sm:text-[32px] text-text">
              {emptyTitle}
            </h2>
            <p className="mt-2 text-[15px] text-text-2 max-w-sm mx-auto tracking-tight">
              {emptyBody}
            </p>
            <Link
              href={emptyCta.href}
              className="mt-6 inline-flex items-center gap-1.5 btn-blue"
            >
              {emptyCta.label}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        )}

        {items && items.length > 0 && (
          <section aria-label={title}>
            {items.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </section>
        )}
      </div>

      <ScrollToTop />
    </main>
  );
}
