# LennGram — Design System

> Apple DNA + Vercel token discipline. Monochrome foundation with single blue accent.
> Handmade, restrained, intentional.

## 1. Visual theme

| Property | Value |
|---|---|
| Theme | Light only (no dark mode toggle) |
| Tone | Calm, editorial, premium |
| Density | Comfortable (8px base grid) |
| Accent | `#0071e3` Apple Blue — used sparingly (links, active states, CTA) |
| Motion | Subtle (≤150ms ease-out) |
| Border | Hairline `#d2d2d7` on Apple `#f5f5f7` muted sections |
| Shadows | Shadow-as-border: `0 0 0 1px rgba(0,0,0,0.08)` + ambient lift |
| Icons | `lucide-react` (stroke 1.75, color `currentColor`) |
| Emoji | None in UI |
| Imagery | Project cover art (CSS-generated monograms), real screenshots for finished projects |

## 2. Color palette

Apple DNA + single blue accent:

| Token | Hex | Use |
|---|---|---|
| `bg` | `#ffffff` | Page background, card backgrounds |
| `bg-muted` | `#f5f5f7` | Hero section, sidebar, hover bg, muted areas |
| `bg-section` | `#fbfbfd` | Subtle section differentiation |
| `bg-elevated` | `#ffffff` | Card on `#f5f5f7` |
| `bg-hover` | `#f5f5f7` | Interactive hover (cards, buttons) |
| `text` | `#1d1d1f` | Primary text, headings |
| `text-2` | `#424245` | Secondary text, body copy |
| `text-muted` | `#6e6e73` | Captions, tertiary info |
| `text-subtle` | `#86868b` | Placeholder, disabled |
| `border` | `#d2d2d7` | Hairline dividers, card borders |
| `border-strong` | `#a1a1a6` | Input focus, strong dividers |
| `border-light` | `#e5e7eb` | Vercel-style light ring on pills |
| `accent` | `#0071e3` | Apple Blue — links, active states, CTA pills |
| `accent-hover` | `#0077ed` | Hover state for accent |
| `accent-soft` | `#2997ff` | Accent on dark bg |

**Rule**: accent `#0071e3` used only for: links, active filter pills, active nav, heart icon fill, primary CTA. Nowhere else.

## 3. Typography

**Font**: Geist (via `next/font/google`) — geometric, Vercel's own typeface. Variable font, zero FOUT.

```ts
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'
const geist = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })
```

**Tracking scale** (Vercel token discipline — aggressive negative at display sizes):

| Level | CSS var | Tracking | Size range | Weight | Use |
|---|---|---|---|---|---|
| Display | `--tracking-display` | -0.05em | 56-64px | 600 | Hero billboard |
| Heading | `--tracking-heading` | -0.03em | 28-40px | 600 | Section heads, H2 |
| Title | `--tracking-title` | -0.022em | 18-28px | 600 | Card titles |
| Body | `--tracking-body` | -0.011em | 15-17px | 400 | Paragraphs |
| Small | `--tracking-small` | -0.006em | 12-13px | 400-500 | Labels, captions |
| Eyebrow | (0.06em) | +0.06em | 12px | 600 | Section labels, uppercase |

Global: `font-feature-settings: 'liga' 1, 'tnum' 1` — ligatures + tabular nums on all text.

## 4. Spacing scale

8px base grid (Vercel standard):

| Token | px | Use |
|---|---|---|
| `gap-1` | 4px | Tight inline gap (icon + label) |
| `gap-2` | 8px | Small padding, tag gap |
| `gap-2.5` | 10px | Vercel card gap |
| `gap-3` | 12px | Card internal padding (mobile) |
| `gap-4` | 16px | Card internal padding (desktop), form gap |
| `gap-5` | 20px | Section internal |
| `gap-6` | 24px | Section gap (between feed cards) |
| `gap-8` | 32px | Page section padding |
| `gap-10` | 40px | Desktop sidebar gap |
| `gap-12` | 48px | Major section break |
| `gap-16` | 64px | Above-the-fold hero padding (desktop) |

**Rule**: use multiples of 8. No arbitrary values like 13px or 17px.

## 5. Border radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Buttons, inputs |
| `rounded` | 8px | Cards, modals |
| `rounded-md` | 12px | Large cards, panels |
| `rounded-lg` | 18px | Panels with padding |
| `rounded-pill` | 980px | Pills, story circles |
| `rounded-full` | 9999px | Avatar, full circles |

## 6. Shadow system

**Shadow-as-border** (Vercel signature pattern — looks like a border, lifts off page):

```css
/* Single ring: feels like a 1px border, not a shadow */
--shadow-ring: 0 0 0 1px rgba(0,0,0,0.08);
--shadow-ring-strong: 0 0 0 1px rgba(0,0,0,0.12);
--shadow-ring-light: 0 0 0 1px rgba(0,0,0,0.05);

/* Card shadow: ring + subtle ambient lift */
--shadow-card: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 2px rgba(0,0,0,0.04);
--shadow-card-hover: 0 0 0 1px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08);

/* Focus ring */
--shadow-focus: 0 0 0 2px var(--bg), 0 0 0 4px hsla(212, 100%, 48%, 0.5);
```

Applied via utility classes:
```html
<div class="shadow-vc">card with ring + ambient</div>
<div class="shadow-vc-hover hover:shadow-vc-hover">card hover</div>
<div class="focus-ring focus-ring:focus-visible">focusable</div>
```

**Old pattern to remove**: `shadow-apple-card` (4-layer Apple shadow) — replaced with shadow-as-border in Vercel polish.

## 7. Layout

### 7.1 Feed (`/`)

**Desktop (lg+)**: 3-column grid, 12-col CSS Grid
```
┌────────────┬──────────────────────────────┬─────────────────┐
│ Left Nav   │ Main Feed                    │ Right Sidebar   │
│ col-span-2 │ col-span-7                  │ col-span-3      │
│ sticky     │                              │ sticky          │
│            │ [stories]                   │ [Profile Card]  │
│ LennGram   │ [filter pills]              │ lenn0109        │
│ Home       │ [ProjectCard × N]           │ 5 projects      │
│ Liked      │ [Suggestions]               │ View profile    │
│ Saved      │                              │ [Quick Links]   │
│ Profile    │                              │ GitHub          │
│ Admin      │                              │ Email           │
└────────────┴──────────────────────────────┴─────────────────┘
```

**Tablet (sm-md)**: 2-column, no sidebars (hide left+right)

**Mobile (default)**: single column, bottom nav (Home/Liked/Saved/You), no sidebars

Container: `max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8`

### 7.2 Project detail (`/p/[slug]`)

```
Desktop:  [sticky cover 5/12]  |  [content 7/12]
Mobile:   [cover full-width]   →  [content]
```

### 7.3 /you profile page

Single column. Hero section (avatar + "lenn0109" at 64px display) → PreviewStrip thumbnail grids (Liked + Saved sections).

### 7.4 Admin (`/admin`)

Single column table layout. No sidebar.

## 8. Components

### 8.1 ProjectCard (feed)

```
┌──────────────────────────────────┐
│ [story circle]  lenn0109  1d   │ ← header: avatar + name + time
│──────────────────────────────────│
│                                  │
│         [Cover art]              │ ← aspect-[4/5], monogram initials
│         ★ Featured               │ ← if featured, top-left pill
│                                  │
│──────────────────────────────────│
│  ♡ 24   💬   →                  │ ← action bar: like + comment + share
│──────────────────────────────────│
│  LennMusic                       │ ← title (H3)
│  Next.js · PostgreSQL            │ ← tech pills
└──────────────────────────────────┘
```

- Width: full column width
- Border: `shadow-vc` (ring) on hover
- Hover: `shadow-vc-hover` + `translateY(-1px)`
- Image: `aspect-[4/5]` with CoverArt monogram (CSS-generated, no images needed)

### 8.2 CoverArt (project cover)

CSS-generated monogram cover — no image upload needed for MVP:

```tsx
<span style={{
  color: field.mark,         // per-project color from palette
  fontSize: 'clamp(120px, 28vw, 200px)',
  letterSpacing: '-0.05em',
  lineHeight: 1,
}}>
  {project.title[0].toUpperCase()}
</span>
```

Palette: 8 colors per `pickField()` — each project gets a consistent color based on title hash.

### 8.3 Filter pills

- Inactive: `bg-bg shadow-vc hover:shadow-vc-hover`
- Active: `bg-accent text-bg font-semibold shadow-vc`
- Height: 28px (h-7), padding: `px-3`
- Font: 12px, `tracking-tight`

### 8.4 StoryStrip

Circular avatars (60×60px) for each project. Gradient ring for unseen (`bg-gradient-to-br from-blue to-purple`), flat gray for seen. `rounded-full`.

### 8.5 BottomNav (mobile only)

Fixed bottom bar, 4 items: Home / Liked / Saved / You. Active = filled icon + 2px Apple Blue top bar.

### 8.6 ProfileCard (right sidebar desktop)

- `rounded-xl bg-bg-muted border border-border p-4`
- Avatar + name + email
- Stats: N projects, N total likes (tabular nums)
- "View profile" CTA button

### 8.7 NavLinks (left sidebar desktop)

Vertical nav: LennGram logo, Home/Liked/Saved/Profile, Admin (separated by hairline). `sticky top-20`.

## 9. Motion

| Token | Duration | Easing | Property |
|---|---|---|---|
| `motion-fast` | 100ms | `ease-out` | bg color, border |
| `motion-base` | 150ms | `ease-out` | transform, opacity, color |
| `motion-slow` | 320ms | `cubic-bezier(0.16, 1, 0.3, 1)` | page-level fade |

- No bounce, no spring, no parallax, no stagger
- `prefers-reduced-motion` respected via CSS media query

## 10. Anti-patterns (avoid in code review)

- ❌ `bg-gradient-*` — no gradients
- ❌ `shadow-apple-card` / `shadow-apple-hover` — use `shadow-vc` / `shadow-vc-hover`
- ❌ `shadow-lg shadow-xl` — use shadow-as-border tokens
- ❌ `font-bold` (700) — use `font-semibold` (600 max)
- ❌ `font-display` — use `font-sans` + `tracking-*` tokens
- ❌ `transition-all` — be specific
- ❌ Emoji in copy (`🚀`, `✨`) — none
- ❌ `rounded-2xl` or higher on cards — keep ≤18px
- ❌ `animate-pulse` on cards — distracting
- ❌ `bg-blue-*` or `text-blue-*` for non-accent elements
- ❌ Icon with fill — use stroke only (lucide stroke=1.75)

## 11. Reference design systems

Studied but not duplicated:
- **Apple** — color palette (`#f5f5f7`, `#0071e3`), hairline borders, display typography rhythm
- **Vercel** — shadow-as-border, Geist font, compressed tracking scale, 8px grid, 3-weight type system
- **Stripe Press** — magazine-like typography
- **shadcn/ui** — primitive components (handmade copies, not library)
