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
| `motion-slow` | 320ms | `cubic-bezier(0.16, 1, 0.3, 1)` | page-level fade |

```ts
// tailwind.config.ts
theme: {
  extend: {
    transitionDuration: {
      'fast': '100ms',
      'base': '150ms',
      'slow': '320ms',
    },
    transitionTimingFunction: {
      'apple': 'cubic-bezier(0.16, 1, 0.3, 1)',
      'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  },
}
```

## Per-component motion

### ProjectCard hover

```css
/* default */
.card {
  background: var(--bg);
  box-shadow: none; /* or shadow-vc for cards with ring */
}
/* hover */
.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
  transition: box-shadow 150ms ease-out, transform 150ms ease-out;
}
```

### Like button click

```tsx
<Heart
  className={`
    w-5 h-5
    transition-transform duration-slow ease-out
    ${animating ? 'scale-125' : 'scale-100'}
    ${liked ? 'fill-accent text-accent' : 'fill-none text-text'}
  `}
  strokeWidth={1.75}
/>
```

Scale bump (1→1.25→1) over 320ms gives feedback without being playful.

### Filter pill selection

Instant state change — no animation. Binary selection, no need to highlight transition.

### Page-level fade

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

### Modal (admin confirmations)

Uses native `<dialog>` element with CSS fade:

```tsx
<dialog
  ref={dialogRef}
  className="bg-bg border border-border rounded-lg p-0 max-w-md w-full"
>
  {/* content */}
</dialog>

/* CSS */
dialog[open] {
  animation: fadeIn 150ms ease-out;
}
```

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
    scroll-behavior: auto !important;
  }
}
```

User OS setting wins. No exception.
