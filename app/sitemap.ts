import type { MetadataRoute } from 'next';
import { getFeed } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { items } = await getFeed({ pageSize: 1000 });

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = items.map((p) => ({
    url: `${siteUrl}/p/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...projectEntries];
}
