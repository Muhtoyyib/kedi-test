// Mini-markdown for FAQ answers (faq/faq-groups design): paragraphs, **bold**
// and [text](href) links — nothing else. Output is Inline runs, never HTML,
// so markup in content can never inject markup into the page.

import type {Inline} from "@/lib/catalog/types";

function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({text: text.slice(last, m.index)});
    if (m[1] !== undefined) out.push({text: m[1], bold: true});
    else out.push({text: m[2], href: m[3]});
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({text: text.slice(last)});
  return out.filter((i) => i.text !== "");
}

/** Paragraphs of inline runs — split on blank lines (or single newlines). */
export function parseMiniMarkdown(text: string): Inline[][] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(parseInline);
}
