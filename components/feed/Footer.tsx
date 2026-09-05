export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between text-sm text-text-muted">
        <p>© lenn0109</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Lenn0109"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-text"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Lenn0109/LennGram"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-text"
          >
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
