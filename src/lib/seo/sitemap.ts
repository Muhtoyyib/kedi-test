// Sitemap + robots builders (seo/sitemap spec). Static routes and their
// priorities come straight from docs/routes-and-sitemap.md — the same table
// the site-nav test enforces — plus catalog products, categories and
// articles. Param routes (/thank-you/$kind) and excluded rows never appear.

import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import type {Catalog} from "../catalog/types";
import {siteConfig} from "../site-config";

export interface SitemapEntry {
  path: string;
  priority: string;
  lastmod?: string;
}

function staticEntries(): SitemapEntry[] {
  const doc = readFileSync(resolve(process.cwd(), "docs/routes-and-sitemap.md"), "utf8");
  const entries: SitemapEntry[] = [];
  for (const m of doc.matchAll(/^\|\s*`(\/[^`]*)`\s*\|[^|]*\|[^|]*\|[^|]*\|\s*([^|]*?)\s*\|/gm)) {
    const [, path, priority] = m;
    if (path.includes("$") || !/^[\d.]+$/.test(priority)) continue;
    entries.push({path, priority});
  }
  return entries;
}

export function sitemapEntries(cat: Catalog): SitemapEntry[] {
  const lastmod = cat.generatedAt.slice(0, 10);
  return [
    ...staticEntries(),
    ...cat.products.map((p) => ({path: `/products/${p.slug}`, priority: "0.8", lastmod})),
    ...cat.categories.map((c) => ({path: `/shop/${c.slug}`, priority: "0.8", lastmod})),
    ...cat.articles.map((a) => ({path: `/learn/${a.slug}`, priority: "0.6", lastmod: a.date})),
  ];
}

export function buildSitemapXml(cat: Catalog, base = siteConfig.url ?? "http://localhost:5180"): string {
  const urls = sitemapEntries(cat)
    .map((e) => {
      const loc = new URL(e.path, base).toString();
      const lm = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${loc}</loc>${lm}\n    <priority>${e.priority}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobotsTxt(base = siteConfig.url ?? "http://localhost:5180"): string {
  return `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${new URL("/sitemap.xml", base).toString()}\n`;
}
