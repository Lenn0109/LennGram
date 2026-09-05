import { ProjectCard } from '@/components/feed/ProjectCard';
import { FilterChips } from '@/components/feed/FilterChips';
import { getFeed } from '@/lib/queries';

interface PageProps {
  searchParams: Promise<{ tech?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tech = typeof params.tech === 'string' ? params.tech : null;

  const { items, tags } = await getFeed({ tech });

  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-8 pt-12 sm:pt-20 pb-16">
      <header className="mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter leading-[1.05] mb-4">
          Projects
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-xl leading-relaxed">
          Handmade work, monochrome by intent. Independent projects,
          experiments, and a few that shipped.
        </p>
      </header>

      {tags.length > 0 && (
        <div className="mb-2 sm:mb-4">
          <FilterChips tags={tags} active={tech} />
        </div>
      )}

      <section>
        {items.length === 0 ? (
          <p className="text-text-muted py-16 text-center text-sm">
            No published projects yet.
          </p>
        ) : (
          items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </section>
    </main>
  );
}
