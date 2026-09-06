import Link from 'next/link';
import { ProjectCard } from '@/components/feed/ProjectCard';
import { StoryStrip } from '@/components/feed/StoryStrip';
import { Suggestions } from '@/components/feed/Suggestions';
import { FilterPills } from '@/components/feed/FilterPills';
import { Hero } from '@/components/feed/Hero';
import { ScrollToTop } from '@/components/feed/ScrollToTop';
import { getFeed } from '@/lib/queries';
import { ArrowRight } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ tech?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tech = typeof params.tech === 'string' ? params.tech : null;
  const { items, tags } = await getFeed({ tech });

  return (
    <main className="bg-bg">
      <Hero />

      {/* Desktop: 3-col grid | Mobile: single col */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left sidebar — nav links (desktop only) */}
          <aside className="hidden lg:flex lg:flex-col lg:col-span-2 lg:sticky lg:top-20 lg:h-fit lg:self-start gap-1 py-4">
            <span className="px-3 py-2 rounded-lg text-[14px] font-semibold tracking-tight text-text bg-bg-muted">LennGram</span>
            <Link href="/" className="px-3 py-2 rounded-lg text-[14px] text-text-2 hover:bg-bg-muted hover:text-text tracking-tight transition-colors flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Home
            </Link>
            <Link href="/liked" className="px-3 py-2 rounded-lg text-[14px] text-text-2 hover:bg-bg-muted hover:text-text tracking-tight transition-colors flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              Liked
            </Link>
            <Link href="/saved" className="px-3 py-2 rounded-lg text-[14px] text-text-2 hover:bg-bg-muted hover:text-text tracking-tight transition-colors flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              Saved
            </Link>
            <Link href="/you" className="px-3 py-2 rounded-lg text-[14px] text-text-2 hover:bg-bg-muted hover:text-text tracking-tight transition-colors flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path></svg>
              Profile
            </Link>
            <div className="mt-6 pt-4 border-t border-border">
              <Link href="/admin" className="px-3 py-2 rounded-lg text-[14px] text-text-muted hover:bg-bg-muted hover:text-text tracking-tight transition-colors flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Admin
              </Link>
            </div>
          </aside>

          {/* Main feed */}
          <div className="lg:col-span-7 min-w-0">
            {tags.length > 0 && <FilterPills tags={tags} active={tech} />}
            {items.length > 0 && tech === null && <StoryStrip projects={items} />}
            <section aria-label="Project feed">
              {items.length === 0 ? (
                <EmptyState tech={tech} />
              ) : (
                items.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))
              )}
            </section>
            {items.length > 3 && <Suggestions projects={items} />}
          </div>

          {/* Right sidebar — profile card + links (desktop only) */}
          <aside className="hidden lg:flex lg:flex-col lg:col-span-3 lg:sticky lg:top-20 lg:h-fit lg:self-start gap-4 py-4">
            <div className="rounded-xl bg-bg-muted border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-text text-bg flex items-center justify-center font-semibold text-[16px] tracking-tightest shrink-0" aria-hidden="true">L</div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold tracking-tight text-text truncate">lenn0109</p>
                  <p className="text-[12px] text-text-muted tracking-tight truncate">lennlynx91@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-4 pt-1">
                <div>
                  <p className="text-[14px] font-semibold tracking-tight text-text tabular-nums">{items.length}</p>
                  <p className="text-[11px] text-text-muted tracking-tight">projects</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold tracking-tight text-text tabular-nums">{items.reduce((s, p) => s + (p.like_count ?? 0), 0)}</p>
                  <p className="text-[11px] text-text-muted tracking-tight">likes</p>
                </div>
              </div>
              <a href="/you" className="block w-full text-center py-2 rounded-lg bg-bg border border-border text-[13px] font-semibold tracking-tight text-text hover:bg-bg-hover transition-colors">
                View profile
              </a>
            </div>

            <div className="rounded-xl bg-bg-muted border border-border p-4 space-y-1">
              <p className="text-[11px] font-semibold tracking-wide uppercase text-text-muted mb-2">Quick links</p>
              <a href="https://github.com/Lenn0109" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-text-2 hover:bg-bg-hover hover:text-text tracking-tight transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                GitHub
              </a>
              <a href="mailto:hello@lenngram.dev" className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-text-2 hover:bg-bg-hover hover:text-text tracking-tight transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                Email
              </a>
              <a href="https://github.com/Lenn0109/LennGram" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-text-2 hover:bg-bg-hover hover:text-text tracking-tight transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path></svg>
                Source code
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* HRD contact CTA */}
      <section
        id="contact"
        className="bg-bg-muted border-t border-border scroll-mt-16"
      >
        <div className="mx-auto max-w-apple px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-eyebrow text-text-muted mb-3">Get in touch</p>
          <h2 className="font-display text-[40px] sm:text-[56px] text-text">
            Let&apos;s build something.
          </h2>
          <p className="mt-3 text-[17px] sm:text-[21px] text-text-2 max-w-prose mx-auto tracking-tight">
            Open to interesting full-time roles, freelance work, and weird side
            projects. Reach out and I&apos;ll respond within a day.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="mailto:hello@lenngram.dev"
              className="btn-blue"
            >
              hello@lenngram.dev
              <ArrowRight className="h-4 w-4 ml-1" strokeWidth={2} />
            </a>
            <Link
              href="https://github.com/Lenn0109"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-link text-accent border border-accent/40"
            >
              GitHub →
            </Link>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </main>
  );
}

function EmptyState({ tech }: { tech: string | null }) {
  return (
    <div className="px-6 py-20 text-center">
      <p className="text-eyebrow text-text-muted mb-2">No projects</p>
      <p className="text-[17px] text-text-2 tracking-tight">
        {tech
          ? `No projects tagged #${tech} yet.`
          : 'No published projects yet.'}
      </p>
      {tech && (
        <Link
          href="/"
          className="pill-link text-accent border border-accent/40 mt-5 inline-flex"
        >
          ← Back to all
        </Link>
      )}
    </div>
  );
}
