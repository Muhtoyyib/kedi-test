// buildMeta — the single way pages declare title, description, canonical
// and social previews (seo/metadata spec). Canonicals never carry a query
// string; thank-you and 404 pages pass noindex.

import {siteConfig} from "../site-config";

export interface MetaInput {
  title: string;
  description: string;
  path: string;
  /** Absolute path or URL; falls back to /og/default.jpg. */
  image?: string;
  type?: "website" | "product" | "article";
  /** ISO date — emitted as article:published_time (learn/page design). */
  publishedTime?: string;
  noindex?: boolean;
}

interface MetaTag {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}

export function absoluteUrl(pathOrUrl: string): string | null {
  if (!siteConfig.url) return null;
  return new URL(pathOrUrl, siteConfig.url).toString();
}

export function buildMeta({title, description, path, image, type = "website", publishedTime, noindex = false}: MetaInput) {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? "/og/default.jpg");
  const meta: MetaTag[] = [
    {title},
    {name: "description", content: description.slice(0, 155)},
    {name: "robots", content: noindex ? "noindex, nofollow" : "index, follow"},
    {property: "og:type", content: type},
    {property: "og:title", content: title},
    {property: "og:description", content: description.slice(0, 155)},
    {property: "og:locale", content: "en_NG"},
    {name: "twitter:card", content: "summary_large_image"},
    {name: "twitter:title", content: title},
    {name: "twitter:description", content: description.slice(0, 155)},
  ];
  if (type === "article" && publishedTime) meta.push({property: "article:published_time", content: publishedTime});
  if (canonical) meta.push({property: "og:url", content: canonical});
  if (ogImage) meta.push({property: "og:image", content: ogImage}, {name: "twitter:image", content: ogImage});
  return {meta, links: canonical ? [{rel: "canonical", href: canonical}] : []};
}
