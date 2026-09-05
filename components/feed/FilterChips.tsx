'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface FilterChipsProps {
  tags: string[];
  active: string | null;
}

export function FilterChips({ tags, active }: FilterChipsProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setTag(next: string | null) {
    const sp = new URLSearchParams(params.toString());
    if (next === null || next === active) sp.delete('tech');
    else sp.set('tech', next);
    const qs = sp.toString();
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : '/');
    });
  }

  return (
    <div
      role="toolbar"
      aria-label="Filter projects by tech"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        onClick={() => setTag(null)}
        aria-pressed={active === null}
        className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border transition-colors duration-fast ease-out ${
          active === null
            ? 'bg-text text-bg border-text'
            : 'bg-bg text-text border-border hover:bg-bg-muted'
        }`}
      >
        All
      </button>
      {tags.map((tag) => {
        const selected = active === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => setTag(tag)}
            aria-pressed={selected}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border transition-colors duration-fast ease-out ${
              selected
                ? 'bg-text text-bg border-text'
                : 'bg-bg text-text border-border hover:bg-bg-muted'
            }`}
          >
            {tag}
          </button>
        );
      })}
      {pending && (
        <span className="sr-only" aria-live="polite">
          Loading
        </span>
      )}
    </div>
  );
}
