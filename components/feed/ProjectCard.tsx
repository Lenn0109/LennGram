import type { ProjectWithCount } from '@/lib/types';
import { Heart } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: ProjectWithCount;
}

const PLACEHOLDER_ASPECTS = [
  'aspect-[4/3]',
  'aspect-square',
  'aspect-[3/4]',
  'aspect-video',
  'aspect-[5/4]',
];

function pickAspect(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return PLACEHOLDER_ASPECTS[Math.abs(hash) % PLACEHOLDER_ASPECTS.length];
}

export function ProjectCard({ project }: ProjectCardProps) {
  const aspect = pickAspect(project.id);
  const tags = project.tech_stack.slice(0, 4);
  const extraTags = project.tech_stack.length - tags.length;

  return (
    <Link
      href={`/p/${project.slug}`}
      className="group block break-inside-avoid mb-4 border border-transparent bg-bg hover:bg-bg-muted hover:border-border transition-colors duration-base ease-out focus-visible:border-border-strong"
    >
      <div className={`relative w-full ${aspect} bg-bg-muted overflow-hidden`}>
        {project.cover_url ? (
          // Plain img: covers come from Supabase Storage which allows hot-link.
          // Using <img> here (instead of next/image) keeps masonry simple and
          // avoids needing explicit width/height per card.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_url}
            alt={project.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-base ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-subtle text-xs font-mono uppercase tracking-widest">
            {project.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="px-3 py-3 sm:px-4 sm:py-4">
        <h3 className="text-lg font-semibold tracking-tight leading-snug">
          {project.title}
        </h3>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-bg-muted px-2 py-1 text-xs font-mono uppercase tracking-widest"
              >
                {tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="inline-block bg-bg-muted px-2 py-1 text-xs font-mono uppercase tracking-widest text-text-muted">
                +{extraTags}
              </span>
            )}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-text-muted">
          <span className="text-xs font-mono uppercase tracking-widest">
            {project.featured ? 'Featured' : 'Project'}
          </span>
          <span className="inline-flex items-center gap-1 text-sm tabular-nums">
            <Heart
              strokeWidth={1.5}
              className="h-4 w-4"
              aria-hidden="true"
            />
            {project.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
