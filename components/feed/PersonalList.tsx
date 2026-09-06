'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/feed/ProjectCard';
import { ScrollToTop } from '@/components/feed/ScrollToTop';
import { useToast } from '@/components/ui/Toast';
import type { ProjectWithCount } from '@/lib/types';

type IconKind = 'heart' | 'bookmark';

interface PersonalListProps {
  storageKey: 'lenngram:liked' | 'lenngram:saved';
  iconKind: IconKind;
  eyebrow: string;
  emptyEyebrow: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: { label: string; href: string };
  populatedTitle: (count: number) => string;
  populatedSubtitle: (count: number) => string;
  clearAllLabel: string;
  clearAllConfirm: string;
  removedToast: string;
  clearedToast: string;
}

export function PersonalList({
  storageKey,
  iconKind,
  eyebrow,
  emptyEyebrow,
  emptyTitle,
  emptyBody,
  emptyCta,
  populatedTitle,
  populatedSubtitle,
  clearAllLabel,
  clearAllConfirm,
  removedToast,
  clearedToast,
}: PersonalListProps) {
  const [items, setItems] = useState<ProjectWithCount[] | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const toast = useToast();

  useEffect(() => {
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

  // Cross-tab sync
  useEffect(() => {
    function onChange(e: StorageEvent) {
      if (e.key === storageKey) window.location.reload();
    }
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, [storageKey]);

  function handleClearAll() {
    if (typeof window === 'undefined') return;
    const ok = window.confirm(clearAllConfirm);
    if (!ok) return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setItems([]);
    setMissing(new Set());
    toast.show(clearedToast);
  }

  const isEmpty = items !== null && items.length === 0;
  const isLoading = items === null;
  const count = items?.length ?? 0;

  return (
    <main className="bg-bg">
      <header className="bg-bg-muted border-b border-border">
        <div className="mx-auto max-w-feed sm:max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-text transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Back to projects
          </Link>
          <p className="mt-4 text-eyebrow text-text-muted">{eyebrow}</p>
          <h1 className="mt-2 font-display text-[32px] sm:text-[48px] text-text tracking-tightest">
            {isLoading
              ? '…'
              : count === 0
              ? eyebrow
              : populatedTitle(count)}
          </h1>
          {!isLoading && count > 0 && (
            <p className="mt-2 text-[15px] sm:text-[17px] text-text-2 tracking-tight">
              {populatedSubtitle(count)}
            </p>
          )}
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
          <div className="px-4 sm:px-6 py-10 sm:py-16">
            <div className="rounded-2xl bg-bg-muted border-2 border-border-strong px-6 py-12 sm:py-16 text-center">
              <EmptyStateIcon kind={iconKind} />
              <p className="mt-6 text-eyebrow text-text-muted">{emptyEyebrow}</p>
              <h2 className="mt-2 font-display text-[28px] sm:text-[36px] text-text tracking-tightest">
                {emptyTitle}
              </h2>
              <p className="mt-3 text-[15px] sm:text-[17px] text-text-2 max-w-sm mx-auto tracking-tight leading-relaxed">
                {emptyBody}
              </p>
              <Link
                href={emptyCta.href}
                className="mt-7 inline-flex items-center gap-1.5 btn-blue"
              >
                {emptyCta.label}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        )}

        {items && items.length > 0 && (
          <>
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
              <p className="text-[13px] text-text-muted tracking-tight">
                {count} project{count === 1 ? '' : 's'}
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[13px] text-text-muted hover:text-text transition-colors"
              >
                {clearAllLabel}
              </button>
            </div>
            <section aria-label={eyebrow}>
              {items.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onRemoveFromList={() => {
                    setItems((prev) =>
                      prev ? prev.filter((p) => p.id !== project.id) : prev
                    );
                    toast.show(removedToast);
                  }}
                  hideActions={iconKind === 'heart' ? ['save'] : ['like']}
                />
              ))}
            </section>
          </>
        )}
      </div>

      <ScrollToTop />
    </main>
  );
}

function EmptyStateIcon({ kind }: { kind: IconKind }) {
  if (kind === 'heart') {
    return (
      <div
        className="mx-auto h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-bg flex items-center justify-center"
        aria-hidden
      >
        <svg
          className="h-10 w-10 sm:h-12 sm:w-12 text-text-subtle"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="mx-auto h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-bg flex items-center justify-center"
      aria-hidden
    >
      <svg
        className="h-10 w-10 sm:h-12 sm:w-12 text-text-subtle"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  );
}
