# LennGram — Design System

> Monochrome light theme. No accent color, no shadow, no gradient.
> Handmade, no AI slop.

## 1. Visual theme

| Property | Value |
|---|---|
| Theme | Light only (no dark mode toggle) |
| Tone | Calm, editorial, indie-dev |
| Density | Comfortable (4px base grid) |
| Accent | None — pure monochrome |
| Motion | Subtle (≤150ms ease-out) |
| Borders | 1px solid #e5e5e5 (gray-200) |
| Shadows | None — borders only |
| Icons | `lucide-react` (stroke 1.5, color currentColor) |
| Emoji | None in UI |
| Imagery | Real project screenshots, no stock photos |

## 2. Color palette

Pure monochrome, Tailwind defaults + 2 custom shades:

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `bg` | `#ffffff` | `white` | Page background, card background |
| `bg-muted` | `#fafafa` | `gray-50` | Subtle section background, hover bg |
| `bg-hover` | `#f5f5f5` | `gray-100` | Interactive hover (cards, buttons) |
| `text` | `#0a0a0a` | `gray-950` | Headings, body |
| `text-muted` | `#525252` | `gray-600` | Captions, secondary info |
| `text-subtle` | `#a3a3a3` | `gray-400` | Disabled, placeholder |
| `border` | `#e5e5e5` | `gray-200` | Card border, divider |
| `border-strong` | `#d4d4d4` | `gray-300` | Input border, focus ring fallback |

**No** accent color. **No** red for errors (use bold + icon). **No** blue for links (use underline + currentColor).

## 3. Typography

| Use | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| Display (page title) | Inter | 32px / `text-3xl` | 700 | -0.02em |
| H2 (section) | Inter | 24px / `text-2xl` | 600 | -0.01em |
| H3 (card title) | Inter | 18px / `text-lg` | 600 | normal |
| Body | Inter | 16px / `text-base` | 400 | normal |
| Caption | Inter | 14px / `text-sm` | 400 | normal |
| **Mono** (tech tags, code) | JetBrains Mono | 12px / `text-xs` | 500 | 0.05em, uppercase for tags |
| Button | Inter | 14px / `text-sm` | 500 | normal |

Fonts loaded via `next/font/google` (no FOUT, no extra request).

```ts
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

## 4. Spacing scale

4px base grid, used as Tailwind defaults (`p-2` = 8px, `p-4` = 16px, etc.).

| Token | px | Use |
|---|---|---|
| `space-1` | 4 | Tight inline gap (icon + label) |
| `space-2` | 8 | Small padding, tag gap |
| `space-3` | 12 | Card internal padding (mobile) |
| `space-4` | 16 | Card internal padding (desktop), form field gap |
| `space-6` | 24 | Section gap (between feed cards vertically) |
| `space-8` | 32 | Page section padding |
| `space-12` | 48 | Major section break |
| `space-16` | 64 | Above-the-fold hero padding |

## 5. Border radius

Sharp by default, 2px for inputs/buttons, 4px for cards.

| Token | Value | Use |
|---|---|---|
| `rounded-none` | 0 | Tag chips, full-width banners |
| `rounded-sm` | 2px | Buttons, inputs |
| `rounded` | 4px | Cards, modals |
| `rounded-full` | 9999px | Avatar, pill buttons |

## 6. Components

### 6.1 Project card (public feed)

```
┌─────────────────────────────────┐
│                                 │
│         [Cover image]           │  ← aspect ratio varies (masonry)
│                                 │
├─────────────────────────────────┤
│ Project Title                   │  ← h3, 18px, semibold
│ #tag1 #tag2 #tag3               │  ← mono, uppercase, gray-600
│                                 │
│ ❤ 24                            │  ← heart icon + count, gray-950
└─────────────────────────────────┘
```

- **Width**: column width (1/3 desktop, 1/2 tablet, full mobile)
- **Image**: rounded-none (sharp corners, no rounding inside masonry)
- **Border**: 1px solid `border`, only visible on hover
- **Hover**: `bg-muted` background on whole card, image scale 1.02 (150ms)
- **Tags**: max 4 visible, +N if more
- **Like count**: bottom-right of metadata row

### 6.2 Tech tag chip

```
┌────────┐
│ NEXTJS │   ← mono, 12px, uppercase, 0.05em tracking
└────────┘
```

- `bg-muted` background
- `text` (black) text
- `rounded-none` (sharp)
- Padding: `px-2 py-1`
- No border

### 6.3 Button

**Primary** (CTA, save):
- `bg` (white) background
- `border` (1px gray-200)
- `text` (black)
- Hover: `bg-hover` (gray-100)
- Padding: `px-4 py-2`, `rounded-sm`

**Ghost** (cancel, secondary):
- `bg` transparent
- No border
- `text` (black)
- Hover: `bg-hover`

**Destructive** (delete):
- Same as primary, but `text` is still black — we don't use red
- Confirmation modal required for any destructive action

### 6.4 Input

- `bg` (white)
- `border` (1px gray-300)
- `text` (black) text
- Placeholder: `text-subtle` (gray-400)
- Focus: `border-strong` (gray-500) + 2px ring offset
- Padding: `px-3 py-2`, `rounded-sm`
- Height: 40px (single line), auto (textarea)

### 6.5 Modal (admin)

- Centered, max-width 500px
- White background, 1px border
- `rounded` (4px)
- Backdrop: 50% black
- Animation: fade in 150ms ease-out
- ESC to close
- Focus trap inside

## 7. Layout

### 7.1 Feed (`/`)

```
[Top nav: logo · filter chips · (admin link if cookie)]

  ┌──────┐ ┌──────┐ ┌──────┐
  │ card │ │ card │ │ card │   ← 3 col desktop
  └──────┘ └──────┘ └──────┘
  ┌──────┐ ┌──────┐ ┌──────┐
  │ card │ │ card │ │ card │   ← masonry, varying heights
  └──────┘ └──────┘ └──────┘

[Footer: © lenn0109 · GitHub · LinkedIn]
```

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Masonry via CSS columns (`columns-1 sm:columns-2 lg:columns-3 gap-4`)
- Each card must be `break-inside-avoid`

### 7.2 Project detail (`/p/[slug]`)

```
[Top nav]

  ┌────────────┐  Project Title
  │            │  ──────────────
  │   Cover    │  Description markdown
  │   image    │  rendered here
  │   (sticky) │
  │            │  #tag1 #tag2 #tag3
  │            │  [Visit repo] [View demo] ❤ 24
  └────────────┘

[Footer]
```

- Desktop: 2-col, cover sticky left (col-span-1)
- Mobile: 1-col, cover full-width on top

### 7.3 Admin (`/admin`)

```
[Top bar: lenngram / admin · Logout]

  ┌────────────────────────────────────┐
  │ Projects              [+ New]      │
  │ ─────────────────────────────────  │
  │ ▢ [thumb] Title · status · stats   │
  │ ▢ [thumb] Title · status · stats   │
  │ ▢ [thumb] Title · status · stats   │
  │ [Load more]                        │
  └────────────────────────────────────┘
```

- Table layout (not card grid) — denser for admin
- Each row: 60px cover thumb, title, status badge, like count, updated_at, edit/delete actions

### 7.4 Admin form (`/admin/new`, `/admin/[id]`)

- 2-col form: labels left (1/3), inputs right (2/3)
- Cover upload: drop zone, preview, remove
- Tech tags: tag input (comma → enter)
- Action bar: [Cancel] [Save draft] [Publish] (right-aligned)
- Sticky action bar at bottom (always visible on long form)

## 8. Motion

| Interaction | Duration | Easing | Property |
|---|---|---|---|
| Card hover | 150ms | ease-out | bg color, image scale |
| Button hover | 100ms | ease-out | bg color |
| Link hover | 0ms | — | underline appears instantly |
| Modal open | 150ms | ease-out | opacity + scale 0.95→1 |
| Modal close | 100ms | ease-in | opacity + scale 1→0.95 |
| Like button | 200ms | ease-out | scale 1→1.2→1 (heart) |
| Page transition | 0ms | — | None (RSC, instant) |

**No** spring physics, no bounce, no staggered reveals, no parallax. Calm.

## 9. Anti-patterns (avoid in code review)

- ❌ `shadow-md`, `shadow-lg` — no shadow allowed
- ❌ `bg-blue-500` or any non-gray color — monochrome only
- ❌ `text-white` on `bg-gray-50` — keep contrast within grayscale
- ❌ `transition-all` — be specific (`transition-colors`, `transition-transform`)
- ❌ Emoji in copy (`🚀`, `✨`, `💡`) — none
- ❌ `rounded-2xl` or higher — keep ≤4px
- ❌ `animate-pulse` on cards — distracting
- ❌ `bg-gradient-*` — no gradients
- ❌ Icon with fill — use stroke only (lucide stroke=1.5)

## 10. Reference (for design language, not to copy)

Studied but not duplicated:
- **PayBox** (`Lenn0109/Site01_PayOx`) — design system extraction methodology
- **Linear** — density, monochrome, mono tags
- **Vercel** — clean editorial, restrained color
- **Stripe Press** — magazine-like typography
- **Geist UI** — minimal sans + mono pairing
- **shadcn/ui** — primitive components (handmade copies, not library)
