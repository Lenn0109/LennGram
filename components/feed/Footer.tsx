import { Github, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 hidden sm:block">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-text-muted">
        <p>© 2026 lenn0109</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Lenn0109"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-text inline-flex items-center gap-1.5"
          >
            <Github className="h-3.5 w-3.5" strokeWidth={1.5} />
            GitHub
          </a>
          <a
            href="https://github.com/Lenn0109/LennGram"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-text inline-flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
