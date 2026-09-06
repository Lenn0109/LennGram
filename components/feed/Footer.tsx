import Link from 'next/link';

const links: Array<{ label: string; href: string; external?: boolean }> = [
  { label: 'About', href: '/you' },
  { label: 'GitHub', href: 'https://github.com/Lenn0109/LennGram', external: true },
  { label: 'Source', href: 'https://github.com/Lenn0109/LennGram', external: true },
];

export function Footer() {
  return (
    <footer className="hidden sm:block bg-bg-muted border-t border-border">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-10">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-text-muted tracking-tight">
          {links.map((l) => (
            <li key={l.label}>
              {l.external ? (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text"
                >
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className="hover:text-text">
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] text-text-muted tracking-tight">
          Built by <a href="https://github.com/Lenn0109" target="_blank" rel="noopener noreferrer" className="hover:text-text">lenn0109</a> · © 2026
        </p>
      </div>
    </footer>
  );
}
