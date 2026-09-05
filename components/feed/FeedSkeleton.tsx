export function FeedSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="break-inside-avoid mb-4 border border-border">
          <div className="aspect-square bg-bg-muted animate-pulse" />
          <div className="px-4 py-4 space-y-2">
            <div className="h-4 w-2/3 bg-bg-muted animate-pulse" />
            <div className="h-3 w-1/3 bg-bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
