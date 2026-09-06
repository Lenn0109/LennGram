'use client';

import Link from 'next/link';
import { ArrowRight, Github, Mail, Lock, Heart, Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

const LIKED_KEY = 'lenngram:liked';
const SAVED_KEY = 'lenngram:saved';

function readCount(key: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function YouPage() {
  const [liked, setLiked] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  useEffect(() => {
    setLiked(readCount(LIKED_KEY));
    setSaved(readCount(SAVED_KEY));
    const onFocus = () => {
      setLiked(readCount(LIKED_KEY));
      setSaved(readCount(SAVED_KEY));
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <main className="bg-bg">
      {/* Hero */}
      <header className="bg-bg-muted border-b border-border">
        <div className="mx-auto max-w-apple px-4 sm:px-6 py-12 sm:py-20">
          <p className="text-eyebrow text-text-muted">Your space</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Big avatar / initial */}
              <div
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-text text-bg flex items-center justify-center font-display text-[28px] sm:text-[36px] tracking-tightest shrink-0"
                aria-hidden
              >
                L
              </div>
              <div>
                <h1 className="font-display text-[36px] sm:text-[56px] text-text tracking-tightest leading-none">
                  lenn0109
                </h1>
                <p className="mt-2 text-[15px] sm:text-[17px] text-text-2 tracking-tight">
                  The projects you&apos;ve found worth keeping.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill bg-text text-bg text-[13px] tracking-tight font-medium hover:opacity-90 transition-opacity"
              >
                View work
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Link>
              <a
                href="https://github.com/Lenn0109"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-pill border border-border bg-bg text-text hover:bg-bg-muted transition-colors"
                aria-label="Open GitHub profile (external)"
              >
                <Github className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </a>
              <a
                href="mailto:hello@lenngram.dev"
                className="inline-flex items-center justify-center h-9 w-9 rounded-pill border border-border bg-bg text-text hover:bg-bg-muted transition-colors"
                aria-label="Send email"
              >
                <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Two cards */}
      <section className="mx-auto max-w-apple px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liked card */}
          <Link
            href="/liked"
            className="group block p-6 rounded-2xl border border-border bg-bg hover:bg-bg-muted transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-text-2" strokeWidth={1.75} aria-hidden />
                  <p className="text-eyebrow text-text-muted">Liked</p>
                </div>
                <h2 className="mt-3 font-display text-[44px] sm:text-[56px] text-text tracking-tightest leading-none tabular-nums">
                  {liked === null ? '—' : liked}
                </h2>
                <p className="mt-2 text-[14px] text-text-2 tracking-tight">
                  {liked === 1
                    ? 'project you’ve hearted.'
                    : 'projects you’ve hearted.'}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-text-muted shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
            </div>
          </Link>

          {/* Saved card */}
          <Link
            href="/saved"
            className="group block p-6 rounded-2xl border border-border bg-bg hover:bg-bg-muted transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-text-2" strokeWidth={1.75} aria-hidden />
                  <p className="text-eyebrow text-text-muted">Saved</p>
                </div>
                <h2 className="mt-3 font-display text-[44px] sm:text-[56px] text-text tracking-tightest leading-none tabular-nums">
                  {saved === null ? '—' : saved}
                </h2>
                <p className="mt-2 text-[14px] text-text-2 tracking-tight">
                  {saved === 1
                    ? 'project saved for later.'
                    : 'projects saved for later.'}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-text-muted shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
            </div>
          </Link>
        </div>

        {/* Owner-only admin */}
        <div className="mt-4 p-6 rounded-2xl border border-border bg-bg-muted">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-pill bg-bg flex items-center justify-center text-text-2 shrink-0">
              <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-eyebrow text-text-muted">Site owner</p>
              <h2 className="mt-1 font-display text-[20px] text-text tracking-tight">
                Manage projects
              </h2>
              <p className="mt-1 text-[14px] text-text-2 tracking-tight">
                Add, edit, and remove projects. Password protected.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill bg-text text-bg text-[13px] tracking-tight font-medium hover:opacity-90 transition-opacity shrink-0"
            >
              Sign in
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
