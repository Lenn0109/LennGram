'use client';

import Link from 'next/link';
import { ArrowRight, Github, Mail, Lock } from 'lucide-react';
import { PreviewStrip } from '@/components/feed/PreviewStrip';

export default function YouPage() {
  return (
    <main className="bg-bg">
      {/* Hero */}
      <header className="bg-bg-muted border-b border-border">
        <div className="mx-auto max-w-apple px-4 sm:px-6 py-12 sm:py-20">
          <p className="text-eyebrow text-text-muted">Your space</p>
          <div className="mt-4 flex items-center gap-4 sm:gap-5">
            <div
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-text text-bg flex items-center justify-center font-display text-[28px] sm:text-[36px] tracking-tightest shrink-0"
              aria-hidden
            >
              L
            </div>
            <div>
              <h1 className="font-sans text-[36px] sm:text-[64px] text-text font-semibold tracking-heading leading-[0.95]">
                lenn0109
              </h1>
              <p className="mt-2 text-[15px] sm:text-[17px] text-text-2 tracking-tight">
                The projects you&rsquo;ve found worth keeping.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 h-12 px-5 rounded-pill bg-text text-bg text-[13px] tracking-tight font-semibold hover:opacity-90 transition-opacity"
            >
              View work
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
            <a
              href="mailto:hello@lenngram.dev"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border-light bg-bg text-text hover:bg-bg-hover transition-colors"
              aria-label="Send email"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>
            <a
              href="https://github.com/Lenn0109"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border-light bg-bg text-text hover:bg-bg-hover transition-colors"
              aria-label="Open GitHub profile (external)"
            >
              <Github className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {/* Preview strips — show, don't count */}
      <section className="mx-auto max-w-apple px-4 sm:px-6 py-10 sm:py-14 pb-24 sm:pb-28 space-y-4">
        <PreviewStrip
          kind="liked"
          title="Liked"
          emptyTitle="No likes yet."
          emptyBody="Tap the heart on any project to add it here. Your likes live in this browser only."
          emptyCta={{ label: 'Browse projects', href: '/' }}
          ctaLabel="View all"
          ctaHref="/liked"
        />
        <PreviewStrip
          kind="saved"
          title="Saved"
          emptyTitle="No bookmarks yet."
          emptyBody="Tap the bookmark on any project to keep it for later. Your saved projects live in this browser only."
          emptyCta={{ label: 'Browse projects', href: '/' }}
          ctaLabel="View all"
          ctaHref="/saved"
        />
      </section>

      {/* Owner-only admin — compact, demoted, at the bottom */}
      <section className="mx-auto max-w-apple px-4 sm:px-6 pb-10 sm:pb-14">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 rounded-2xl border border-border bg-bg-muted p-4 hover:bg-bg-hover transition-colors"
        >
          <div className="h-9 w-9 rounded-pill bg-bg flex items-center justify-center text-text-2 shrink-0">
            <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-eyebrow text-text-muted">Site owner</p>
            <p className="text-[14px] text-text tracking-tight">
              Manage projects
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-text-muted shrink-0" strokeWidth={1.75} aria-hidden />
        </Link>
      </section>
    </main>
  );
}
