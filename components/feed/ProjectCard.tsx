'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import type { ProjectWithCount } from '@/lib/types';

interface ProjectCardProps {
  project: ProjectWithCount;
  index?: number;
  onLikeChange?: (projectId: string, liked: boolean, count: number) => void;
}

const COVER_PATTERNS = [
  'bg-gradient-to-br from-gray-100 via-gray-50 to-white',
  'bg-gradient-to-br from-gray-50 via-white to-gray-100',
  'bg-[radial-gradient(circle_at_30%_40%,#fafafa,#ffffff_70%)]',
  'bg-[radial-gradient(circle_at_70%_60%,#f5f5f5,#ffffff_60%)]',
  'bg-[linear-gradient(135deg,#fafafa_0%,#ffffff_50%,#f5f5f5_100%)]',
];

function pickPattern(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return COVER_PATTERNS[Math.abs(hash) % COVER_PATTERNS.length];
}

export function ProjectCard({ project, index = 0, onLikeChange }: ProjectCardProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(project.like_count);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [hovering, setHovering] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Staggered entrance
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const delay = Math.min(index * 60, 600);
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [index]);

  async function toggleLike(sendToServer = true) {
    const next = !liked;
    const newCount = next ? count + 1 : Math.max(0, count - 1);
    setLiked(next);
    setCount(newCount);
    onLikeChange?.(project.id, next, newCount);
    if (!sendToServer) return;
    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, unlike: !next }),
      });
    } catch {
      // revert on error
      setLiked(!next);
      setCount(count);
      onLikeChange?.(project.id, !next, count);
    }
  }

  function handleTap() {
    const now = Date.now();
    const diff = now - lastTapRef.current;
    if (diff < 300 && diff > 0) {
      // double-tap detected
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      lastTapRef.current = 0;
      if (!liked) {
        setShowBigHeart(true);
        setTimeout(() => setShowBigHeart(false), 900);
      }
      void toggleLike(true);
    } else {
      lastTapRef.current = now;
      tapTimeoutRef.current = setTimeout(() => {
        lastTapRef.current = 0;
      }, 300);
    }
  }

  const pattern = pickPattern(project.id);
  const initial = project.title.charAt(0).toUpperCase();

  return (
    <article
      className={[
        'group relative bg-bg border-y border-border',
        'transition-all duration-base ease-out',
        entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
      ].join(' ')}
    >
      {/* Header row — like IG: avatar + username + 3-dot */}
      <header className="flex items-center justify-between px-4 py-3">
        <Link href={`/p/${project.slug}`} className="flex items-center gap-3 min-w-0">
          <div
            className={[
              'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
              'border border-border bg-bg-muted text-text text-sm font-semibold',
            ].join(' ')}
            aria-hidden
          >
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text leading-tight truncate">
              lenn0109
            </p>
            <p className="text-xs text-text-muted leading-tight truncate">
              {project.title}
            </p>
          </div>
        </Link>
        {project.featured && (
          <span className="text-[10px] font-medium tracking-widest uppercase text-text-muted border border-border-strong px-2 py-0.5">
            Featured
          </span>
        )}
      </header>

      {/* Cover — square, double-tap area, hover overlay */}
      <div
        className="relative aspect-square overflow-hidden select-none"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'l') void toggleLike(true);
        }}
        aria-label={`${project.title} cover, double-tap to like`}
      >
        {/* Cover art (real image or generated pattern with first letter) */}
        {project.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_url}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className={['absolute inset-0 flex items-center justify-center', pattern].join(' ')}>
            <span className="text-9xl font-bold text-text-subtle/40 select-none" aria-hidden>
              {initial}
            </span>
          </div>
        )}

        {/* Big heart on double-tap */}
        {showBigHeart && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <Heart
              className="h-24 w-24 fill-white text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Hover overlay (desktop only) */}
        {hovering && (
          <div className="hidden sm:flex absolute inset-0 bg-text/5 items-center justify-center pointer-events-none">
            <div className="flex items-center gap-6 text-white">
              <span className="flex items-center gap-2 text-sm font-semibold drop-shadow">
                <Heart className="h-5 w-5 fill-white" />
                {count}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => void toggleLike(true)}
            className="p-0 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2"
            aria-label={liked ? 'Unlike' : 'Like'}
            aria-pressed={liked}
          >
            <Heart
              className={[
                'h-6 w-6 transition-transform duration-base ease-out',
                liked
                  ? 'fill-text text-text scale-110'
                  : 'text-text hover:scale-110',
              ].join(' ')}
              strokeWidth={1.75}
            />
          </button>
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text hover:opacity-60 transition-opacity"
              aria-label="Open repository"
            >
              <Github className="h-6 w-6" strokeWidth={1.75} />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text hover:opacity-60 transition-opacity"
              aria-label="Open demo"
            >
              <ExternalLink className="h-6 w-6" strokeWidth={1.75} />
            </a>
          )}
        </div>
        <span className="text-xs text-text-muted tabular-nums">
          {count} {count === 1 ? 'like' : 'likes'}
        </span>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3 -mt-1">
        <p className="text-sm text-text leading-snug">
          <span className="font-semibold">lenn0109</span>{' '}
          <span className="text-text-muted">{project.title}</span>
          {project.description && (
            <>
              {' — '}
              <span className="text-text-muted">
                {project.description.replace(/^#+\s*[^\n]*\n+/, '').slice(0, 140)}
                {project.description.length > 140 ? '…' : ''}
              </span>
            </>
          )}
        </p>
        {/* Tech tags */}
        {project.tech_stack.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 5).map((t) => (
              <li
                key={t}
                className="text-[10px] font-medium tracking-widest uppercase text-text-muted border border-border px-1.5 py-0.5"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
