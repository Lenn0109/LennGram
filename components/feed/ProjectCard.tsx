'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IGHeartOutline, IGComment, IGPaperPlane, IGSaveOutline } from '@/components/ui/IgIcons';
import { CoverArt } from '@/components/feed/CoverArt';
import { useToast } from '@/components/ui/Toast';
import { formatTechName, descriptionSnippet } from '@/lib/mock';
import type { ProjectWithCount } from '@/lib/types';

interface ProjectCardProps {
  project: ProjectWithCount;
  index?: number;
  /** When provided, the parent owns the like/save state and the card calls these on toggle. */
  onLikeChange?: (liked: boolean) => void;
  onSaveChange?: (saved: boolean) => void;
  /** Optional callback when user "removes" this card from a personal list (called on unlike OR unsave). */
  onRemoveFromList?: () => void;
  /** Hide specific action buttons. Useful in /liked where the entry IS the like — show only unsave-style. */
  hideActions?: ('like' | 'save' | 'share' | 'comment')[];
}

const SAVED_KEY = 'lenngram:saved';
const LIKED_KEY = 'lenngram:liked';

function readLocalIds(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function writeLocalIds(key: string, s: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(s)));
  } catch {
    // ignore
  }
}

function readSaved(): Set<string> {
  return readLocalIds(SAVED_KEY);
}

function writeSaved(s: Set<string>) {
  writeLocalIds(SAVED_KEY, s);
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

export function ProjectCard({
  project,
  index = 0,
  onLikeChange,
  onSaveChange,
  onRemoveFromList,
  hideActions = [],
}: ProjectCardProps) {
  const router = useRouter();
  const { show } = useToast();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(project.like_count);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [entered, setEntered] = useState(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    setSaved(readSaved().has(project.id));
    setLiked(readLocalIds(LIKED_KEY).has(project.id));
  }, [project.id]);

  useEffect(() => {
    const delay = Math.min(index * 60, 480);
    const t = setTimeout(() => setEntered(true), delay);
    return () => clearTimeout(t);
  }, [index]);

  async function toggleLike() {
    if (pending) return;
    const next = !liked;
    const newCount = next ? count + 1 : Math.max(0, count - 1);
    setLiked(next);
    setCount(newCount);
    // Mirror to localStorage so /liked page can list this user's likes
    const likedSet = readLocalIds(LIKED_KEY);
    if (next) likedSet.add(project.id);
    else likedSet.delete(project.id);
    writeLocalIds(LIKED_KEY, likedSet);
    onLikeChange?.(next);
    if (!next && onRemoveFromList) onRemoveFromList();
    setPending(true);
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, unlike: !next }),
      });
      if (!res.ok) {
        setLiked(!next);
        setCount(count);
        // Roll back localStorage too
        const rollback = readLocalIds(LIKED_KEY);
        if (next) rollback.delete(project.id);
        else rollback.add(project.id);
        writeLocalIds(LIKED_KEY, rollback);
        if (res.status === 429) {
          show('Slow down — too many likes', 'error');
        } else {
          show('Could not save like', 'error');
        }
      } else {
        const data = (await res.json()) as { totalLikes?: number };
        if (typeof data.totalLikes === 'number') setCount(data.totalLikes);
      }
    } catch {
      setLiked(!next);
      setCount(count);
      const rollback = readLocalIds(LIKED_KEY);
      if (next) rollback.delete(project.id);
      else rollback.add(project.id);
      writeLocalIds(LIKED_KEY, rollback);
      show('Network error', 'error');
    } finally {
      setPending(false);
    }
  }

  function handleClick() {
    const now = Date.now();
    if (now - lastTapRef.current < 280 && !liked) {
      void toggleLike();
    }
    lastTapRef.current = now;
  }

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    const all = readSaved();
    if (next) all.add(project.id);
    else all.delete(project.id);
    writeSaved(all);
    onSaveChange?.(next);
    if (!next && onRemoveFromList) onRemoveFromList();
    show(next ? 'Saved' : 'Removed from saved', 'success');
  }

  async function shareProject() {
    const url = `${window.location.origin}/p/${project.slug}`;
    const title = `${project.title} — LennGram`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or not supported, fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      show('Link copied', 'success');
    } catch {
      show('Could not copy link', 'error');
    }
  }

  function filterByTag(tag: string) {
    router.push(`/?tech=${encodeURIComponent(tag)}`, { scroll: false });
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
      <header className="flex items-center gap-2.5 px-4 sm:px-5 pt-3.5 pb-2.5">
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
      </header>

      <button
        type="button"
        onClick={handleClick}
        className="block relative aspect-[4/5] w-full overflow-hidden bg-bg-muted focus-visible:outline-none group"
        aria-label={`${project.title} cover`}
      >
        <div className="absolute inset-0 transition-transform duration-slow ease-apple group-hover:scale-[1.02]">
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
        </div>

        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 h-6 px-2.5 rounded-pill bg-bg/90 backdrop-blur text-[11px] font-semibold tracking-small text-text">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Featured
          </span>
        )}

        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1" aria-hidden>
          <span className="h-1 w-1 rounded-full bg-white shadow-apple-soft" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
        </div>
      </button>

      <div className="flex items-center justify-between px-3 sm:px-4 pt-3 pb-1">
        <div className="flex items-center -ml-2 text-text">
          {!hideActions.includes('like') && (
            <button
              type="button"
              onClick={() => void toggleLike()}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 hover:opacity-60 active:scale-95 transition-transform"
              aria-label={liked ? 'Unlike' : 'Like'}
              aria-pressed={liked}
            >
              <IGHeartOutline
                filled={liked}
                className={['h-[22px] w-[22px]', liked ? 'text-accent' : 'text-text'].join(' ')}
              />
            </button>
          )}
          {!hideActions.includes('comment') && (
            <a
              href={`/p/${project.slug}#comments`}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 hover:opacity-60 active:scale-95 transition-transform"
              aria-label="Comments"
            >
              <IGComment className="h-[22px] w-[22px] text-text" />
            </a>
          )}
          {!hideActions.includes('share') && (
            <button
              type="button"
              onClick={() => void shareProject()}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 hover:opacity-60 active:scale-95 transition-transform"
              aria-label="Share"
            >
              <IGPaperPlane className="h-[22px] w-[22px] text-text" />
            </button>
          )}
        </div>
        {!hideActions.includes('save') && (
          <button
            type="button"
            onClick={toggleSaved}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 -mr-2 hover:opacity-60 active:scale-95 transition-transform"
            aria-label={saved ? 'Unsave' : 'Save'}
            aria-pressed={saved}
          >
            <IGSaveOutline filled={saved} className="h-[22px] w-[22px] text-text" />
          </button>
        )}
      </div>

      <div className="px-4 sm:px-5 pt-0.5 pb-1.5">
        <p className="text-[13px] font-semibold tracking-tight text-text tabular-nums">
          {count.toLocaleString()} {count === 1 ? 'like' : 'likes'}
        </p>
      </div>

      <div className="px-4 sm:px-5 pb-1.5">
        <p className="text-[14px] text-text leading-snug tracking-tight">
          <Link
            href={`/p/${project.slug}`}
            className="font-semibold text-text mr-1"
          >
            lenn0109
          </Link>
          <span className="text-text-2">
            {descriptionSnippet(project.description, 2)}
          </span>
        </p>
      </div>

      {project.tech_stack.length > 0 && (
        <div className="px-4 sm:px-5 pb-2 flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 4).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => filterByTag(t)}
              className="inline-flex items-center px-2.5 h-[22px] rounded-pill text-[12px] tracking-tight text-text-2 bg-bg-muted font-medium hover:bg-bg-hover transition-colors"
            >
              {formatTechName(t)}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 sm:px-5 pb-4 pt-0.5 flex items-center justify-between">
        <Link
          href={`/p/${project.slug}#comments`}
          className="text-[12px] text-text-muted tracking-tight hover:text-text"
        >
          View all {Math.max(1, Math.floor(project.like_count / 6))} comments
        </Link>
        <time className="text-[11px] text-text-muted tracking-wide uppercase font-medium">
          {time}
        </time>
      </div>
    </article>
  );
}
