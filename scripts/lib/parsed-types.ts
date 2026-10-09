// Types produced by parse-catalog: validated rows with Drive image refs still
// unresolved (resolve-content turns them into GeneratedImage/VideoRef).

import type {Catalog, Inline, Topic, VideoLink} from "../../src/lib/catalog/types.ts";

/** An image block inside a Doc-converted article, before the image is fetched. */
export type WireBlock =
  | {type: "h2" | "h3"; id: string; text: string}
  | {type: "p"; inlines: Inline[]}
  | {type: "ul" | "ol"; items: Inline[][]}
  | {type: "image"; ref: {doc: string; n: number}; alt: string}
  | {type: "video"; video: VideoLink}
  | {type: "doctor-callout"; blocks: WireBlock[]};

export interface ParsedProduct {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  priceNgn: number | null;
  packSize: string;
  packDays: number;
  inStock: boolean;
  featured: boolean;
  sortOrder: number;
  shortBenefit: string;
  description: string[];
  ingredients: string[];
  howToUse: string[];
  nafdacNo: string | null;
  imageIds: string[];
  relatedIds: string[];
  faqs: {question: string; answer: string}[];
  seo: {title: string; description: string};
}

export interface ParsedCategory {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  imageId: string | null;
}

export interface ParsedHighlight {
  id: string;
  date: string;
  topic: string;
  seminarId: string | null;
  photoIds: string[];
  photoAlts: string[];
  video: VideoLink | null;
  comment: {text: string; name: string} | null;
}

export interface ParsedVideo {
  id: string;
  title: string;
  topic: Topic;
  durationText: string | null;
  date: string;
  video: VideoLink;
}

export interface ParsedStory {
  id: string;
  slug: string;
  name: string;
  area: string;
  quote: string;
  fullStory: string[];
  photoId: string | null;
  video: VideoLink | null;
  kind: "written" | "video";
  consent: {date: string; channel: "whatsapp" | "written" | "email"};
  featured: boolean;
  date: string;
}

export interface ParsedArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: Topic;
  date: string;
  coverImageId: string;
  coverAlt: string;
  relatedCategory: string | null;
  readingMinutes: number;
  body: WireBlock[];
  toc: {id: string; text: string}[];
}

export interface ParsedCatalog extends Omit<Catalog, "products" | "categories" | "highlights" | "videos" | "stories" | "articles"> {
  products: ParsedProduct[];
  categories: ParsedCategory[];
  highlights: ParsedHighlight[];
  videos: ParsedVideo[];
  stories: ParsedStory[];
  articles: ParsedArticle[];
}

export class CatalogError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(errors.join("\n"));
    this.errors = errors;
  }
}
