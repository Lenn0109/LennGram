import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, Github } from 'lucide-react';
import type { Metadata } from 'next';
import { Markdown } from '@/components/project/Markdown';
import { ProjectActions } from '@/components/project/ProjectActions';
import { ViewTracker } from '@/components/project/ViewTracker';
import { RelatedProjects } from '@/components/project/RelatedProjects';
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

  const description = project.description.replace(/[#*`>_\-]+/g, '').slice(0, 160);
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

  // Fetch feed for related projects + tags
  const { items: allItems } = await getFeed({ pageSize: 50 });
  const related = allItems
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  return (
    <main className="bg-bg">
      {/* Breadcrumb — Apple-style back link sticky under nav */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-apple px-4 sm:px-6 h-11 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px] tracking-tight text-accent hover:underline"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            Back to feed
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-apple px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="relative w-full aspect-[4/5] bg-bg-muted overflow-hidden shadow-apple-card rounded-md">
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

              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?tech=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-2.5 h-[26px] rounded-pill text-[12px] tracking-tight text-accent font-medium hover:bg-accent/10 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill border border-border bg-bg text-text text-[13px] tracking-tight hover:bg-bg-muted transition-colors"
                  >
                    <Github strokeWidth={1.75} className="h-4 w-4" aria-hidden />
                    Repository
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-pill bg-text text-bg text-[13px] tracking-tight hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink strokeWidth={1.75} className="h-4 w-4" aria-hidden />
                    Live demo
                  </a>
                )}
              </div>

              <div className="pt-1">
                <ProjectActions
                  projectId={project.id}
                  slug={project.slug}
                  title={project.title}
                  initialCount={project.like_count}
                  initialSaved={false}
                />
                <p className="mt-2 text-[12px] text-text-muted tracking-tight tabular-nums">
                  {recentViews} viewer{recentViews === 1 ? '' : 's'} this week
                </p>
              </div>
            </div>
          </aside>

          <article className="lg:col-span-7">
            <header className="mb-6 space-y-2">
              <p className="text-eyebrow text-text-muted">
                {project.featured ? 'Featured' : 'Project'}
              </p>
              <h1 className="font-display text-[40px] sm:text-[48px] text-text">
                {project.title}
              </h1>
              <p className="text-[13px] text-text-muted tracking-tight">
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </header>

            <div className="prose-like text-[17px] text-text-2 leading-relaxed">
              <Markdown source={project.description} />
            </div>
          </article>
        </div>

        {related.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <RelatedProjects projects={related} />
          </div>
        )}
      </div>

      <ViewTracker projectId={project.id} />
    </main>
  );
}
