import Link from 'next/link';
import type { ProjectWithCount } from '@/lib/types';

interface StoryStripProps {
  projects: ProjectWithCount[];
}

// IG story ring gradient (top-down 5-stop, exact IG official colors)
const RING_GRADIENT =
  'bg-[linear-gradient(45deg,#feda75_0%,#fa7e1e_25%,#d62976_50%,#962fbf_75%,#4f5bd5_100%)]';

// Variations so it doesn't look like all 8 stories are the same ring
const RING_VARIANTS = [
  RING_GRADIENT,
  'bg-[conic-gradient(from_180deg_at_50%_50%,#feda75_0deg,#fa7e1e_45deg,#d62976_90deg,#962fbf_180deg,#4f5bd5_270deg,#feda75_360deg)]',
  'bg-[linear-gradient(45deg,#405de6_0%,#5851db_25%,#833ab4_50%,#c13584_75%,#e1306c_100%)]',
  'bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]',
];

function pickRing(id: string, index: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return RING_VARIANTS[(Math.abs(hash) + index) % RING_VARIANTS.length];
}

export function StoryStrip({ projects }: StoryStripProps) {
  return (
    <section
      className="bg-bg border-b border-border"
      aria-label="Project highlights"
    >
      <ul className="flex items-start gap-4 overflow-x-auto px-4 sm:px-6 py-3 no-scrollbar">
        {projects.slice(0, 8).map((project, i) => {
          const ring = pickRing(project.id, i);
          const initial = project.title.charAt(0).toUpperCase();
          const seen = i > 0; // first story always unread
          return (
            <li key={project.id} className="shrink-0">
              <Link
                href={`/p/${project.slug}`}
                className="flex flex-col items-center gap-1 w-16 focus-visible:outline-none"
              >
                <span
                  className={[
                    'h-[64px] w-[64px] rounded-full p-[2.5px]',
                    seen ? 'bg-border-strong' : ring,
                  ].join(' ')}
                  aria-hidden
                >
                  <span className="h-full w-full rounded-full bg-bg p-[2px] block">
                    <span className="h-full w-full rounded-full bg-bg-muted flex items-center justify-center text-[15px] font-semibold text-text">
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
