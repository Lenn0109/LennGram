'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  projectId: string;
  initialCount: number;
}

export function LikeButton({ projectId, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    const next = !liked;
    const newCount = next ? count + 1 : Math.max(0, count - 1);
    setLiked(next);
    setCount(newCount);
    setPending(true);
    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, unlike: !next }),
      });
    } catch {
      setLiked(!next);
      setCount(count);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-text-muted hover:text-text transition-colors duration-base ease-out inline-flex items-center gap-1.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text focus-visible:ring-offset-2 rounded-sm"
      aria-label={liked ? 'Unlike' : 'Like'}
      aria-pressed={liked}
    >
      <Heart
        className={[
          'h-4 w-4 transition-transform duration-base ease-out',
          liked ? 'fill-text text-text' : 'text-current',
        ].join(' ')}
        strokeWidth={1.5}
      />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
