// CoverArt — solid color field + project mark.
// Apple DNA: each project looks like a sculpture on a colored backdrop.
// No gradient mesh, no floating shapes, no noise. Just a colored field
// with a centered monogram and a small wordmark in the corner.

import type { ProjectWithCount } from '@/lib/types';

interface CoverArtProps {
  project: ProjectWithCount;
}

// Apple-like monochrome palette + 2 accent colors. Same as Apple's product
// page hero colors (black, white, midnight, silver, sky, mint, pink, blue).
const FIELDS: Array<{ bg: string; mark: string; label: string }> = [
  { bg: '#1d1d1f', mark: '#f5f5f7', label: 'Midnight' },
  { bg: '#f5f5f7', mark: '#1d1d1f', label: 'Silver' },
  { bg: '#0071e3', mark: '#ffffff', label: 'Blue' },
  { bg: '#ffffff', mark: '#1d1d1f', label: 'White' },
  { bg: '#fbf0d9', mark: '#1d1d1f', label: 'Starlight' },
  { bg: '#e8e3d8', mark: '#1d1d1f', label: 'Sand' },
  { bg: '#d2d2d7', mark: '#1d1d1f', label: 'Graphite' },
  { bg: '#424245', mark: '#f5f5f7', label: 'Space Gray' },
];

function pickField(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return FIELDS[Math.abs(hash) % FIELDS.length];
}

export function CoverArt({ project }: CoverArtProps) {
  const field = pickField(project.id);
  const initial = project.title.charAt(0).toUpperCase();
  const slug = project.title.toLowerCase();

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between py-12"
      style={{ backgroundColor: field.bg }}
      role="img"
      aria-label={`${project.title} cover`}
    >
      {/* Tiny mark top-left */}
      <span
        className="self-start ml-8 text-[10px] font-semibold tracking-[0.18em] uppercase opacity-70"
        style={{ color: field.mark }}
      >
        {project.tech_stack[0] ?? 'lenn0109'}
      </span>

      {/* Centered initial — Vercel-style compressed display */}
      <span
        className="font-sans font-semibold select-none"
        style={{
          color: field.mark,
          fontSize: 'clamp(120px, 28vw, 200px)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
        }}
        aria-hidden
      >
        {initial}
      </span>

      {/* Wordmark bottom */}
      <span
        className="self-center text-[14px] font-medium tracking-tightest opacity-90"
        style={{ color: field.mark }}
      >
        {slug}
      </span>
    </div>
  );
}
