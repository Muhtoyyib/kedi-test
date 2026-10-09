// Google Doc → ArticleBlock conversion (design §7). `convertDocNodes` is pure —
// it works on DocNode[] extracted from a Document, so the whole rule set
// (doctor callout, video lines, banned words, alt warnings, link safety) is
// unit-tested in Node. The DocumentApp-facing part is thin.

import {parseVideoUrl, type VideoLink} from "./content.ts";
import {bannedWordsIn, slugify} from "./validate.ts";

export interface TextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string | null;
}

export type DocNode =
  | {type: "para"; heading: HeadingKind; runs: TextRun[]; images: {alt: string}[]}
  | {type: "li"; ordered: boolean; runs: TextRun[]}
  | {type: "unsupported"; what: string};

export type HeadingKind = "title" | "h1" | "h2" | "h3" | "sub" | "normal";

export interface Inline {
  text: string;
  bold?: true;
  italic?: true;
  href?: string;
}

export type ArticleBlock =
  | {type: "h2" | "h3"; id: string; text: string}
  | {type: "p"; inlines: Inline[]}
  | {type: "ul" | "ol"; items: Inline[][]}
  | {type: "image"; ref: {doc: string; n: number}; alt: string}
  | {type: "video"; video: VideoLink}
  | {type: "doctor-callout"; blocks: ArticleBlock[]};

export interface DocConversion {
  title: string | null;
  blocks: ArticleBlock[];
  readingMinutes: number;
  warnings: string[];
  errors: string[];
}

const DOCTOR_HEADING = /^\s*when to see a doctor\s*$/i;
const SAFE_LINK = /^(https?:\/\/|mailto:|\/)/;

/** Inlines from text runs: trims, merges adjacent runs with equal style, drops unsafe links. */
function toInlines(runs: TextRun[]): Inline[] {
  const out: Inline[] = [];
  for (const run of runs) {
    const text = run.text.replace(/\n+$/, "");
    if (!text) continue;
    const inline: Inline = {text};
    if (run.bold) inline.bold = true;
    if (run.italic) inline.italic = true;
    if (run.href && SAFE_LINK.test(run.href)) inline.href = run.href;
    const prev = out[out.length - 1];
    if (prev && prev.bold === inline.bold && prev.italic === inline.italic && prev.href === inline.href) {
      prev.text += inline.text;
    } else {
      out.push(inline);
    }
  }
  return out;
}

function inlineText(inlines: Inline[]): string {
  return inlines.map((i) => i.text).join("");
}

export function convertDocNodes(docId: string, articleId: string, nodes: DocNode[]): DocConversion {
  const warnings: string[] = [];
  const errors: string[] = [];
  const blocks: ArticleBlock[] = [];
  let title: string | null = null;
  let callout: ArticleBlock[] | null = null;
  let imageN = 0;
  let wordCount = 0;

  const push = (block: ArticleBlock, nodeIndex: number) => {
    const text = blockText(block);
    for (const word of bannedWordsIn(text)) {
      if (callout === null) {
        errors.push(
          `${articleId}, paragraph ${nodeIndex + 1}: '${word}' — health claims aren't allowed. Rephrase, or move it under a 'When to see a doctor' heading if it's about seeing a doctor.`
        );
      }
    }
    wordCount += text.split(/\s+/).filter(Boolean).length;
    (callout ?? blocks).push(block);
  };

  let list: {ordered: boolean; items: Inline[][]} | null = null;
  const flushList = (nodeIndex: number) => {
    if (list) push({type: list.ordered ? "ol" : "ul", items: list.items}, nodeIndex);
    list = null;
  };

  nodes.forEach((node, i) => {
    if (node.type === "unsupported") {
      flushList(i);
      warnings.push(
        node.what === "TABLE"
          ? `${articleId}: tables aren't shown on the website — move the content into paragraphs or a list`
          : `${articleId}: ${node.what.toLowerCase()} isn't shown on the website`
      );
      return;
    }
    if (node.type === "li") {
      const inlines = toInlines(node.runs);
      if (!inlines.length) return;
      if (!list || list.ordered !== node.ordered) flushList(i);
      (list ??= {ordered: node.ordered, items: []}).items.push(inlines);
      return;
    }
    flushList(i);
    handlePara(node, i);
  });
  flushList(nodes.length);

  function handlePara(node: Extract<DocNode, {type: "para"}>, i: number) {
    if (node.heading === "title" || node.heading === "h1") {
      if (!title) title = inlineText(toInlines(node.runs)).trim() || null;
      return;
    }
    if (node.heading === "h2") {
      const text = inlineText(toInlines(node.runs)).trim();
      if (callout) {
        blocks.push({type: "doctor-callout", blocks: callout});
        callout = null;
      }
      if (DOCTOR_HEADING.test(text)) {
        callout = [];
        return;
      }
      push({type: "h2", id: slugify(text), text}, i);
      return;
    }
    if (node.heading === "h3" || node.heading === "sub") {
      const text = inlineText(toInlines(node.runs)).trim();
      push({type: "h3", id: slugify(text), text}, i);
      return;
    }
    const text = inlineText(toInlines(node.runs)).trim();
    for (const img of node.images) {
      imageN += 1;
      if (!img.alt.trim()) warnings.push(`Add alt text to image ${imageN} in ${articleId}`);
      push({type: "image", ref: {doc: docId, n: imageN - 1}, alt: img.alt.trim()}, i);
    }
    if (!text) return;
    const video = parseVideoUrl(text);
    if (video && text === video.url) {
      push({type: "video", video}, i);
      return;
    }
    push({type: "p", inlines: toInlines(node.runs)}, i);
  }

  if (callout) blocks.push({type: "doctor-callout", blocks: callout});
  return {title, blocks, readingMinutes: Math.max(1, Math.ceil(wordCount / 200)), warnings, errors};
}

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "h2":
    case "h3":
      return block.text;
    case "p":
      return inlineText(block.inlines);
    case "ul":
    case "ol":
      return block.items.map(inlineText).join(" ");
    default:
      return "";
  }
}

// ── GAS-facing extraction ────────────────────────────────────────────────────

const HEADING_MAP: Record<string, HeadingKind> = {
  TITLE: "title",
  HEADING1: "h1",
  HEADING2: "h2",
  HEADING3: "h3",
  HEADING4: "h3",
  HEADING5: "h3",
  HEADING6: "h3",
  SUBTITLE: "sub",
};

export function extractDocNodes(doc: GoogleAppsScript.Document.Document): DocNode[] {
  const body = doc.getBody();
  const nodes: DocNode[] = [];
  for (let i = 0; i < body.getNumChildren(); i++) {
    const el = body.getChild(i);
    if (el.getType() === DocumentApp.ElementType.PARAGRAPH) nodes.push(paraNode(el.asParagraph()));
    else if (el.getType() === DocumentApp.ElementType.LIST_ITEM) nodes.push(listNode(el.asListItem()));
    else nodes.push({type: "unsupported", what: String(el.getType())});
  }
  return nodes;
}

function paraNode(para: GoogleAppsScript.Document.Paragraph): DocNode {
  const images: {alt: string}[] = [];
  for (let i = 0; i < para.getNumChildren(); i++) {
    const child = para.getChild(i);
    if (child.getType() === DocumentApp.ElementType.INLINE_IMAGE) {
      const img = child.asInlineImage();
      images.push({alt: img.getAltDescription() || img.getAltTitle() || ""});
    }
  }
  return {type: "para", heading: HEADING_MAP[String(para.getHeading())] ?? "normal", runs: textRuns(para.editAsText()), images};
}

function listNode(item: GoogleAppsScript.Document.ListItem): DocNode {
  const glyph = String(item.getGlyphType());
  return {type: "li", ordered: /NUMBER|ALPHA|ROMAN/i.test(glyph), runs: textRuns(item.editAsText())};
}

/** Style runs via getTextAttributeIndices — one run per formatting change. */
function textRuns(text: GoogleAppsScript.Document.Text): TextRun[] {
  const s = text.getText();
  const runs: TextRun[] = [];
  const indices = text.getTextAttributeIndices();
  const points = [...new Set([0, ...indices, s.length])].sort((a, b) => a - b);
  for (let i = 0; i + 1 < points.length; i++) {
    const [a, b] = [points[i], points[i + 1]];
    runs.push({text: s.slice(a, b), bold: !!text.isBold(a), italic: !!text.isItalic(a), href: text.getLinkUrl(a)});
  }
  return runs;
}

/** Cached conversion keyed by Doc content so repeat catalog calls stay fast. */
export function convertArticleDoc(docId: string, articleId: string): DocConversion {
  const cache = CacheService.getScriptCache();
  const doc = DocumentApp.openById(docId);
  const key = `doc:${docId}:${DriveApp.getFileById(docId).getLastUpdated().getTime()}`;
  const cached = cache.get(key);
  if (cached) return JSON.parse(cached) as DocConversion;
  const result = convertDocNodes(docId, articleId, extractDocNodes(doc));
  cache.put(key, JSON.stringify(result), 6 * 3600);
  return result;
}

/** ?action=doc_image — the n-th INLINE_IMAGE of a Doc as a blob (≤8MB guard upstream). */
export function docImageBlob(docId: string, n: number): GoogleAppsScript.Base.Blob | null {
  const body = DocumentApp.openById(docId).getBody();
  let seen = 0;
  for (let i = 0; i < body.getNumChildren(); i++) {
    const el = body.getChild(i);
    if (el.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    const para = el.asParagraph();
    for (let c = 0; c < para.getNumChildren(); c++) {
      const child = para.getChild(c);
      if (child.getType() === DocumentApp.ElementType.INLINE_IMAGE) {
        if (seen === n) return child.asInlineImage().getBlob();
        seen += 1;
      }
    }
  }
  return null;
}

export function docIdFromUrl(docUrl: string): string | null {
  return docUrl.match(/\/d\/([a-zA-Z0-9_-]{10,})/)?.[1] ?? null;
}
