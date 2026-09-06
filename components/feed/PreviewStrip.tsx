'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Bookmark } from 'lucide-react';
import { CoverArt } from '@/components/feed/CoverArt';
import type { ProjectWithCount } from '@/lib/types';

interface PreviewStripProps {
  kind: 'liked' | 'saved';
  title: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: { label: string; href: string };
  ctaLabel: string;
  ctaHref: string;
}

export function PreviewStrip({
  kind,
  title,
  emptyTitle,
  emptyBody,
  emptyCta,
  ctaLabel,
  ctaHref,
}: PreviewStripProps) {
  const [allProjects, setAllProjects] = useState<ProjectWithCount[] | null>(null);
  const [activeIds, setActiveIds] = useState<Set<string> | null>(null);
  const isLiked = kind === 'liked';
  const storageKey = isLiked ? 'lenngram:liked' : 'lenngram:saved';
  const Icon = isLiked ? Heart : Bookmark;

  // Fetch all projects once
  useEffect(() => {
    let cancelled = false;
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setAllProjects(d.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setAllProjects([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Read localStorage ids + listen to changes
  useEffect(() => {
    function read() {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return new Set<string>();
        const arr = JSON.parse(raw);
        return new Set<string>(Array.isArray(arr) ? arr : []);
      } catch {
        return new Set<string>();
      }
    }
    setActiveIds(read());
    function onStorage(e: StorageEvent) {
      if (e.key === storageKey) setActiveIds(read());
    }
    function onCustom() {
      setActiveIds(read());
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener(`lenngram:${kind}-changed`, onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(`lenngram:${kind}-changed`, onCustom);
    };
  }, [kind, storageKey]);

  // Resolve which projects are in this list
  const items: ProjectWithCount[] = (() => {
    if (!allProjects || !activeIds) return [];
    return allProjects.filter((p) => activeIds.has(p.id));
  })();

  // Empty state
  if (allProjects !== null && activeIds !== null && items.length === 0) {
    return (
      <div className="rounded-2xl bg-bg-muted border-2 border-border-strong p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="flex items-center gap-2 font-display text-[20px] sm:text-[24px] text-text tracking-tightest">
            <Icon
              className={`h-5 w-5 ${isLiked ? 'text-accent' : 'text-text'}`}
              strokeWidth={1.75}
              aria-hidden
            />
            {title}
          </h2>
          <span className="text-[12px] text-text-muted tracking-tight">0</span>
        </div>
        <div className="text-center py-6">
          <p className="font-display text-[20px] sm:text-[24px] text-text tracking-tightest">
            {emptyTitle}
          </p>
          <p className="mt-2 text-[14px] text-text-2 tracking-tight max-w-sm mx-auto leading-relaxed">
            {emptyBody}
          </p>
          <Link
            href={emptyCta.href}
            className="btn-blue mt-5"
          >
            {emptyCta.label}
            <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  // Populated
  return (
    <div className="rounded-2xl bg-bg-muted border border-border p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="flex items-center gap-2 font-display text-[16px] sm:text-[18px] text-text tracking-tightest">
          <Icon
            className={`h-4 w-4 ${isLiked ? 'text-accent' : 'text-text'}`}
            strokeWidth={1.75}
            aria-hidden
          />
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-text-muted tracking-tight">
            {items.length}
          </span>
          <Link
            href={ctaHref}
            className="text-[12px] text-accent hover:underline tracking-tight"
          >
            {ctaLabel} →
          </Link>
        </div>
      </div>
      <ul
        className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3"
        role="list"
        aria-label={`${title} preview`}
      >
        {items.slice(0, 8).map((p) => (
          <li key={p.id}>
            <Link
              href={`/p/${p.slug}`}
              className="group block"
              aria-label={p.title}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-bg relative">
                <CoverArt project={p} />
              </div>
              <p className="mt-1.5 text-[11px] sm:text-[12px] text-text truncate tracking-tight group-hover:text-accent transition-colors">
                {p.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
