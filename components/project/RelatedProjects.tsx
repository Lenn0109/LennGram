import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ProjectWithCount } from '@/lib/types';

interface RelatedProjectsProps {
  projects: ProjectWithCount[];
}

const FIELDS = ['#1d1d1f', '#f5f5f7', '#0071e3', '#fbf0d9', '#d2d2d7', '#424245'];

function pickField(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return FIELDS[Math.abs(hash) % FIELDS.length];
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  return (
    <section className="border-t border-border pt-12">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow text-text-muted mb-1">More to explore</p>
          <h2 className="font-headline text-[24px] sm:text-[28px] text-text">
            Other projects.
          </h2>
        </div>
        <Link
          href="/"
          className="pill-link text-accent border border-accent/40 hidden sm:inline-flex"
        >
          All projects
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </header>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {projects.map((p) => {
          const initial = p.title.charAt(0).toUpperCase();
          const bg = pickField(p.id);
          const isDark = bg === '#1d1d1f' || bg === '#424245' || bg === '#0071e3';
          return (
            <li key={p.id}>
              <Link
                href={`/p/${p.slug}`}
                className="block group focus-visible:outline-none"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-md shadow-apple-card group-hover:shadow-apple-hover transition-shadow duration-base ease-apple"
                  style={{ backgroundColor: bg }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center font-display select-none"
                    style={{
                      color: isDark ? '#f5f5f7' : '#1d1d1f',
                      fontSize: 'clamp(64px, 8vw, 96px)',
                      letterSpacing: '-0.04em',
                    }}
                    aria-hidden
                  >
                    {initial}
                  </span>
                </div>
                <p className="mt-3 text-[15px] font-semibold tracking-tight text-text truncate">
                  {p.title}
                </p>
                <p className="text-[13px] text-text-muted tracking-tight line-clamp-2">
                  {p.description
                    .replace(/^#+\s*[^\n]*\n+/, '')
                    .split('\n')[0]
                    .slice(0, 80)}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
