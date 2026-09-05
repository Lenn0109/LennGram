import Link from 'next/link';
import { ProjectCard } from '@/components/feed/ProjectCard';
import { StoryStrip } from '@/components/feed/StoryStrip';
import { Suggestions } from '@/components/feed/Suggestions';
import { FilterPills } from '@/components/feed/FilterPills';
import { getFeed } from '@/lib/queries';

interface PageProps {
  searchParams: Promise<{ tech?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tech = typeof params.tech === 'string' ? params.tech : null;
  const { items, tags } = await getFeed({ tech });

  return (
    <main className="bg-bg">
      {/* Apple-style hero */}
      <section className="bg-bg-muted border-b border-border">
        <div className="mx-auto max-w-apple px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-eyebrow text-text-muted mb-3">Project Portfolio</p>
          <h1 className="font-display text-[40px] sm:text-[56px] text-text">
            LennGram.
          </h1>
          <p className="mt-3 text-[17px] sm:text-[21px] text-text-2 max-w-prose mx-auto tracking-tight">
            A small set of projects I&apos;ve built, shipped, and learned from.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Link href="#feed-top" className="btn-blue">
              Browse projects
            </Link>
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
