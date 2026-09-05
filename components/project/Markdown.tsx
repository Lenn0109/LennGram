import { renderMarkdown } from '@/lib/markdown';

interface MarkdownProps {
  source: string;
}

export function Markdown({ source }: MarkdownProps) {
  const html = renderMarkdown(source);
  return (
    <div
      className="prose-like max-w-prose text-base leading-relaxed"
      // The HTML comes from server-rendered markdown authored by the admin.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
