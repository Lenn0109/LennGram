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

      <div id="feed-top" className="mx-auto max-w-feed sm:max-w-2xl">
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
