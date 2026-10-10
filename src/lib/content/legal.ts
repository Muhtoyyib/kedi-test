// Legal page access over the `legal` fumadocs collection. Returns the
// frontmatter plus the compiled MDX body component and generated TOC.

import type {MDXContent} from "mdx/types";
import type {TOCItemType} from "fumadocs-core/toc";
import {legal} from "fumadocs-mdx:collections/server";

export interface LegalPage {
  slug: string;
  title: string;
  description: string;
  updated: string;
  body: MDXContent;
  toc: TOCItemType[];
}

export interface LegalEntryLike {
  info: {path: string};
  title: string;
  description: string;
  updated: string;
  body: MDXContent;
  toc: TOCItemType[];
}

function entrySlug(entry: LegalEntryLike): string {
  return entry.info.path.replace(/\.mdx$/, "");
}

export function getLegalPage(slug: string, entries: readonly LegalEntryLike[] = legal): LegalPage | null {
  const entry = entries.find((e) => entrySlug(e) === slug);
  if (!entry) return null;
  return {slug, title: entry.title, description: entry.description, updated: entry.updated, body: entry.body, toc: entry.toc};
}

/** Slugs of every legal page — used by routes' static params later. */
export function listLegalSlugs(entries: readonly LegalEntryLike[] = legal): string[] {
  return entries.map(entrySlug);
}
