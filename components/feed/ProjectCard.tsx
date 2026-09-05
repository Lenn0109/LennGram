'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IGHeartOutline, IGComment, IGPaperPlane, IGSaveOutline, IGMore } from '@/components/ui/IgIcons';
import { CoverArt } from '@/components/feed/CoverArt';
import type { ProjectWithCount } from '@/lib/types';

interface ProjectCardProps {
  project: ProjectWithCount;
  index?: number;
}

function relativeTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'now';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  return `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(project.like_count);
  const [saved, setSaved] = useState(false);
  const [entered, setEntered] = useState(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    const delay = Math.min(index * 60, 480);
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [index]);

  async function toggleLike() {
    const next = !liked;
    const newCount = next ? count + 1 : Math.max(0, count - 1);
    setLiked(next);
    setCount(newCount);
    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, unlike: !next }),
      });
    } catch {
      setLiked(!next);
      setCount(count);
    }
  }

  function handleClick() {
    const now = Date.now();
    if (now - lastTapRef.current < 280 && !liked) {
      void toggleLike();
    }
    lastTapRef.current = now;
  }

  const time = relativeTime(project.created_at);
  const isFirst = index === 0;

  return (
    <article
      className={[
        'bg-bg',
        isFirst ? '' : 'border-t border-border',
        'transition-opacity duration-300 ease-out',
        entered ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      {/* Header — minimal, Apple-like: small avatar + 13px username + verified + more */}
      <header className="flex items-center justify-between px-4 sm:px-5 pt-3.5 pb-2.5">
        <Link
          href={`/p/${project.slug}`}
          className="flex items-center gap-2.5 min-w-0 text-text"
        >
          <span
            className="h-8 w-8 rounded-full bg-text text-bg flex items-center justify-center text-[12px] font-semibold tracking-tighter shrink-0"
            aria-hidden
          >
            L
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold tracking-tight text-text leading-tight truncate flex items-center gap-1">
              lenn0109
              <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" aria-label="Verified">
                <circle cx="8" cy="8" r="8" fill="#0071e3" />
                <path d="M5 8.5l2 2 4-4.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span className="text-[11px] text-text-muted tracking-tight leading-tight truncate">
              {project.title}
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="p-1 -mr-1 text-text-muted hover:text-text"
          aria-label="More options"
        >
          <IGMore className="h-5 w-5" />
        </button>
      </header>

      {/* Cover — 4:5 with subtle Apple shadow */}
      <button
        type="button"
        onClick={handleClick}
        className="block relative aspect-[4/5] w-full overflow-hidden bg-bg-muted focus-visible:outline-none"
        aria-label={`${project.title} cover`}
      >
        {project.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_url}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <CoverArt project={project} />
        )}

        {/* Carousel dots (3 — IG convention for multi-image) */}
        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1" aria-hidden>
          <span className="h-1 w-1 rounded-full bg-white shadow-apple-soft" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
        </div>
      </button>

      {/* Action bar — Apple-style minimal: 22px icons, tight spacing */}
      <div className="flex items-center justify-between px-4 sm:px-5 pt-3 pb-1">
        <div className="flex items-center gap-4 text-text">
          <button
            type="button"
            onClick={() => void toggleLike()}
            className="p-0 hover:opacity-60 transition-opacity"
            aria-label={liked ? 'Unlike' : 'Like'}
            aria-pressed={liked}
          >
            <IGHeartOutline
              filled={liked}
              className={['h-[22px] w-[22px]', liked ? 'text-accent' : 'text-text'].join(' ')}
            />
          </button>
          <a
            href={`/p/${project.slug}#comments`}
            className="hover:opacity-60 transition-opacity"
            aria-label="Comments"
          >
            <IGComment className="h-[22px] w-[22px] text-text" />
          </a>
          <button
            type="button"
            className="hover:opacity-60 transition-opacity"
            aria-label="Share"
          >
            <IGPaperPlane className="h-[22px] w-[22px] text-text" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          className="hover:opacity-60 transition-opacity"
          aria-label={saved ? 'Unsave' : 'Save'}
          aria-pressed={saved}
        >
          <IGSaveOutline filled={saved} className="h-[22px] w-[22px] text-text" />
        </button>
      </div>

      {/* Likes — Apple-style 13px semibold, no comma padding */}
      <div className="px-4 sm:px-5 pt-0.5 pb-1.5">
        <p className="text-[13px] font-semibold tracking-tight text-text tabular-nums">
          {count.toLocaleString()} {count === 1 ? 'like' : 'likes'}
        </p>
      </div>

      {/* Caption — 14px body, single tight block */}
      <div className="px-4 sm:px-5 pb-1.5">
        <p className="text-[14px] text-text leading-snug tracking-tight">
          <Link
            href={`/p/${project.slug}`}
            className="font-semibold text-text mr-1"
          >
            lenn0109
          </Link>
          <span className="text-text-2">
            {project.description
              .replace(/^#+\s*[^\n]*\n+/, '')
              .split('\n')
              .filter(Boolean)
              .slice(0, 2)
              .join(' ')}
          </span>
        </p>
      </div>

      {/* Tech chips — Apple Blue 13px, tight inline */}
      {project.tech_stack.length > 0 && (
        <div className="px-4 sm:px-5 pb-2 flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center px-2 h-[22px] rounded-full text-[12px] tracking-tight text-accent font-medium"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Comment + time — single quiet line */}
      <div className="px-4 sm:px-5 pb-4 pt-0.5 flex items-center justify-between">
        <Link
          href={`/p/${project.slug}#comments`}
          className="text-[12px] text-text-muted tracking-tight hover:text-text"
        >
          View all {Math.max(1, Math.floor(project.like_count / 6))} comments
        </Link>
        <time className="text-[11px] text-text-subtle tracking-wide uppercase">
          {time}
        </time>
      </div>
    </article>
  );
}
