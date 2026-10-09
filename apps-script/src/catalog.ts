// Builds the catalog payload served by `?action=catalog` — Products,
// Categories, FAQs, Settings, Delivery, Seminar Schedule plus the client
// content tabs. Validates per design §6: errors block, warnings report.

import {articlesFrom, categoriesFrom, deliveryFrom, productsFrom, seminarsFrom, settingsFrom} from "./catalog-tabs.ts";
import {highlightsFrom, storiesFrom, videosFrom, type HighlightItem, type StoryItem, type VideoItem} from "./content.ts";
import {convertArticleDoc, type ArticleBlock, type DocConversion} from "./docs.ts";
import {HEADERS, TABS, type TabKey, type Topic} from "./schema.ts";
import type {TableRow} from "./table.ts";
import {Issues} from "./validate.ts";

export interface ApiProduct {
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

export interface ApiCategory {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  imageId: string | null;
}

export interface ApiSeminar {
  id: string;
  startsAt: string;
  endsAt: string;
  topic: string;
  summary: string;
  learnPoints: string[];
  audience: string;
  format: "physical" | "online";
  venue: string;
  lumaUrl: string;
  lumaEventId: string;
  status: "scheduled" | "cancelled" | "done";
  recordingUrl: string | null;
}

export interface ApiDelivery {
  area: string;
  zone: "local" | "interstate" | "pickup";
  feeNgn: number;
  timelineText: string;
}

export interface ApiSettings {
  bank: {name: string; accountName: string; accountNumber: string} | null;
  openingHours: string;
  pickupAddress: string;
  deliveryNote: string;
  announcement: {text: string; href: string | null} | null;
  seminarOfferText: string | null;
  referralRewardText: string;
  referralFriendRewardText: string;
  loyaltyText: string | null;
  freeDeliveryThresholdNgn: number | null;
}

export interface ApiArticle {
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
  body: ArticleBlock[];
  toc: {id: string; text: string}[];
}

export interface CatalogPayload {
  generatedAt: string;
  products: ApiProduct[];
  categories: ApiCategory[];
  settings: ApiSettings;
  delivery: ApiDelivery[];
  seminars: ApiSeminar[];
  highlights: HighlightItem[];
  videos: VideoItem[];
  stories: StoryItem[];
  articles: ApiArticle[];
}

export interface StoreLike {
  table(tab: string): {headers: string[]; rows: TableRow[]};
}

export interface CatalogDeps {
  convertDoc?: (docId: string, articleId: string) => DocConversion;
  now?: Date;
}

/** Flags unknown/missing headers so client renames surface in the check dialog. */
export function checkHeaders(store: StoreLike, issues: Issues): void {
  for (const [key, headers] of Object.entries(HEADERS)) {
    const tab = TABS[key as TabKey];
    const actual = store.table(tab).headers;
    for (const h of headers) {
      if (!actual.includes(h)) issues.error(tab, 1, tab, `missing column "${h}" — run setupWorkbook or fix the header name`);
    }
    for (const h of actual) {
      if (h && !headers.includes(h)) issues.warn(tab, 1, tab, `unknown column "${h}" — it will be ignored`);
    }
  }
}

export function buildCatalog(store: StoreLike, issues: Issues, deps: CatalogDeps = {}): CatalogPayload | null {
  checkHeaders(store, issues);
  const categories = categoriesFrom(store, issues);
  const payload: CatalogPayload = {
    generatedAt: (deps.now ?? new Date()).toISOString(),
    products: productsFrom(store, issues, categories),
    categories,
    settings: settingsFrom(store),
    delivery: deliveryFrom(store, issues),
    seminars: seminarsFrom(store, issues),
    highlights: highlightsFrom(store, issues),
    videos: videosFrom(store, issues),
    stories: storiesFrom(store, issues),
    articles: articlesFrom(store, issues, deps.convertDoc ?? convertArticleDoc),
  };
  return issues.hasErrors ? null : payload;
}
