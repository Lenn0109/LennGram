import Link from 'next/link';
import type { ProjectWithCount } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface SuggestionsProps {
  projects: ProjectWithCount[];
}

export function Suggestions({ projects }: SuggestionsProps) {
  // Suggest up to 6 projects, excluding the first 3 already in feed
  const items = projects.slice(3, 9);
  if (items.length === 0) return null;

  return (
    <section className="border-b border-border py-4 px-4 sm:px-6">
      <header className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text">
          More from lenn0109
        </h3>
        <Link
          href="/?filter=all"
          className="text-xs text-text-muted hover:text-text no-underline inline-flex items-center gap-0.5"
        >
          See all
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </header>
      <ul className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6">
        {items.map((project) => {
          const initial = project.title.charAt(0).toUpperCase();
          return (
            <li key={project.id} className="shrink-0">
              <Link
                href={`/p/${project.slug}`}
                className="block w-32 focus-visible:outline-none no-underline text-text"
              >
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                  <span className="text-3xl font-bold text-white/90" aria-hidden>
                    {initial}
                  </span>
                </div>
                <p className="mt-2 text-xs text-text-muted truncate">
                  @{project.title.toLowerCase()}
                </p>
                <p className="text-xs text-text leading-tight truncate">
                  {project.description
                    .replace(/^#+\s*[^\n]*\n+/, '')
                    .split('\n')[0]
                    .slice(0, 28)}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
