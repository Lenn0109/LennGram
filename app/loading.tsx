// Skeleton loader — Apple-style soft shimmer placeholders, not text.
// Matches the ProjectCard structure so the transition is seamless.

export default function Loading() {
  return (
    <main className="bg-bg">
      <div className="mx-auto max-w-feed sm:max-w-2xl">
        {[0, 1, 2].map((i) => (
          <article
            key={i}
            className={i === 0 ? '' : 'border-t border-border'}
            aria-hidden
          >
            {/* Header skeleton */}
            <div className="flex items-center gap-2.5 px-4 sm:px-5 pt-3.5 pb-2.5">
              <div className="h-8 w-8 rounded-full shimmer" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded shimmer" />
                <div className="h-2.5 w-16 rounded shimmer" />
              </div>
            </div>
            {/* Cover skeleton */}
            <div className="relative aspect-[4/5] w-full bg-bg-muted overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            {/* Action bar skeleton */}
            <div className="flex items-center justify-between px-4 sm:px-5 pt-3 pb-1">
              <div className="flex items-center gap-4">
                <div className="h-[22px] w-[22px] rounded shimmer" />
                <div className="h-[22px] w-[22px] rounded shimmer" />
                <div className="h-[22px] w-[22px] rounded shimmer" />
              </div>
              <div className="h-[22px] w-[22px] rounded shimmer" />
            </div>
            {/* Likes skeleton */}
            <div className="px-4 sm:px-5 pt-0.5 pb-1.5">
              <div className="h-3 w-16 rounded shimmer" />
            </div>
            {/* Caption skeleton */}
            <div className="px-4 sm:px-5 pb-2 space-y-1.5">
              <div className="h-3.5 w-full rounded shimmer" />
              <div className="h-3.5 w-3/4 rounded shimmer" />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
