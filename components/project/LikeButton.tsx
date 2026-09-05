'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  projectId: string;
  initialCount: number;
}

export function LikeButton({ projectId, initialCount }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState(false);

  async function handleLike() {
    if (animating) return;
    setError(false);
    setAnimating(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => c + (wasLiked ? -1 : 1));

    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectId, unlike: wasLiked }),
      });
      if (!res.ok) throw new Error('like failed');
      const data = (await res.json()) as { liked: boolean; totalLikes: number };
      setLiked(data.liked);
      setCount(data.totalLikes);
    } catch {
      // Rollback optimistic update.
      setLiked(wasLiked);
      setCount((c) => c + (wasLiked ? 1 : -1));
      setError(true);
    } finally {
      setTimeout(() => setAnimating(false), 200);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike project' : 'Like project'}
        className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-bg hover:bg-bg-muted transition-colors duration-fast ease-out"
      >
        <Heart
          strokeWidth={1.5}
          className={`h-4 w-4 transition-transform duration-slow ease-out ${
            animating ? 'scale-125' : 'scale-100'
          } ${liked ? 'fill-current' : 'fill-none'}`}
          aria-hidden="true"
        />
        <span className="text-sm tabular-nums">{count}</span>
      </button>
      {error && (
        <span className="text-xs text-text-muted" role="status">
          Could not save. Try again.
        </span>
      )}
    </div>
  );
}
