import Link from 'next/link';
import type { ProjectWithCount } from '@/lib/types';

interface StoryStripProps {
  projects: ProjectWithCount[];
}

const RING_STYLES = [
  'bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]',
  'bg-[linear-gradient(45deg,#feda75_0%,#fa7e1e_25%,#d62976_50%,#962fbf_75%,#4f5bd5_100%)]',
  'bg-[linear-gradient(45deg,#405de6_0%,#5851db_25%,#833ab4_50%,#c13584_75%,#e1306c_100%)]',
  'bg-[conic-gradient(from_180deg_at_50%_50%,#feda75_0deg,#fa7e1e_60deg,#d62976_120deg,#962fbf_180deg,#4f5bd5_240deg,#405de6_300deg,#feda75_360deg)]',
];

function pickRing(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return RING_STYLES[Math.abs(hash) % RING_STYLES.length];
}

export function StoryStrip({ projects }: StoryStripProps) {
  return (
    <section
      className="bg-bg border-b border-border"
      aria-label="Project highlights"
    >
      <ul className="flex items-start gap-4 overflow-x-auto px-4 sm:px-6 py-3 no-scrollbar">
        {projects.slice(0, 8).map((project) => {
          const ring = pickRing(project.id);
          const initial = project.title.charAt(0).toUpperCase();
          return (
            <li key={project.id} className="shrink-0">
              <Link
                href={`/p/${project.slug}`}
                className="flex flex-col items-center gap-1 w-16 focus-visible:outline-none"
              >
                <span
                  className={['h-16 w-16 rounded-full p-[3px]', ring].join(' ')}
                  aria-hidden
                >
                  <span className="h-full w-full rounded-full bg-bg p-[2px] block">
                    <span className="h-full w-full rounded-full bg-bg-muted flex items-center justify-center text-base font-semibold text-text">
                      {initial}
                    </span>
                  </span>
                </span>
                <span className="text-[11px] text-text-muted truncate w-full text-center leading-tight">
                  {project.title.toLowerCase()}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
