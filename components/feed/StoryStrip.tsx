import Link from 'next/link';
import type { ProjectWithCount } from '@/lib/types';

interface StoryStripProps {
  projects: ProjectWithCount[];
}

// Apple-style: 56px square thumbnails with hairline border, no rainbow ring.
// Unseen = subtle blue dot, seen = no dot. Cleaner than IG's loud gradient.
function pickSeen(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(hash) % 3) !== 0; // ~67% seen
}

export function StoryStrip({ projects }: StoryStripProps) {
  return (
    <section
      className="bg-bg border-b border-border"
      aria-label="Project highlights"
    >
      <ul className="flex items-start gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-6 py-4 no-scrollbar">
        {projects.slice(0, 7).map((project) => {
          const initial = project.title.charAt(0).toUpperCase();
          const seen = pickSeen(project.id);
          return (
            <li key={project.id} className="shrink-0">
              <Link
                href={`/p/${project.slug}`}
                aria-label={`${project.title}${seen ? '' : ' (new)'}`}
                className="group flex flex-col items-center gap-2 w-[68px] text-text"
              >
                <span className="relative h-14 w-14 rounded-md overflow-hidden bg-bg-muted flex items-center justify-center text-[20px] font-semibold tracking-tightest text-text-2 border border-border transition-transform duration-base ease-apple group-hover:scale-[1.04]">
                  {initial}
                  {!seen && (
                    <span
                      className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent border border-bg"
                      aria-hidden
                    />
                  )}
                </span>
                <span className="text-[11px] text-text-muted tracking-tight truncate w-full text-center leading-tight group-hover:text-text transition-colors">
                  {project.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
