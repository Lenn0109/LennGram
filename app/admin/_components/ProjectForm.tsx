'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload } from 'lucide-react';
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
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Title" error={errors.title}>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          maxLength={100}
          required
          className="w-full px-3 py-2 border border-border-strong bg-bg text-base rounded-sm"
        />
      </Field>

      <Field label="Slug" hint="URL path: /p/<slug>" error={errors.slug}>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          maxLength={100}
          required
          className="w-full px-3 py-2 border border-border-strong bg-bg text-base font-mono rounded-sm"
        />
      </Field>

      <Field label="Description" hint="Markdown supported" error={errors.description}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={12}
          className="w-full px-3 py-2 border border-border-strong bg-bg text-base font-mono rounded-sm"
        />
      </Field>

      <Field label="Cover image" error={errors.cover_url}>
        <div className="border border-dashed border-border-strong p-4">
          {coverUrl ? (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt="Cover preview"
                className="max-h-64 w-auto border border-border"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="inline-flex items-center gap-1 px-3 py-1 border border-border bg-bg hover:bg-bg-muted text-xs transition-colors duration-fast ease-out"
                >
                  <X strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
                  Remove
                </button>
                <span className="text-xs text-text-muted font-mono break-all">
                  {coverUrl}
                </span>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-text-muted">
              <Upload strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
              {uploading ? 'Uploading…' : 'Click to upload (JPEG / PNG / WebP, max 5 MB)'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          )}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Repository URL" error={errors.repo_url}>
          <input
            type="url"
            value={repoUrl ?? ''}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full px-3 py-2 border border-border-strong bg-bg text-base rounded-sm"
          />
        </Field>
        <Field label="Demo URL" error={errors.demo_url}>
          <input
            type="url"
            value={demoUrl ?? ''}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-border-strong bg-bg text-base rounded-sm"
          />
        </Field>
      </div>

      <Field
        label="Tech tags"
        hint="Press Enter or comma to add. Up to 10."
        error={errors.tech_stack}
      >
        <div className="border border-border-strong px-3 py-2 flex flex-wrap gap-1 items-center bg-bg rounded-sm">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-bg-muted px-2 py-0.5 text-xs font-mono uppercase tracking-widest"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                className="text-text-muted hover:text-text"
                aria-label={`Remove tag ${tag}`}
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
            className="flex-1 min-w-[8rem] outline-none bg-transparent text-sm py-1"
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            className="w-full px-3 py-2 border border-border-strong bg-bg text-base rounded-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Display order">
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full px-3 py-2 border border-border-strong bg-bg text-base rounded-sm"
          />
        </Field>
        <Field label="Featured">
          <label className="flex items-center gap-2 px-3 py-2 border border-border-strong bg-bg rounded-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">Pin to top of feed</span>
          </label>
        </Field>
      </div>

      {submitError && (
        <p className="text-sm border border-border-strong px-3 py-2" role="alert">
          {submitError}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 border-t border-border bg-bg px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          {initial?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="px-3 py-2 border border-border bg-bg hover:bg-bg-muted text-sm transition-colors duration-fast ease-out"
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
            className="px-3 py-2 border border-border bg-bg hover:bg-bg-muted text-sm transition-colors duration-fast ease-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="px-4 py-2 border border-text bg-text text-bg text-sm transition-colors duration-fast ease-out disabled:opacity-50"
          >
            {submitting ? 'Saving…' : initial?.id ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm font-medium">{label}</span>
      {hint && (
        <span className="block text-xs text-text-muted">{hint}</span>
      )}
      {children}
      {error && (
        <span className="block text-xs text-text-muted" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
