'use client';

import { useEffect, useState } from 'react';
import { IGHeartOutline, IGSaveOutline, IGPaperPlane } from '@/components/ui/IgIcons';
import { useToast } from '@/components/ui/Toast';

interface ProjectActionsProps {
  projectId: string;
  slug: string;
  title: string;
  initialCount: number;
  initialSaved: boolean;
}

const SAVED_KEY = 'lenngram:saved';

function readSaved(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function writeSaved(s: Set<string>) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(s)));
  } catch {
    // ignore
  }
}

export function ProjectActions({
  projectId,
  slug,
  title,
  initialCount,
}: ProjectActionsProps) {
  const { show } = useToast();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setSaved(readSaved().has(projectId));
  }, [projectId]);

  async function toggleLike() {
    if (pending) return;
    const next = !liked;
    const newCount = next ? count + 1 : Math.max(0, count - 1);
    setLiked(next);
    setCount(newCount);
    setPending(true);
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, unlike: !next }),
      });
      if (!res.ok) {
        setLiked(!next);
        setCount(count);
        if (res.status === 429) show('Slow down — too many likes', 'error');
        else show('Could not save like', 'error');
      } else {
        const data = (await res.json()) as { totalLikes?: number };
        if (typeof data.totalLikes === 'number') setCount(data.totalLikes);
        show(next ? 'Liked' : 'Removed like', 'success');
      }
    } catch {
      setLiked(!next);
      setCount(count);
      show('Network error', 'error');
    } finally {
      setPending(false);
    }
  }

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    const all = readSaved();
    if (next) all.add(projectId);
    else all.delete(projectId);
    writeSaved(all);
    show(next ? 'Saved' : 'Removed from saved', 'success');
  }

  async function shareProject() {
    const url = `${window.location.origin}/p/${slug}`;
    const shareTitle = `${title} — LennGram`;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
        return;
      } catch {
        // user cancelled
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      show('Link copied', 'success');
    } catch {
      show('Could not copy link', 'error');
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => void toggleLike()}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike' : 'Like'}
        disabled={pending}
        className="inline-flex items-center gap-2 h-11 px-4 rounded-pill bg-bg border border-border text-[13px] tracking-tight text-text hover:bg-bg-muted transition-colors disabled:opacity-50"
      >
        <IGHeartOutline
          filled={liked}
          className={['h-5 w-5', liked ? 'text-accent' : 'text-text'].join(' ')}
        />
        <span className="tabular-nums">{count.toLocaleString()}</span>
      </button>
      <button
        type="button"
        onClick={toggleSaved}
        aria-pressed={saved}
        aria-label={saved ? 'Unsave' : 'Save'}
        className="inline-flex items-center justify-center h-11 w-11 rounded-pill bg-bg border border-border text-text hover:bg-bg-muted transition-colors"
      >
        <IGSaveOutline filled={saved} className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => void shareProject()}
        aria-label="Share"
        className="inline-flex items-center justify-center h-11 w-11 rounded-pill bg-bg border border-border text-text hover:bg-bg-muted transition-colors"
      >
        <IGPaperPlane className="h-5 w-5" />
      </button>
    </div>
  );
}
