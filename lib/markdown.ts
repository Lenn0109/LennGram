import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

// Very small allowlist of inline tokens we want to strip if needed.
// For MVP we trust the project author (admin only).
export function renderMarkdown(input: string): string {
  return marked.parse(input, { async: false }) as string;
}
