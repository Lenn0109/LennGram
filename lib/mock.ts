import type { ProjectWithCount } from '@/lib/types';

// Mock data is used when SUPABASE env vars are missing so the dev server
// still renders the UI. In production / with real Supabase these are unused.

const NOW = new Date('2026-09-05T00:00:00Z').toISOString();

export const MOCK_PROJECTS: ProjectWithCount[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'lennmusic',
    title: 'LennMusic',
    description:
      '## What\n\nPersonal music dashboard built with Next.js 15 and the YouTube Data API.\n\n## Why\n\nTrack listening habits across platforms without giving up privacy.\n\n## Stack\n\n- Next.js 15 (App Router)\n- Postgres\n- Tailwind',
    cover_url: null,
    repo_url: 'https://github.com/Lenn0109/LennMusic',
    demo_url: null,
    tech_stack: ['nextjs', 'postgres', 'tailwind', 'typescript'],
    status: 'published',
    featured: true,
    display_order: 0,
    created_at: NOW,
    updated_at: NOW,
    like_count: 24,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    slug: 'paybox',
    title: 'PayBox',
    description: 'Design system extraction from PayPal clone.',
    cover_url: null,
    repo_url: 'https://github.com/Lenn0109/Site01_PayOx',
    demo_url: null,
    tech_stack: ['figma', 'design-system'],
    status: 'published',
    featured: false,
    display_order: 1,
    created_at: NOW,
    updated_at: NOW,
    like_count: 12,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    slug: 'lenngram',
    title: 'LennGram',
    description: 'This site. Project portfolio as a feed.',
    cover_url: null,
    repo_url: 'https://github.com/Lenn0109/LennGram',
    demo_url: null,
    tech_stack: ['nextjs', 'supabase', 'tailwind', 'typescript'],
    status: 'published',
    featured: false,
    display_order: 2,
    created_at: NOW,
    updated_at: NOW,
    like_count: 8,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    slug: 'vim-config',
    title: 'vim-config',
    description: 'Personal Vim/Neovim config (LSP, completion, statusline).',
    cover_url: null,
    repo_url: 'https://github.com/Lenn0109/vim-config',
    demo_url: null,
    tech_stack: ['vim', 'lua'],
    status: 'published',
    featured: false,
    display_order: 3,
    created_at: NOW,
    updated_at: NOW,
    like_count: 5,
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    slug: 'dotfiles',
    title: 'dotfiles',
    description: 'Linux, tmux, fish, alacritty — all the things.',
    cover_url: null,
    repo_url: 'https://github.com/Lenn0109/dotfiles',
    demo_url: null,
    tech_stack: ['fish', 'tmux', 'linux'],
    status: 'published',
    featured: false,
    display_order: 4,
    created_at: NOW,
    updated_at: NOW,
    like_count: 3,
  },
];

export const MOCK_TAGS = Array.from(
  new Set(MOCK_PROJECTS.flatMap((p) => p.tech_stack)),
).sort();

const NOW_DATE = new Date('2026-09-05T00:00:00Z');

export interface MockComment {
  id: string;
  author: string;
  handle: string;
  avatar_color: string;
  text: string;
  likes: number;
  posted_offset_hours: number;
}

// Per-project comment threads. Read-only mock data for the public detail page
// so the social proof feels real. Real comments will require a new table.
export const MOCK_COMMENTS: Record<string, MockComment[]> = {
  lennmusic: [
    {
      id: 'c-lm-1',
      author: 'hrd_reader',
      handle: 'hrd_reader',
      avatar_color: '#0071e3',
      text: 'Love the private listening dashboard. YouTube Data API was the right call — no Spotify dependency.',
      likes: 12,
      posted_offset_hours: 3,
    },
    {
      id: 'c-lm-2',
      author: 'dev_neighbor',
      handle: 'dev_neighbor',
      avatar_color: '#fbf0d9',
      text: 'How are you handling rate limits on the YT API?',
      likes: 4,
      posted_offset_hours: 18,
    },
    {
      id: 'c-lm-3',
      author: 'nightowl_pm',
      handle: 'nightowl_pm',
      avatar_color: '#1d1d1f',
      text: 'The privacy-first angle is what got me. Most "music dashboards" just reskin Spotify Wrapped.',
      likes: 8,
      posted_offset_hours: 26,
    },
    {
      id: 'c-lm-4',
      author: 'aria_codes',
      handle: 'aria_codes',
      avatar_color: '#43e97b',
      text: 'Curious about the data model. Are you storing per-track plays in Postgres or rolling up to a stats table?',
      likes: 6,
      posted_offset_hours: 41,
    },
    {
      id: 'c-lm-5',
      author: 'lenn0109',
      handle: 'lenn0109',
      avatar_color: '#1d1d1f',
      text: '@dev_neighbor rate limit is per-user, 10k units/day. I cache the trending list hourly and lazy-load the rest. @aria_codes raw plays in `listens` table, then a daily cron rolls into `track_stats`.',
      likes: 14,
      posted_offset_hours: 38,
    },
    {
      id: 'c-lm-6',
      author: 'lurker_42',
      handle: 'lurker_42',
      avatar_color: '#6e6e73',
      text: 'How long did the YT API approval take?',
      likes: 2,
      posted_offset_hours: 60,
    },
  ],
  paybox: [
    {
      id: 'c-pb-1',
      author: 'design_lead',
      handle: 'design_lead',
      avatar_color: '#1d1d1f',
      text: 'Clean token extraction. Most people skip the spacing scale.',
      likes: 8,
      posted_offset_hours: 6,
    },
    {
      id: 'c-pb-2',
      author: 'figma_lurker',
      handle: 'figma_lurker',
      avatar_color: '#0071e3',
      text: 'The 4-step type ramp (12/14/17/24) is solid. What\'s the body line-height?',
      likes: 5,
      posted_offset_hours: 14,
    },
    {
      id: 'c-pb-3',
      author: 'lenn0109',
      handle: 'lenn0109',
      avatar_color: '#1d1d1f',
      text: '@figma_lurker 1.5 for body, 1.3 for UI labels, 1.07 for display. The full ramp is in Design.md.',
      likes: 9,
      posted_offset_hours: 12,
    },
    {
      id: 'c-pb-4',
      author: 'paypal_og',
      handle: 'paypal_og',
      avatar_color: '#f09433',
      text: 'lol the OG PayPal blue. Nostalgia.',
      likes: 14,
      posted_offset_hours: 22,
    },
    {
      id: 'c-pb-5',
      author: 'token_curious',
      handle: 'token_curious',
      avatar_color: '#fbf0d9',
      text: 'Are these tokens generated or hand-tuned?',
      likes: 3,
      posted_offset_hours: 48,
    },
  ],
  lenngram: [
    {
      id: 'c-lg-1',
      author: 'feed_first',
      handle: 'feed_first',
      avatar_color: '#f09433',
      text: 'This site itself is the project. Recursive but true.',
      likes: 22,
      posted_offset_hours: 1,
    },
    {
      id: 'c-lg-2',
      author: 'curious_hr',
      handle: 'curious_hr',
      avatar_color: '#0071e3',
      text: 'When you have time, can you share the design system?',
      likes: 5,
      posted_offset_hours: 5,
    },
    {
      id: 'c-lg-3',
      author: 'dev_anon',
      handle: 'dev_anon',
      avatar_color: '#43e97b',
      text: 'The Apple DNA is on point. SF Pro + 980px pills + single accent is the cheat code.',
      likes: 18,
      posted_offset_hours: 9,
    },
    {
      id: 'c-lg-4',
      author: 'lenn0109',
      handle: 'lenn0109',
      avatar_color: '#1d1d1f',
      text: '@curious_hr yes, will publish the tokens once I freeze v1. @dev_anon Apple Human Interface Guidelines is essentially a public spec, the discipline is staying inside it.',
      likes: 11,
      posted_offset_hours: 7,
    },
    {
      id: 'c-lg-5',
      author: 'ux_skeptic',
      handle: 'ux_skeptic',
      avatar_color: '#6e6e73',
      text: 'Why 4:5 and not 1:1? IG-style is 1:1 for the grid.',
      likes: 7,
      posted_offset_hours: 16,
    },
    {
      id: 'c-lg-6',
      author: 'lenn0109',
      handle: 'lenn0109',
      avatar_color: '#1d1d1f',
      text: '@ux_skeptic 4:5 is the IG cover ratio in feed posts. 1:1 is only the profile grid. Feed = 4:5, profile = 1:1. Different surfaces, different ratios.',
      likes: 9,
      posted_offset_hours: 14,
    },
  ],
  'vim-config': [
    {
      id: 'c-vc-1',
      author: 'nvim_fan',
      handle: 'nvim_fan',
      avatar_color: '#43e97b',
      text: 'LSP setup looks familiar. Which completion engine?',
      likes: 3,
      posted_offset_hours: 24,
    },
    {
      id: 'c-vc-2',
      author: 'lenn0109',
      handle: 'lenn0109',
      avatar_color: '#1d1d1f',
      text: '@nvim_fan nvim-cmp + sources for LSP, snippets, buffer, path. Pretty stock but tuned.',
      likes: 6,
      posted_offset_hours: 22,
    },
    {
      id: 'c-vc-3',
      author: 'emacs_maxi',
      handle: 'emacs_maxi',
      avatar_color: '#6e6e73',
      text: 'Why not Doom Emacs?',
      likes: 11,
      posted_offset_hours: 36,
    },
    {
      id: 'c-vc-4',
      author: 'lazy_dev',
      handle: 'lazy_dev',
      avatar_color: '#f09433',
      text: 'Statusline is the part everyone skips. Yours is clean.',
      likes: 8,
      posted_offset_hours: 50,
    },
    {
      id: 'c-vc-5',
      author: 'telescope_fan',
      handle: 'telescope_fan',
      avatar_color: '#0071e3',
      text: 'telescope or fzf-lua?',
      likes: 4,
      posted_offset_hours: 72,
    },
  ],
  dotfiles: [
    {
      id: 'c-df-1',
      author: 'fish_swim',
      handle: 'fish_swim',
      avatar_color: '#30cfd0',
      text: 'Fish over zsh. Bold choice, but I get it.',
      likes: 7,
      posted_offset_hours: 9,
    },
    {
      id: 'c-df-2',
      author: 'zsh_purist',
      handle: 'zsh_purist',
      avatar_color: '#1d1d1f',
      text: 'Zsh with oh-my-zsh + powerlevel10k is unbeatable. Fight me.',
      likes: 4,
      posted_offset_hours: 14,
    },
    {
      id: 'c-df-3',
      author: 'lenn0109',
      handle: 'lenn0109',
      avatar_color: '#1d1d1f',
      text: '@zsh_purist fish\'s scripting syntax is just saner. I value my time more than my config file\'s portability.',
      likes: 9,
      posted_offset_hours: 12,
    },
    {
      id: 'c-df-4',
      author: 'tiler_wm',
      handle: 'tiler_wm',
      avatar_color: '#43e97b',
      text: 'Hyprland or Sway?',
      likes: 5,
      posted_offset_hours: 20,
    },
    {
      id: 'c-df-5',
      author: 'rice_lover',
      handle: 'rice_lover',
      avatar_color: '#fbf0d9',
      text: 'Post your rice.',
      likes: 13,
      posted_offset_hours: 28,
    },
  ],
};

// Format a tech tag: "nextjs" → "Next.js", "postgresql" → "PostgreSQL"
const TECH_DISPLAY: Record<string, string> = {
  nextjs: 'Next.js',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  typescript: 'TypeScript',
  tailwind: 'Tailwind',
  supabase: 'Supabase',
  figma: 'Figma',
  'design-system': 'Design System',
  vim: 'Vim',
  lua: 'Lua',
  fish: 'Fish',
  tmux: 'tmux',
  linux: 'Linux',
  javascript: 'JavaScript',
  nodejs: 'Node.js',
  react: 'React',
  python: 'Python',
  rust: 'Rust',
  docker: 'Docker',
};

export function formatTechName(tag: string): string {
  if (TECH_DISPLAY[tag]) return TECH_DISPLAY[tag];
  // Otherwise: title-case as fallback
  return tag
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Strip markdown (## headers, *, `, >, _, -) and return a short snippet
// for previews. Takes the first `lines` non-empty lines joined as prose.
export function descriptionSnippet(
  description: string | null | undefined,
  lines: number = 2
): string {
  if (!description) return '';
  return description
    .replace(/^#+[^\n]*\n+/gm, '') // strip all ## headers
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, lines)
    .join(' ');
}
