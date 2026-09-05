import Link from 'next/link';
import type { ProjectWithCount } from '@/lib/types';

interface StoryStripProps {
  projects: ProjectWithCount[];
}

const COVER_LABELS = ['NEW', 'FEATURED', 'CODE', 'MUSIC', 'ART', 'WEB', 'TOOL', 'GAME'];

function getLabel(project: ProjectWithCount, index: number) {
  if (project.featured) return 'FEATURED';
  const first = project.tech_stack[0];
  if (first) return first.slice(0, 8).toUpperCase();
  return COVER_LABELS[index % COVER_LABELS.length];
}

export function StoryStrip({ projects }: StoryStripProps) {
  const items = projects.slice(0, 8);
  return (
    <section
      className="border-b border-border bg-bg"
      aria-label="Project categories"
    >
      <ul className="flex items-start gap-3 overflow-x-auto px-4 py-4 sm:px-6 sm:py-5 no-scrollbar">
        {items.map((project, i) => {
          const label = getLabel(project, i);
          const initial = project.title.charAt(0).toUpperCase();
          return (
            <li key={project.id} className="shrink-0">
              <Link
                href={`/p/${project.slug}`}
                className="group flex flex-col items-center gap-1.5 w-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2"
              >
                <span
                  className="h-16 w-16 rounded-full p-[2px] border border-border-strong group-hover:border-text transition-colors duration-base ease-out"
                  aria-hidden
                >
                  <span className="h-full w-full rounded-full bg-bg-muted flex items-center justify-center text-lg font-semibold text-text">
                    {initial}
                  </span>
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-text-muted group-hover:text-text truncate w-full text-center">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
