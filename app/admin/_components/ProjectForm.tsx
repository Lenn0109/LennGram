'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Upload, ArrowLeft } from 'lucide-react';
import {
  projectFormSchema,
  slugify,
  type ProjectFormValues,
} from '@/lib/project-schema';
import type { ProjectWithCount } from '@/lib/types';

interface ProjectFormProps {
  initial?: ProjectWithCount;
}

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function ProjectForm({ initial }: ProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.id));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url ?? '');
  const [repoUrl, setRepoUrl] = useState(initial?.repo_url ?? '');
  const [demoUrl, setDemoUrl] = useState(initial?.demo_url ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tech_stack ?? []);
  const [tagDraft, setTagDraft] = useState('');
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [status, setStatus] = useState<'draft' | 'published'>(
    initial?.status ?? 'draft',
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [displayOrder, setDisplayOrder] = useState<number>(
    initial?.display_order ?? 0,
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function addTag(raw: string) {
    const next = raw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (!next.length) return;
    setTags((prev) => Array.from(new Set([...prev, ...next])).slice(0, 10));
    setTagDraft('');
  }

  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === 'Backspace' && !tagDraft && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  async function handleFile(file: File) {
    if (!ALLOWED_MIME.includes(file.type)) {
      setErrors((p) => ({ ...p, cover_url: 'Use JPEG, PNG, or WebP' }));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setErrors((p) => ({ ...p, cover_url: 'Max 5 MB' }));
      return;
    }
    setErrors((p) => {
      const next = { ...p };
      delete next.cover_url;
      return next;
    });
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload_failed');
      const data = (await res.json()) as { url: string };
      setCoverUrl(data.url);
    } catch {
      setErrors((p) => ({ ...p, cover_url: 'Upload failed' }));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const values: ProjectFormValues = {
      title,
      slug: slugTouched ? slug : slugify(title),
      description,
      cover_url: coverUrl,
      repo_url: repoUrl,
      demo_url: demoUrl,
      tech_stack: tags,
      images,
      status,
      featured,
      display_order: displayOrder,
    };

    const parsed = projectFormSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        if (!next[path]) next[path] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const url = initial?.id
        ? `/api/admin/projects/${initial.id}`
        : '/api/admin/projects';
      const method = initial?.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          details?: string;
        };
        throw new Error(data.details ?? data.error ?? 'Save failed');
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Save failed');
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/projects/${initial.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Delete failed');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Title + Slug */}
      <div className="rounded-xl bg-bg shadow-vc p-5 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              maxLength={100}
              required
              placeholder="e.g. LennMusic"
              className="w-full h-11 px-4 rounded-xl bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base"
            />
            {errors.title && <p className="text-[12px] text-[#ff3b30] tracking-tight">{errors.title}</p>}
          </label>

          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">
              Slug <span className="normal-case font-normal text-text-subtle">/p/</span>
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
              maxLength={100}
              required
              placeholder="e.g. lennmusic"
              className="w-full h-11 px-4 rounded-xl bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base font-mono"
            />
            {errors.slug && <p className="text-[12px] text-[#ff3b30] tracking-tight">{errors.slug}</p>}
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">
            Description <span className="normal-case font-normal text-text-subtle">— Markdown</span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={10}
            placeholder="## What&#10;&#10;Brief description&#10;&#10;## Why&#10;&#10;Motivation..."
            className="w-full px-4 py-3 rounded-xl bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base font-mono resize-y"
          />
          {errors.description && <p className="text-[12px] text-[#ff3b30] tracking-tight">{errors.description}</p>}
        </label>
      </div>

      {/* Cover + URLs */}
      <div className="rounded-xl bg-bg shadow-vc p-5 space-y-4">
        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">Cover image</span>
          <div className="rounded-xl border border-dashed border-border p-4">
            {coverUrl ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="max-h-48 w-auto rounded-lg shadow-vc"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCoverUrl('')}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-bg-muted hover:bg-bg-hover text-[12px] font-medium tracking-tight text-text transition-colors duration-base"
                  >
                    <X strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
                    Remove
                  </button>
                  <span className="text-[11px] text-text-subtle font-mono truncate">{coverUrl.split('/').pop()}</span>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex items-center gap-2.5 text-[13px] text-text-muted hover:text-text transition-colors duration-base">
                <Upload strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                {uploading ? 'Uploading…' : 'Click to upload · JPEG / PNG / WebP · max 5 MB'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
                />
              </label>
            )}
          </div>
          {errors.cover_url && <p className="text-[12px] text-[#ff3b30] tracking-tight">{errors.cover_url}</p>}
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">
            Gallery <span className="normal-case font-normal text-text-subtle">— up to 5 images</span>
          </span>
          <div className="space-y-2">
            {images.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = e.target.value;
                    setImages(next);
                  }}
                  placeholder="https://..."
                  className="flex-1 h-11 px-4 rounded-xl bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="h-11 w-11 rounded-xl bg-bg-muted hover:bg-bg-hover flex items-center justify-center text-text-muted hover:text-text transition-colors"
                >
                  <X strokeWidth={1.5} className="h-4 w-4" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => setImages([...images, ''])}
                className="h-11 w-full rounded-xl border border-dashed border-border text-[13px] text-text-muted hover:text-text hover:border-border-strong transition-colors"
              >
                + Add image URL
              </button>
            )}
          </div>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">Repository</span>
            <input
              type="url"
              value={repoUrl ?? ''}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full h-11 px-4 rounded-xl bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">Demo URL</span>
            <input
              type="url"
              value={demoUrl ?? ''}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full h-11 px-4 rounded-xl bg-bg text-[15px] tracking-tight text-text placeholder:text-text-subtle shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base"
            />
          </label>
        </div>
      </div>

      {/* Tags + Settings */}
      <div className="rounded-xl bg-bg shadow-vc p-5 space-y-4">
        <label className="block space-y-1.5">
          <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">
            Tech tags <span className="normal-case font-normal text-text-subtle">— Enter or comma to add, up to 10</span>
          </span>
          <div className="min-h-[52px] px-4 py-3 rounded-xl bg-bg shadow-vc flex flex-wrap gap-2 items-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-bg-muted rounded-full px-3 py-1 text-[12px] font-medium tracking-tight text-text"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  className="text-text-muted hover:text-text transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X strokeWidth={1.5} className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={onTagKeyDown}
              onBlur={() => addTag(tagDraft)}
              placeholder={tags.length === 0 ? 'nextjs, supabase, …' : ''}
              className="flex-1 min-w-[8rem] text-[14px] tracking-tight text-text placeholder:text-text-subtle outline-none bg-transparent"
            />
          </div>
          {errors.tech_stack && <p className="text-[12px] text-[#ff3b30] tracking-tight">{errors.tech_stack}</p>}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full h-11 px-4 rounded-xl bg-bg text-[15px] tracking-tight text-text shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-[12px] font-semibold tracking-small uppercase text-text-muted">Order</span>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-xl bg-bg text-[15px] tracking-tight text-text shadow-vc focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-base"
            />
          </label>
          <label className="flex items-end pb-1 gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              id="featured-check"
              className="h-4 w-4 accent-accent rounded cursor-pointer"
            />
            <label htmlFor="featured-check" className="text-[13px] text-text tracking-tight cursor-pointer select-none">
              Featured
            </label>
          </label>
        </div>
      </div>

      {submitError && (
        <p className="text-[13px] text-[#ff3b30] tracking-tight px-4 py-3 bg-[#ff3b30]/5 rounded-xl border border-[#ff3b30]/20" role="alert">
          {submitError}
        </p>
      )}

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 bg-bg shadow-[0_-1px_0_0_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          {initial?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="h-10 px-4 rounded-xl border border-border text-[13px] font-medium tracking-tight text-text hover:bg-bg-muted transition-colors duration-base disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            disabled={submitting}
            className="h-10 px-4 rounded-xl border border-border text-[13px] font-medium tracking-tight text-text hover:bg-bg-muted transition-colors duration-base disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="h-10 px-5 bg-accent hover:bg-accent/90 text-white text-[14px] font-semibold tracking-tight rounded-xl shadow-vc hover:shadow-vc-hover transition-all duration-base disabled:opacity-50"
          >
            {submitting ? 'Saving…' : initial?.id ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  );
}
