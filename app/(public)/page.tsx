import { StoryStrip } from '@/components/feed/StoryStrip';
import { Feed } from '@/components/feed/Feed';
import { getFeed } from '@/lib/queries';

interface PageProps {
  searchParams: Promise<{ tech?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tech = typeof params.tech === 'string' ? params.tech : null;

  const { items } = await getFeed({ tech });

  return (
    <>
      <StoryStrip projects={items} />
      <Feed initialItems={items} tech={tech} />
    </>
  );
}
