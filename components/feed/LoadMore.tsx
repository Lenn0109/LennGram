'use client';

import { useState, useTransition } from 'react';
import type { ProjectWithCount } from '@/lib/types';
import { ProjectCard } from '@/components/feed/ProjectCard';

interface LoadMoreProps {
  initialItems: ProjectWithCount[];
  hasMore: boolean;
  tech: string | null;
}

export function LoadMore({ initialItems, hasMore, tech }: LoadMoreProps) {
  const [items, setItems] = useState<ProjectWithCount[]>(initialItems);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(hasMore);
  const [pending, startTransition] = useTransition();

  async function loadMore() {
    const next = page + 1;
    startTransition(async () => {
      const params = new URLSearchParams();
      params.set('page', String(next));
      if (tech) params.set('tech', tech);
      const res = await fetch(`/api/projects?${params.toString()}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        items: ProjectWithCount[];
        hasMore: boolean;
      };
      setItems((prev) => [...prev, ...data.items]);
      setPage(next);
      setMore(data.hasMore);
    });
  }

  if (items.length === 0) {
    return (
      <div className="border border-border px-6 py-12 text-center">
        <p className="text-lg font-semibold">No projects yet</p>
        <p className="mt-2 text-sm text-text-muted">
          Published projects will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {more && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={pending}
            aria-busy={pending}
            className="px-4 py-2 text-sm border border-border bg-bg hover:bg-bg-muted transition-colors duration-fast ease-out disabled:opacity-50"
          >
            {pending ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </>
  );
}
