# LennGram — Animation Spec

> Motion is **subtle**. Calmer than PayBox, calmer than Instagram.
> Goal: feel responsive, not playful. ≤150ms for everything.

## Principles

1. **No bounce** — `ease-out` only, no spring physics
2. **No stagger** — elements appear together, not in waves
3. **No parallax** — scroll = linear
4. **No infinite loops** — animations end, then stop
5. **Reduced motion respected** — `prefers-reduced-motion: reduce` disables all

## Timing tokens

| Token | Duration | Easing | Property |
|---|---|---|---|
| `motion-fast` | 100ms | `ease-out` | bg color, border |
| `motion-base` | 150ms | `ease-out` | transform, opacity, color |
| `motion-slow` | 200ms | `ease-out` | scale (like button) |

## Tailwind config

```ts
// tailwind.config.ts
theme: {
  extend: {
    transitionDuration: {
      'fast': '100ms',
      'base': '150ms',
      'slow': '200ms',
    },
    transitionTimingFunction: {
      'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  },
}
```

Usage: `transition-colors duration-fast ease-out`, `transition-transform duration-base ease-out`.

## Per-component motion

### Project card hover (feed)

```css
/* default */
.card {
  background: var(--bg);
  border: 1px solid transparent;
}
.card img {
  transform: scale(1);
  transition: transform 150ms ease-out;
}

/* hover */
.card:hover {
  background: var(--bg-muted);
  border-color: var(--border);
}
.card:hover img {
  transform: scale(1.02);
}
```

**Rationale**: subtle image zoom + bg change signals interactivity without being noisy.

### Like button click

```tsx
'use client'
import { useState } from 'react'
import { Heart } from 'lucide-react'

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [animating, setAnimating] = useState(false)

  async function handleLike() {
    setAnimating(true)
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
    setTimeout(() => setAnimating(false), 200)
    // POST /api/like
  }

  return (
    <button
      onClick={handleLike}
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-sm
        border border-gray-200
        hover:bg-gray-50
        transition-colors duration-fast ease-out
      `}
    >
      <Heart
        className={`
          w-4 h-4
          transition-transform duration-slow ease-out
          ${animating ? 'scale-125' : 'scale-100'}
          ${liked ? 'fill-current' : 'fill-none'}
        `}
        strokeWidth={1.5}
      />
      <span className="text-sm tabular-nums">{count}</span>
    </button>
  )
}
```

**Rationale**: scale bump gives feedback but is short (200ms). Optimistic UI updates state immediately; rollback on API error.

### Modal open/close (admin confirmations)

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function Modal({ open, onClose, children }: ...) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="
        backdrop:bg-black/50
        bg-white
        border border-gray-200
        rounded
        p-0
        max-w-md w-full
        open:animate-fadeIn
      "
    >
      {children}
    </dialog>
  )
}
```

```css
/* globals.css */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn { animation: fadeIn 150ms ease-out; }
```

**Rationale**: native `<dialog>` element handles focus trap + ESC. CSS animation on `open` state.

### Filter chip selection (feed)

No animation — instant state change. Selection is binary, no need to highlight transition.

```tsx
<button
  className={`
    px-3 py-1 rounded-sm
    text-xs font-mono uppercase tracking-wider
    border
    ${selected
      ? 'bg-gray-950 text-white border-gray-950'
      : 'bg-white text-gray-950 border-gray-200 hover:bg-gray-50'
    }
    transition-colors duration-fast ease-out
  `}
>
  {tag}
</button>
```

### Image upload preview (admin form)

```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'

export function CoverUpload({ value, onChange }: ...) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)

  async function handleFile(file: File) {
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const { url } = await res.json()
    setPreview(url)
    onChange(url)
    setUploading(false)
  }

  return (
    <div className="border border-dashed border-gray-300 rounded p-6 text-center">
      {preview ? (
        <div className="relative aspect-video">
          <Image src={preview} alt="Cover preview" fill className="object-cover" />
          <button
            onClick={() => { setPreview(null); onChange(null) }}
            className="absolute top-2 right-2 px-2 py-1 bg-white border border-gray-200 rounded-sm text-xs"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading…' : 'Drop image or click to upload'}
          </span>
        </label>
      )}
    </div>
  )
}
```

**Rationale**: simple preview + remove. No crop UI for MVP (post-processing can be done in image editor before upload).

## What we DON'T do

- ❌ Page transition animations (RSC handles navigation instantly)
- ❌ Loading spinners with continuous rotation (use skeleton instead)
- ❌ Toast notifications that slide in (instant appear + auto-dismiss)
- ❌ Hover effects on text (no color shift on `<a>`)
- ❌ Cursor effects (no custom cursor)
- ❌ Scroll-triggered animations (no IntersectionObserver reveals)
- ❌ Marquee, ticker, or auto-scrolling content
- ❌ Sound effects
- ❌ Parallax scrolling
- ❌ Spring/bounce easing
- ❌ Animated SVG illustrations
- ❌ Video backgrounds

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

User OS setting wins. No exception.
