import type { ProjectWithCount } from '@/lib/types';
import { Heart, ArrowUpRight } from 'lucide-react';
import { LikeButton } from './LikeButton';

interface ProjectCardProps {
  project: ProjectWithCount;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const year = new Date(project.created_at).getFullYear();
  const firstTag = project.tech_stack[0];

  return (
    <article className="group border-t border-border">
      <div className="py-10 sm:py-14 px-4 sm:px-8">
        {/* Meta row: year + first tag */}
        <div className="flex items-center gap-3 text-xs text-text-muted mb-4 sm:mb-6">
          <span className="tabular-nums">{year}</span>
          {firstTag && (
            <>
              <span className="text-text-subtle">·</span>
              <span className="font-mono uppercase tracking-widest text-[10px]">
                {firstTag}
              </span>
            </>
          )}
          {project.featured && (
            <>
              <span className="text-text-subtle">·</span>
              <span className="font-mono uppercase tracking-widest text-[10px]">
                Featured
              </span>
            </>
          )}
        </div>

        {/* Title — display, tight tracking */}
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-text leading-[1.1] mb-3 sm:mb-4">
          {project.title}
        </h2>

        {/* Description — first line only, muted */}
        {project.description && (
          <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-prose mb-5 sm:mb-6">
            {project.description
              .replace(/^#+\s*[^\n]*\n+/, '')
              .split('\n')[0]
              .trim()}
          </p>
        )}

        {/* Tech stack — inline, separated by middle dot */}
        {project.tech_stack.length > 0 && (
          <p className="text-sm text-text-muted mb-6 sm:mb-8">
            {project.tech_stack.map((tag, i) => (
              <span key={tag}>
                {i > 0 && (
                  <span className="text-text-subtle mx-2">·</span>
                )}
                <span className="font-mono text-[12px] tracking-wide">{tag}</span>
              </span>
            ))}
          </p>
        )}

        {/* Action row — minimal */}
        <div className="flex items-center gap-6">
          <LikeButton
            projectId={project.id}
            initialCount={project.like_count}
          />
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text-muted hover:text-text transition-colors duration-base ease-out no-underline text-sm inline-flex items-center gap-1.5"
            >
              <span>Source</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text-muted hover:text-text transition-colors duration-base ease-out no-underline text-sm inline-flex items-center gap-1.5"
            >
              <span>Live</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
