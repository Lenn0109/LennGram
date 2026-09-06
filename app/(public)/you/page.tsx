import Link from 'next/link';
import { ArrowRight, Github, Mail, Lock } from 'lucide-react';

export const dynamic = 'force-static';

export default function YouPage() {
  return (
    <main className="bg-bg">
      <header className="bg-bg-muted border-b border-border">
        <div className="mx-auto max-w-apple px-4 sm:px-6 py-12 sm:py-20">
          <p className="text-eyebrow text-text-muted">Profile</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="font-display text-[40px] sm:text-[56px] text-text tracking-tightest">
                lenn0109
              </h1>
              <p className="mt-2 text-[15px] sm:text-[17px] text-text-2 tracking-tight">
                A handmade project portfolio, kept in this browser.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://github.com/Lenn0109"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill border border-border bg-bg text-text text-[13px] tracking-tight hover:bg-bg-muted transition-colors"
                aria-label="Open GitHub profile (external)"
              >
                <Github className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                GitHub
              </a>
              <a
                href="mailto:hello@lenngram.dev"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill bg-accent text-bg text-[13px] tracking-tight font-medium hover:bg-accent/90 transition-colors"
                aria-label="Send email"
              >
                <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
                Email
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-apple px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liked card */}
          <Link
            href="/liked"
            className="group block p-6 rounded-2xl border border-border bg-bg hover:bg-bg-muted transition-colors"
          >
            <p className="text-eyebrow text-text-muted">Saved by you</p>
            <h2 className="mt-2 font-display text-[24px] sm:text-[28px] text-text tracking-tight">
              Liked projects
            </h2>
            <p className="mt-1.5 text-[14px] text-text-2 tracking-tight">
              The projects you&apos;ve hearted. Stored locally in this browser.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-[13px] text-accent font-medium">
              View
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </span>
          </Link>

          {/* Saved card */}
          <Link
            href="/saved"
            className="group block p-6 rounded-2xl border border-border bg-bg hover:bg-bg-muted transition-colors"
          >
            <p className="text-eyebrow text-text-muted">Saved by you</p>
            <h2 className="mt-2 font-display text-[24px] sm:text-[28px] text-text tracking-tight">
              Bookmarked projects
            </h2>
            <p className="mt-1.5 text-[14px] text-text-2 tracking-tight">
              The projects you&apos;ve bookmarked for later. Stored locally.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-[13px] text-accent font-medium">
              View
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </span>
          </Link>
        </div>

        {/* Owner-only admin */}
        <div className="mt-8 p-6 rounded-2xl border border-border bg-bg-muted">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-pill bg-bg flex items-center justify-center text-text-2 shrink-0">
              <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="flex-1">
              <p className="text-eyebrow text-text-muted">Site owner</p>
              <h2 className="mt-1 font-display text-[20px] text-text tracking-tight">
                Manage projects
              </h2>
              <p className="mt-1 text-[14px] text-text-2 tracking-tight">
                Add, edit, and remove projects. Owner only — password protected.
              </p>
              <Link
                href="/admin/login"
                className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-pill bg-text text-bg text-[13px] tracking-tight font-medium hover:opacity-90 transition-opacity"
              >
                Sign in
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
