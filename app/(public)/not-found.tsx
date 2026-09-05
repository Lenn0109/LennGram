import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="text-xs font-mono uppercase tracking-widest text-text-muted">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tightest">
          Nothing here
        </h1>
        <p className="text-sm text-text-muted">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 border border-border bg-bg hover:bg-bg-muted text-sm no-underline transition-colors duration-fast ease-out"
        >
          Back to feed
        </Link>
      </div>
    </main>
  );
}
