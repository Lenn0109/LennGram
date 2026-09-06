import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 bg-bg-muted">
      <div className="max-w-md w-full text-center">
        <p className="text-eyebrow text-text-muted">Error 404</p>
        <h1 className="mt-2 font-sans text-[40px] sm:text-[64px] text-text font-semibold tracking-display leading-[0.95]">
          Page not found.
        </h1>
        <p className="mt-3 text-[17px] text-text-2 tracking-tight leading-relaxed">
          The page you&apos;re looking for isn&apos;t here. It may have been moved or never existed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link href="/" className="btn-blue">
            <ArrowLeft className="h-4 w-4 mr-1.5" strokeWidth={2} />
            Back to projects
          </Link>
          <Link
            href="mailto:hello@lenngram.dev"
            className="pill-link text-text-2 border border-border"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
