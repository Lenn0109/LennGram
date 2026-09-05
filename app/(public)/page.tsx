import { ProjectCard } from '@/components/feed/ProjectCard';
import { StoryStrip } from '@/components/feed/StoryStrip';
import { Suggestions } from '@/components/feed/Suggestions';
import { getFeed } from '@/lib/queries';

interface PageProps {
  searchParams: Promise<{ tech?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tech = typeof params.tech === 'string' ? params.tech : null;

  const { items } = await getFeed({ tech });

  return (
    <main className="mx-auto max-w-[470px] sm:max-w-2xl">
      {items.length > 0 && <StoryStrip projects={items} />}
      <section>
        {items.length === 0 ? (
          <p className="text-text-muted py-16 text-center text-sm">
            No published projects yet.
          </p>
        ) : (
          items.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))
        )}
      </section>
      {items.length > 3 && <Suggestions projects={items} />}
    </main>
  );
}
