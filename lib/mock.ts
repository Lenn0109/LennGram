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
