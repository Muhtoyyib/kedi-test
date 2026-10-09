// Build-time re-check of client-written text (articles, stories, highlights)
// against the banned health-claim word list. Mirrors
// apps-script/src/validate.ts — keep the two lists in sync. The
// doctor-callout section of an article is exempt: it legitimately names
// conditions when telling readers to see a doctor.

import type {Inline} from "../../src/lib/catalog/types.ts";
import type {ParsedCatalog, WireBlock} from "./parsed-types.ts";

// Banned health-claim words (docs/copy-and-compliance.md §2): claim verbs plus
// disease/condition names. Whole-word, case-insensitive.
const CLAIM_WORDS = [
  "cure",
  "cures",
  "cured",
  "curing",
  "treat",
  "treats",
  "treated",
  "treating",
  "treatment",
  "heal",
  "heals",
  "healed",
  "healing",
  "prevent",
  "prevents",
  "prevented",
  "preventing",
  "prevention",
  "reverse",
  "reverses",
  "reversed",
  "reversing",
  "eliminate",
  "eliminates",
  "fight",
  "fights",
  "miracle",
  "remedy",
];
const DISEASE_WORDS = [
  "diabetes",
  "hypertension",
  "ulcer",
  "ulcers",
  "infertility",
  "cancer",
  "infection",
  "arthritis",
  "hiv",
  "aids",
  "stroke",
  "asthma",
  "fibroid",
  "fibroids",
  "malaria",
  "typhoid",
];
const BANNED = new RegExp(`\\b(${[...CLAIM_WORDS, ...DISEASE_WORDS].join("|")})\\b`, "gi");

/** Banned words found in `text` — unique, lowercase. */
export function bannedWordsIn(text: string): string[] {
  return [...new Set((text.match(BANNED) ?? []).map((w) => w.toLowerCase()))];
}

/** Plain text of an inline run. */
function inlineText(inlines: Inline[]): string {
  return inlines.map((i) => i.text).join(" ");
}

/**
 * Article body text minus doctor-callout blocks (which may name conditions).
 * `blocks` is WireBlock[] pre-resolution or ArticleBlock[] post — both carry
 * the same text-bearing shapes, so we read text fields generically.
 */
function blockText(blocks: WireBlock[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === "doctor-callout") continue;
    if (b.type === "h2" || b.type === "h3") out.push(b.text);
    else if (b.type === "p") out.push(inlineText(b.inlines));
    else if (b.type === "ul" || b.type === "ol") out.push(...b.items.map(inlineText));
    else if (b.type === "image") out.push(b.alt);
  }
  return out;
}

function collect(where: string, texts: string[], errors: string[]): void {
  for (const text of texts) {
    for (const word of bannedWordsIn(text)) errors.push(`${where}: banned word "${word}"`);
  }
}

/**
 * Compliance re-check for the build. Returns a list of violations naming the
 * item and the word; the caller fails the build when the list is non-empty.
 */
export function checkCompliance(catalog: ParsedCatalog): string[] {
  const errors: string[] = [];
  for (const a of catalog.articles) {
    collect(`Articles (${a.id})`, [a.title, a.description, ...blockText(a.body)], errors);
  }
  for (const s of catalog.stories) {
    collect(`Stories (${s.id})`, [s.quote, ...s.fullStory], errors);
  }
  for (const h of catalog.highlights) {
    if (h.comment) collect(`Highlights (${h.id})`, [h.comment.text], errors);
  }
  return errors;
}
