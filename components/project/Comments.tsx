import type { MockComment } from '@/lib/mock';

interface CommentsProps {
  comments: MockComment[];
}

function formatRelativeAgo(hours: number): string {
  if (hours < 1) return 'now';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  return `${Math.floor(days / 30)}mo`;
}

function initialOf(handle: string): string {
  return handle.charAt(0).toUpperCase();
}

export function Comments({ comments }: CommentsProps) {
  return (
    <section id="comments" className="mt-12 pt-10 border-t border-border scroll-mt-24">
      <header className="mb-5">
        <h2 className="font-sans text-[20px] sm:text-[28px] text-text font-semibold tracking-heading leading-tight">
          {comments.length === 1 ? '1 comment' : `${comments.length} comments`}
        </h2>
      </header>

      <ul className="space-y-5">
        {comments.map((c) => {
          const isDark = c.avatar_color === '#1d1d1f' || c.avatar_color === '#0071e3';
          return (
            <li key={c.id} className="flex items-start gap-3">
              <span
                className="h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-semibold tracking-tighter shrink-0"
                style={{
                  backgroundColor: c.avatar_color,
                  color: isDark ? '#f5f5f7' : '#1d1d1f',
                }}
                aria-hidden
              >
                {initialOf(c.author)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-text leading-relaxed tracking-tight">
                  <span className="font-semibold text-text mr-1.5">
                    {c.author}
                  </span>
                  <span className="text-text-2">{c.text}</span>
                </p>
                <div className="mt-1.5 flex items-center gap-4 text-[12px] tracking-tight text-text-muted">
                  <time>{formatRelativeAgo(c.posted_offset_hours)} ago</time>
                  <button
                    type="button"
                    className="hover:text-text"
                    aria-label={`Like comment by ${c.author}`}
                  >
                    {c.likes} {c.likes === 1 ? 'like' : 'likes'}
                  </button>
                  <button
                    type="button"
                    className="hover:text-text"
                    aria-label={`Reply to ${c.author}`}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
