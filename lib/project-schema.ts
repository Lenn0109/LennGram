import { z } from 'zod';

const SLUG_RE = /^[a-z0-9-]+$/;

export const projectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Max 100 characters'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(100, 'Max 100 characters')
    .regex(SLUG_RE, 'Lowercase letters, numbers, and hyphens only'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(10000, 'Max 10000 characters'),
  cover_url: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional()
    .transform((v) => (v === '' ? null : v)),
  images: z
    .array(z.string().trim())
    .max(5, 'Max 5 gallery images')
    .default([]),
  repo_url: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional()
    .transform((v) => (v === '' ? null : v)),
  demo_url: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional()
    .transform((v) => (v === '' ? null : v)),
  tech_stack: z
    .array(z.string().min(1))
    .max(10, 'Max 10 tags')
    .default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

export type ProjectFormValues = z.input<typeof projectFormSchema>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
