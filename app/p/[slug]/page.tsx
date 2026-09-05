import { notFound } from 'next/navigation';
import { ExternalLink, Github } from 'lucide-react';
import type { Metadata } from 'next';
import { TopNav } from '@/components/feed/TopNav';
import { Markdown } from '@/components/project/Markdown';
import { LikeButton } from '@/components/project/LikeButton';
import { ViewTracker } from '@/components/project/ViewTracker';
import { getProjectBySlug, getFeed } from '@/lib/queries';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getProjectBySlug(slug);
  if (!project) return { title: 'Not found' };

  const description = project.description.replace(/[#*`>_~\-]+/g, '').slice(0, 160);
  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: 'article',
      images: project.cover_url ? [project.cover_url] : ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: project.cover_url ? [project.cover_url] : ['/og.png'],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const { project, recentViews } = await getProjectBySlug(slug);
  if (!project) notFound();

  // Ensure we have a tags array even if project was loaded via getProjectBySlug.
  const { tags: allTags } = await getFeed({ pageSize: 1 });

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-8 space-y-4">
              <div className="relative w-full aspect-video bg-bg-muted overflow-hidden">
                {project.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-text-subtle text-xs font-mono uppercase tracking-widest">
                    {project.title}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-bg-muted px-2 py-1 text-xs font-mono uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 border border-border bg-bg hover:bg-bg-muted no-underline text-sm transition-colors duration-fast ease-out"
                  >
                    <Github strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                    Repository
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 border border-border bg-bg hover:bg-bg-muted no-underline text-sm transition-colors duration-fast ease-out"
                  >
                    <ExternalLink strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                    Live demo
                  </a>
                )}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <LikeButton
                  projectId={project.id}
                  initialCount={project.like_count}
                />
                <span className="text-sm text-text-muted tabular-nums">
                  {recentViews} viewer{recentViews === 1 ? '' : 's'} this week
                </span>
              </div>
            </div>
          </aside>

          <article className="lg:col-span-7">
            <header className="mb-6 space-y-2">
              <h1 className="text-3xl font-bold tracking-tightest">
                {project.title}
              </h1>
              <p className="text-sm text-text-muted font-mono uppercase tracking-widest">
                {project.featured ? 'Featured' : 'Project'} ·{' '}
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </header>

            <Markdown source={project.description} />

            {allTags.length > 0 && (
              <section className="mt-12 pt-8 border-t border-border">
                <h2 className="text-lg font-semibold mb-3 tracking-tighter">
                  More projects
                </h2>
                <p className="text-sm text-text-muted">
                  Browse the feed to see all{' '}
                  <a href="/" className="text-text underline">
                    projects
                  </a>
                  .
                </p>
              </section>
            )}
          </article>
        </div>

        <ViewTracker projectId={project.id} />
      </main>
    </>
  );
}
