import { TopNav } from '@/components/feed/TopNav';
import { FilterChips } from '@/components/feed/FilterChips';
import { LoadMore } from '@/components/feed/LoadMore';
import { getFeed } from '@/lib/queries';

interface PageProps {
  searchParams: Promise<{ tech?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tech = typeof params.tech === 'string' ? params.tech : null;

  const { items, hasMore, tags } = await getFeed({ tech });

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-6 space-y-3">
          <h1 className="text-3xl font-bold tracking-tightest">
            Projects
          </h1>
          <p className="text-sm text-text-muted">
            Handmade work, monochrome by intent.
          </p>
        </section>

        {tags.length > 0 && (
          <section className="mb-6">
            <FilterChips tags={tags} active={tech} />
          </section>
        )}

        <LoadMore initialItems={items} hasMore={hasMore} tech={tech} />
      </main>
    </>
  );
}
