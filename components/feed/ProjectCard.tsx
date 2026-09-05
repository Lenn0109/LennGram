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
  if (hours < 1) return 'JUST NOW';
  if (hours < 24) return `${hours} HOUR${hours === 1 ? '' : 'S'} AGO`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} DAY${days === 1 ? '' : 'S'} AGO`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} WEEK${weeks === 1 ? '' : 'S'} AGO`;
  return `${d.getDate()} ${d.toLocaleString('en', { month: 'short' }).toUpperCase()}`;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(project.like_count);
  const [saved, setSaved] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [entered, setEntered] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const delay = Math.min(index * 80, 600);
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [index]);

  async function toggleLike(sendToServer = true) {
    const next = !liked;
    const newCount = next ? count + 1 : Math.max(0, count - 1);
    setLiked(next);
    setCount(newCount);
    if (!sendToServer) return;
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

  function handleDoubleTap() {
    const now = Date.now();
    const diff = now - lastTapRef.current;
    if (diff < 300 && diff > 0) {
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

  const time = relativeTime(project.created_at);

  return (
    <article
      className={[
        'bg-bg border-b border-border',
        'transition-opacity duration-300 ease-out',
        entered ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      {/* Post header — avatar + username + more */}
      <header className="flex items-center justify-between px-3 sm:px-4 h-14">
        <Link
          href={`/p/${project.slug}`}
          className="flex items-center gap-3 min-w-0 no-underline text-text"
        >
          <span
            className="h-8 w-8 rounded-full bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] p-[2px] shrink-0"
            aria-hidden
          >
            <span className="h-full w-full rounded-full bg-bg flex items-center justify-center text-xs font-semibold">
              L
            </span>
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-sm font-semibold leading-tight truncate flex items-center gap-1">
              lenn0109
              <svg viewBox="0 0 16 16" className="h-3 w-3 inline-block" fill="none" aria-label="Verified">
                <circle cx="8" cy="8" r="8" fill="#0095f6" />
                <path d="M5 8.5l2 2 4-4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span className="text-[11px] text-text-muted leading-tight truncate">
              Project · {project.title}
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="p-1 text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text rounded"
          aria-label="More options"
        >
          <IGMore className="h-5 w-5" />
        </button>
      </header>

      {/* Post image — 4:5, double-tap area (IG actual feed ratio) */}
      <div
        className="relative aspect-[4/5] overflow-hidden select-none cursor-pointer"
        onClick={handleDoubleTap}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'l') void toggleLike(true);
          if (e.key === 'L' && !liked) {
            setShowBigHeart(true);
            setTimeout(() => setShowBigHeart(false), 900);
            void toggleLike(true);
          }
        }}
        aria-label={`${project.title} image, double-tap to like`}
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

        {showBigHeart && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden
          >
            <IGHeartOutline
              filled
              className="h-28 w-28 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            />
          </div>
        )}

        {/* Carousel dots — IG shows these for multi-image posts */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50 shadow-sm" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50 shadow-sm" />
        </div>
      </div>

      {/* Action bar — heart / comment / share / save */}
      <div className="flex items-center justify-between px-3 sm:px-4 pt-2 pb-1">
        <div className="flex items-center gap-3 sm:gap-4 text-text">
          <button
            type="button"
            onClick={() => void toggleLike(true)}
            className="p-0 hover:opacity-60 transition-opacity active:scale-90 transition-transform"
            aria-label={liked ? 'Unlike' : 'Like'}
            aria-pressed={liked}
          >
            <IGHeartOutline
              filled={liked}
              className={[
                'h-6 w-6 transition-transform',
                liked ? 'text-[#ed4956] scale-110' : 'text-text',
              ].join(' ')}
            />
          </button>
          <a
            href={`/p/${project.slug}#comments`}
            className="hover:opacity-60 transition-opacity"
            aria-label="Comments"
          >
            <IGComment className="h-6 w-6 text-text" />
          </a>
          <button
            type="button"
            className="hover:opacity-60 transition-opacity"
            aria-label="Share"
          >
            <IGPaperPlane className="h-6 w-6 text-text" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          className="hover:opacity-60 transition-opacity"
          aria-label={saved ? 'Unsave' : 'Save'}
          aria-pressed={saved}
        >
          <IGSaveOutline filled={saved} className="h-6 w-6 text-text" />
        </button>
      </div>

      {/* Like + view count row */}
      <div className="px-3 sm:px-4 pb-1 flex items-center gap-3">
        <p className="text-sm font-semibold text-text tabular-nums">
          {count.toLocaleString()} {count === 1 ? 'like' : 'likes'}
        </p>
        <p className="text-xs text-text-muted tabular-nums">
          {project.like_count * 4 + 7} views
        </p>
      </div>

      {/* Caption */}
      <div className="px-3 sm:px-4 pb-2">
        <p className="text-sm text-text leading-snug">
          <Link
            href={`/p/${project.slug}`}
            className="font-semibold text-text no-underline mr-1"
          >
            lenn0109
          </Link>
          <span className="text-text">
            {project.description
              .replace(/^#+\s*[^\n]*\n+/, '')
              .split('\n')
              .filter(Boolean)
              .slice(0, 2)
              .join(' ')}
          </span>
          {project.tech_stack.length > 0 && (
            <>
              <br />
              <span className="text-[#00376b] text-sm">
                {project.tech_stack.map((t) => `#${t}`).join(' ')}
              </span>
            </>
          )}
        </p>
      </div>

      {/* View all comments */}
      {project.like_count > 5 && (
        <div className="px-3 sm:px-4 pb-1">
          <a
            href={`/p/${project.slug}#comments`}
            className="text-sm text-text-muted no-underline hover:text-text"
          >
            View all {Math.floor(project.like_count / 8)} comments
          </a>
        </div>
      )}

      {/* Sample comment */}
      <div className="px-3 sm:px-4 pb-1">
        <p className="text-sm text-text leading-snug">
          <span className="font-semibold text-text mr-1">hrd_reader</span>
          <span className="text-text">
            nice stack, when&apos;s the v2?
          </span>
          <span className="text-text-muted text-xs ml-2">2h</span>
        </p>
      </div>

      {/* Time */}
      <div className="px-3 sm:px-4 pt-1 pb-4">
        <time className="text-[10px] text-text-muted tracking-wide uppercase">
          {time}
        </time>
      </div>
    </article>
  );
}
