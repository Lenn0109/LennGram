import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, Github, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { Markdown } from '@/components/project/Markdown';
import { ProjectActions } from '@/components/project/ProjectActions';
import { ViewTracker } from '@/components/project/ViewTracker';
import { RelatedProjects } from '@/components/project/RelatedProjects';
import { Comments } from '@/components/project/Comments';
import { CoverArt } from '@/components/feed/CoverArt';
import { StickyBreadcrumb } from '@/components/project/StickyBreadcrumb';
import { getProjectBySlug, getFeed } from '@/lib/queries';
import { MOCK_COMMENTS, formatTechName, descriptionSnippet } from '@/lib/mock';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getProjectBySlug(slug);
  if (!project) return { title: 'Not found' };

  const description = descriptionSnippet(project.description, 3).slice(0, 160);
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

  const { items: allItems } = await getFeed({ pageSize: 50 });
  const others = allItems.filter((p) => p.id !== project.id);
  const related = others.slice(0, 3);

  // prev/next navigation — index of current project in feed
  const allOrdered = allItems;
  const idx = allOrdered.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? allOrdered[idx - 1] : null;
  const next = idx >= 0 && idx < allOrdered.length - 1 ? allOrdered[idx + 1] : null;

  // Comments (mock)
  const comments = MOCK_COMMENTS[project.slug] ?? [];

  return (
    <main className="bg-bg">
      {/* Sticky breadcrumb — appears after scroll, replaces inline */}
      <StickyBreadcrumb trailing={project.title} />

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
                  <CoverArt project={project} />
                )}
                {project.featured && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 h-6 px-2.5 rounded-pill bg-bg/90 backdrop-blur text-[11px] font-semibold tracking-tight text-text">
                    ★ Featured
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?tech=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-2.5 h-[26px] rounded-pill text-[12px] tracking-tight text-text-2 bg-bg-muted font-medium hover:bg-bg-hover transition-colors"
                  >
                    {formatTechName(tag)}
                  </Link>
                ))}
              </div>

              {(project.repo_url || project.demo_url) && (
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
              )}

              <p className="text-[12px] text-text-muted tracking-tight tabular-nums pt-1">
                {recentViews} viewer{recentViews === 1 ? '' : 's'} this week
              </p>
            </div>
          </aside>

          <article className="lg:col-span-7">
            <header className="mb-6">
              <p className="text-eyebrow text-text-muted">
                {project.featured ? 'Featured project' : 'Project'}
              </p>
              <h1 className="mt-2 font-sans text-[40px] sm:text-[56px] text-text font-semibold tracking-display leading-[0.95]">
                {project.title}
              </h1>
              <p className="mt-2 text-[13px] text-text-muted tracking-tight">
                Shipped {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              {/* Action bar — pinned to header bottom with hairline divider */}
              <div className="mt-6 pt-5 border-t border-border">
                <ProjectActions
                  projectId={project.id}
                  slug={project.slug}
                  title={project.title}
                  initialCount={project.like_count}
                  initialSaved={false}
                />
              </div>
            </header>

            <div className="prose-like text-[17px] text-text-2 leading-relaxed">
              <Markdown source={project.description} />
            </div>

            {/* Comments — fixes the broken #comments anchor */}
            {comments.length > 0 && (
              <section id="comments">
                <Comments comments={comments} />
              </section>
            )}
          </article>
        </div>

        {/* Prev/Next pager */}
        {(prev || next) && (
          <nav
            aria-label="Project navigation"
            className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {prev ? (
              <Link
                href={`/p/${prev.slug}`}
                className="group flex items-center gap-3 p-5 rounded-md border border-border bg-bg hover:border-border-strong transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-text-muted group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">Previous</p>
                  <p className="text-[15px] font-semibold tracking-tight text-text truncate">
                    {prev.title}
                  </p>
                </div>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {next ? (
              <Link
                href={`/p/${next.slug}`}
                className="group flex items-center justify-end gap-3 p-5 rounded-md border border-border bg-bg hover:border-border-strong transition-colors text-right"
              >
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">Next</p>
                  <p className="text-[15px] font-semibold tracking-tight text-text truncate">
                    {next.title}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
              </Link>
            ) : (
              <span aria-hidden />
            )}
          </nav>
        )}

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
