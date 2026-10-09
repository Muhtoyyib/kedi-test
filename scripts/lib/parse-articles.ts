// Articles section parser: validates the Doc-converted block list — headings,
// inlines, lists, image refs (doc/n), video blocks and the doctor-callout —
// and derives the TOC from h2 blocks.

import {isRecord, type UntrustedRecord, type UntrustedValue} from "../../src/lib/untrusted.ts";
import {TOPICS, type Inline, type Topic} from "../../src/lib/catalog/types.ts";
import type {ParsedArticle, WireBlock} from "./parsed-types.ts";
import {at, type At, type Collector, eachRow, isIsoDate, optNum, parseVideoRef, str} from "./parse-utils.ts";
import {slugify} from "./slugify.ts";

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/;

interface BlockCtx {
  c: Collector;
  seenHeading: Set<string>;
}

function parseInlines(raw: UntrustedValue): Inline[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is UntrustedRecord => isRecord(r))
    .map((r) => {
      const inline: Inline = {text: typeof r.text === "string" ? r.text : ""};
      if (r.bold === true) inline.bold = true;
      if (r.italic === true) inline.italic = true;
      const href = str(r, "href");
      if (href && SAFE_HREF.test(href)) inline.href = href;
      return inline;
    })
    .filter((r) => r.text);
}

/** Unique heading id within an article: "-2", "-3" … on collision. */
function uniqueId(base: string, seen: Set<string>): string {
  let id = base;
  let n = 2;
  while (seen.has(id)) id = `${base}-${n++}`;
  seen.add(id);
  return id;
}

function parseImageBlock(b: UntrustedRecord, loc: At, c: Collector): WireBlock | null {
  const ref = isRecord(b.ref) ? {doc: str(b.ref, "doc"), n: optNum(b.ref, "n")} : null;
  if (!ref || ref.n === null) {
    c.error(loc, "an inline image block is missing its doc/n ref");
    return null;
  }
  return {type: "image", ref: {doc: ref.doc, n: ref.n}, alt: str(b, "alt")};
}

function parseHeading(b: UntrustedRecord, type: "h2" | "h3", seen: Set<string>): WireBlock {
  return {type, id: uniqueId(str(b, "id") || slugify(str(b, "text")), seen), text: str(b, "text")};
}

function parseCallout(b: UntrustedRecord, loc: At, ctx: BlockCtx): WireBlock | null {
  const inner = parseBlocks(b.blocks, loc, ctx);
  return inner === null ? null : {type: "doctor-callout", blocks: inner};
}

function parseVideoBlock(b: UntrustedRecord, loc: At, c: Collector): WireBlock | null {
  const video = parseVideoRef(b.video);
  if (!video) {
    c.error(loc, "a video block isn't a YouTube or TikTok link");
    return null;
  }
  return {type: "video", video};
}

function parseBlock(b: UntrustedRecord, loc: At, ctx: BlockCtx): WireBlock | null {
  const t = b.type;
  if (t === "h2" || t === "h3") return parseHeading(b, t, ctx.seenHeading);
  if (t === "p") return {type: "p", inlines: parseInlines(b.inlines)};
  if (t === "ul" || t === "ol") return {type: t, items: Array.isArray(b.items) ? b.items.map((it) => parseInlines(it)) : []};
  if (t === "image") return parseImageBlock(b, loc, ctx.c);
  if (t === "video") return parseVideoBlock(b, loc, ctx.c);
  if (t === "doctor-callout") return parseCallout(b, loc, ctx);
  ctx.c.error(loc, `unrecognised block type "${String(t)}"`);
  return null;
}

function parseBlocks(raw: UntrustedValue, loc: At, ctx: BlockCtx): WireBlock[] | null {
  if (!Array.isArray(raw)) {
    ctx.c.error(loc, "article body is missing — the Doc conversion didn't produce blocks");
    return null;
  }
  const blocks: WireBlock[] = [];
  for (const b of raw) {
    if (!isRecord(b) || typeof b.type !== "string") {
      ctx.c.error(loc, "article body has an unrecognised block");
      return null;
    }
    const block = parseBlock(b, loc, ctx);
    if (block === null) return null;
    blocks.push(block);
  }
  return blocks;
}

function articleProblem(rec: UntrustedRecord, topic: string, categorySlugs: Set<string>): string | null {
  if (
    !TOPICS.includes(topic as Topic) ||
    !str(rec, "description") ||
    !str(rec, "coverImageId") ||
    !str(rec, "coverAlt") ||
    !isIsoDate(str(rec, "date"))
  ) {
    return "topic, description, cover image + alt and a valid date are required";
  }
  const rel = str(rec, "relatedCategory");
  if (rel && !categorySlugs.has(rel)) return `related_category "${rel}" isn't in Categories`;
  return null;
}

interface ArticleCtx {
  c: Collector;
  categorySlugs: Set<string>;
  seenId: Set<string>;
  seenSlug: Set<string>;
}

/** Dedupe + validate an article row; returns {id, slug} when usable. */
function articleCore(rec: UntrustedRecord, loc: At, ctx: ArticleCtx): {id: string; slug: string} | null {
  const slug = str(rec, "slug") || slugify(str(rec, "title"));
  if (!loc.id || !str(rec, "title")) {
    ctx.c.error(loc, "article needs an id and a title");
    return null;
  }
  if (ctx.seenId.has(loc.id) || ctx.seenSlug.has(slug)) {
    ctx.c.error(loc, ctx.seenId.has(loc.id) ? `duplicate article_id "${loc.id}"` : `duplicate slug "${slug}"`);
    return null;
  }
  ctx.seenId.add(loc.id);
  ctx.seenSlug.add(slug);
  const problem = articleProblem(rec, str(rec, "topic"), ctx.categorySlugs);
  if (problem) {
    ctx.c.error(loc, problem);
    return null;
  }
  return {id: loc.id, slug};
}

export function parseArticles(rows: UntrustedValue, c: Collector, categorySlugs: Set<string>): ParsedArticle[] {
  const out: ParsedArticle[] = [];
  const ctx: ArticleCtx = {c, categorySlugs, seenId: new Set(), seenSlug: new Set()};
  eachRow(rows, (rec, i) => {
    const loc = at("Articles", i, str(rec, "id") || str(rec, "article_id"));
    const core = articleCore(rec, loc, ctx);
    if (!core) return;
    const body = parseBlocks(rec.body, loc, {c, seenHeading: new Set()});
    if (body === null) return;
    out.push(articleItem(rec, {...core, body}));
  });
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function articleItem(rec: UntrustedRecord, core: {id: string; slug: string; body: WireBlock[]}): ParsedArticle {
  return {
    id: core.id,
    slug: core.slug,
    title: str(rec, "title"),
    description: str(rec, "description"),
    topic: str(rec, "topic") as Topic,
    date: str(rec, "date"),
    coverImageId: str(rec, "coverImageId"),
    coverAlt: str(rec, "coverAlt"),
    relatedCategory: str(rec, "relatedCategory") || null,
    readingMinutes: Math.max(1, optNum(rec, "readingMinutes") ?? 1),
    body: core.body,
    toc: core.body.flatMap((b) => (b.type === "h2" ? [{id: b.id, text: b.text}] : [])),
  };
}
