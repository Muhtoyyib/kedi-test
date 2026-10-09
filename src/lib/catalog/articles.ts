// Article helpers — newest first, topic filtering, related + topic counts.

import {catalog} from "./data.ts";
import type {Article, Catalog, Topic} from "./types.ts";

const newestFirst = (a: Article, b: Article) => (a.date < b.date ? 1 : -1);

export function getArticles(filter: {topic?: Topic} = {}, cat: Catalog = catalog): Article[] {
  return [...cat.articles].filter((a) => !filter.topic || a.topic === filter.topic).sort(newestFirst);
}

export function getArticle(slug: string, cat: Catalog = catalog): Article | undefined {
  return cat.articles.find((a) => a.slug === slug);
}

/** Same-topic articles first (newest), then the rest — excluding the article itself. */
export function getRelatedArticles(article: Article, n = 3, cat: Catalog = catalog): Article[] {
  const rest = getArticles({}, cat).filter((a) => a.id !== article.id);
  const sameTopic = rest.filter((a) => a.topic === article.topic);
  const others = rest.filter((a) => a.topic !== article.topic);
  return [...sameTopic, ...others].slice(0, n);
}

/** Topics that have at least one article, with their counts. */
export function getTopicsWithCounts(cat: Catalog = catalog): {topic: Topic; count: number}[] {
  const counts = new Map<Topic, number>();
  for (const a of cat.articles) counts.set(a.topic, (counts.get(a.topic) ?? 0) + 1);
  return [...counts.entries()].map(([topic, count]) => ({topic, count}));
}
