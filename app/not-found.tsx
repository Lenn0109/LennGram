import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 bg-bg-muted">
      <div className="max-w-md w-full text-center space-y-5">
        <p className="text-eyebrow text-text-muted">Error 404</p>
        <h1 className="font-display text-[48px] sm:text-[56px] text-text">
          Nothing here.
        </h1>
        <p className="text-[17px] text-text-2 tracking-tight leading-relaxed">
          The page you&apos;re looking for isn&apos;t here. It may have been moved or never existed.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/" className="btn-blue">
            <ChevronLeft className="h-4 w-4 mr-1" strokeWidth={2} />
            Back to feed
          </Link>
        </div>
      </div>
    </main>
  );
}
