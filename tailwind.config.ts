import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-muted': 'var(--bg-muted)',
        'bg-section': 'var(--bg-section)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-hover': 'var(--bg-hover)',
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-muted': 'var(--text-muted)',
        'text-subtle': 'var(--text-subtle)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-soft': 'var(--accent-soft)',
      },
      transitionDuration: {
        fast: '100ms',
        base: '150ms',
        slow: '320ms',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '18px',
        pill: '980px',
        full: '9999px',
      },
      letterSpacing: {
        tightest: '-0.022em',
        tighter: '-0.015em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.06em',
      },
      maxWidth: {
        prose: '65ch',
        feed: '470px',
        apple: '980px',
      },
      boxShadow: {
        'apple-card': '0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'apple-hover': '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'apple-soft': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};

export default config;
