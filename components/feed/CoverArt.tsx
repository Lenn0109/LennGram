// CoverArt — generates project cover art when no cover_url is set.
// Each project gets a deterministic but visually distinct SVG: gradient
// + noise pattern + tag chips + project initial. Looks like a real
// "screenshot tile" rather than a placeholder.

import type { ProjectWithCount } from '@/lib/types';

interface CoverArtProps {
  project: ProjectWithCount;
}

const PALETTES = [
  { from: '#667eea', to: '#764ba2', accent: '#ffffff' }, // violet
  { from: '#f093fb', to: '#f5576c', accent: '#ffffff' }, // pink
  { from: '#4facfe', to: '#00f2fe', accent: '#0a1a2c' }, // ocean
  { from: '#43e97b', to: '#38f9d7', accent: '#0a2e1f' }, // mint
  { from: '#fa709a', to: '#fee140', accent: '#3a1019' }, // peach
  { from: '#30cfd0', to: '#330867', accent: '#ffffff' }, // teal
  { from: '#a8edea', to: '#fed6e3', accent: '#3a2a35' }, // cotton
  { from: '#ff9a9e', to: '#fad0c4', accent: '#3a1a1f' }, // rose
  { from: '#1a2a6c', to: '#b21f1f', accent: '#fdbb2d' }, // hero
  { from: '#ee9ca7', to: '#ffdde1', accent: '#3a1a25' }, // blush
];

function pickPalette(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function CoverArt({ project }: CoverArtProps) {
  const palette = pickPalette(project.id);
  const initial = project.title.charAt(0).toUpperCase();
  const seed = parseInt(project.id.replace(/[^0-9]/g, '').slice(0, 8) || '0', 10) || 1;

  // Generate a few subtle shapes for visual texture
  const shapes = Array.from({ length: 6 }, (_, i) => {
    const x = pseudoRandom(seed + i * 7) * 100;
    const y = pseudoRandom(seed + i * 13) * 100;
    const r = 8 + pseudoRandom(seed + i * 19) * 24;
    const o = 0.05 + pseudoRandom(seed + i * 23) * 0.12;
    return { x, y, r, o };
  });

  return (
    <svg
      viewBox="0 0 400 500"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${project.title} cover`}
    >
      <defs>
        <linearGradient id={`g-${project.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
        <filter id={`n-${project.id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed % 100} />
          <feColorMatrix
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.06 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* Background gradient */}
      <rect width="400" height="500" fill={`url(#g-${project.id})`} />

      {/* Soft floating shapes for texture */}
      {shapes.map((s, i) => (
        <circle
          key={i}
          cx={s.x * 4}
          cy={s.y * 5}
          r={s.r * 1.5}
          fill={palette.accent}
          fillOpacity={s.o}
        />
      ))}

      {/* Subtle noise overlay */}
      <rect width="400" height="500" fill="white" filter={`url(#n-${project.id})`} opacity="0.5" />

      {/* Big initial letter, top-left */}
      <text
        x="36"
        y="100"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="72"
        fontWeight="700"
        fill={palette.accent}
        fillOpacity="0.95"
        letterSpacing="-2"
      >
        {initial}
      </text>

      {/* Project title, bottom-left */}
      <text
        x="36"
        y="430"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="22"
        fontWeight="600"
        fill={palette.accent}
        letterSpacing="-0.5"
      >
        {project.title.length > 18 ? project.title.slice(0, 17) + '…' : project.title}
      </text>

      {/* Tech stack chips, bottom row */}
      {project.tech_stack.slice(0, 3).map((tag, i) => (
        <g key={tag} transform={`translate(${36 + i * 78}, 450)`}>
          <rect
            width={tag.length * 6.5 + 16}
            height="20"
            rx="2"
            fill={palette.accent}
            fillOpacity="0.15"
            stroke={palette.accent}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
          <text
            x="8"
            y="14"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fontWeight="500"
            fill={palette.accent}
            letterSpacing="1"
          >
            {tag.toUpperCase().slice(0, 10)}
          </text>
        </g>
      ))}
    </svg>
  );
}
