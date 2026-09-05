import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { InstagramWordmark } from '@/components/ui/IgIcons';

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-border">
      <div className="mx-auto max-w-[470px] sm:max-w-2xl px-4 sm:px-6 h-11 flex items-center justify-between">
        <Link
          href="/"
          className="no-underline text-text"
          aria-label="LennGram home"
        >
          <InstagramWordmark className="h-7 w-24" />
        </Link>
        <div className="flex items-center gap-4 text-text">
          <Link href="/admin/login" aria-label="Activity" className="hover:opacity-60 transition-opacity">
            <Heart className="h-6 w-6" strokeWidth={1.75} />
          </Link>
          <Link href="/admin" aria-label="Messages" className="hover:opacity-60 transition-opacity">
            <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </header>
  );
}
