import Link from 'next/link';
import type { ProjectWithCount } from '@/lib/types';

interface SuggestionsProps {
  projects: ProjectWithCount[];
}

const FIELDS = ['#1d1d1f', '#f5f5f7', '#0071e3', '#fbf0d9', '#d2d2d7', '#424245'];

function pickField(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return FIELDS[Math.abs(hash) % FIELDS.length];
}

export function Suggestions({ projects }: SuggestionsProps) {
  const items = projects.slice(3, 9);
  if (items.length === 0) return null;

  return (
    <section className="bg-bg-muted border-t border-border py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-feed sm:max-w-2xl">
        <header className="mb-6">
          <p className="text-eyebrow text-text-muted mb-1">More from lenn0109</p>
          <h3 className="font-display text-[28px] sm:text-[32px] text-text">
            Other projects worth a look.
          </h3>
        </header>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((project) => {
            const initial = project.title.charAt(0).toUpperCase();
            const bg = pickField(project.id);
            const isDark = bg === '#1d1d1f' || bg === '#424245' || bg === '#0071e3';
            return (
              <li key={project.id}>
                <Link
                  href={`/p/${project.slug}`}
                  className="block group focus-visible:outline-none"
                >
                  <div
                    className="relative aspect-square overflow-hidden rounded-md shadow-apple-card group-hover:shadow-apple-hover transition-shadow duration-base ease-apple"
                    style={{ backgroundColor: bg }}
                  >
                    <span
                      className="absolute inset-0 flex items-center justify-center font-display select-none"
                      style={{
                        color: isDark ? '#f5f5f7' : '#1d1d1f',
                        fontSize: 'clamp(48px, 10vw, 80px)',
                        letterSpacing: '-0.04em',
                      }}
                      aria-hidden
                    >
                      {initial}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[13px] font-semibold tracking-tight text-text truncate">
                    {project.title}
                  </p>
                  <p className="text-[12px] text-text-muted tracking-tight truncate">
                    {project.description
                      .replace(/^#+\s*[^\n]*\n+/, '')
                      .split('\n')[0]
                      .slice(0, 40)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
