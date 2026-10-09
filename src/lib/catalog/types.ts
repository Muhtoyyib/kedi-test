// Types for the generated catalog — docs/content-model.md §2. Written by
// scripts/fetch-catalog.ts; pages only read through src/lib/catalog/*.ts.

export type Topic = "digestion" | "energy" | "immunity" | "heart-and-circulation" | "women" | "men" | "weight" | "everyday-wellness";

export const TOPICS: Topic[] = ["digestion", "energy", "immunity", "heart-and-circulation", "women", "men", "weight", "everyday-wellness"];

export interface GeneratedImage {
  key: string; // e.g. p/KD-P001/0
  alt: string;
  width: number; // intrinsic width of the largest variant
  height: number;
  variants: {width: number; avif: string; webp: string}[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  priceNgn: number | null; // null → "Ask for price"
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
  images: GeneratedImage[];
  relatedIds: string[];
  faqs: {question: string; answer: string}[];
  seo: {title: string; description: string};
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  image: GeneratedImage | null;
}

export interface DeliveryArea {
  area: string;
  zone: "local" | "interstate" | "pickup";
  feeNgn: number;
  timelineText: string;
}

export interface Seminar {
  id: string;
  startsAt: string; // ISO with +01:00
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

export interface VideoLink {
  provider: "youtube" | "tiktok";
  id: string;
  url: string;
}

export interface VideoRef extends VideoLink {
  poster: GeneratedImage;
}

export interface Highlight {
  id: string;
  date: string;
  topic: string;
  seminarId: string | null;
  photos: GeneratedImage[];
  video: VideoRef | null;
  comment: {text: string; name: string} | null;
}

export interface Video {
  id: string;
  title: string;
  topic: Topic;
  durationText: string | null;
  date: string;
  video: VideoRef;
}

export interface Story {
  id: string;
  slug: string;
  name: string;
  area: string;
  quote: string;
  fullStory: string[];
  photo: GeneratedImage | null;
  video: VideoRef | null;
  kind: "written" | "video";
  consent: {date: string; channel: "whatsapp" | "written" | "email"};
  featured: boolean;
  date: string;
}

export type Inline = {text: string; bold?: true; italic?: true; href?: string};

export type ArticleBlock =
  | {type: "h2" | "h3"; id: string; text: string}
  | {type: "p"; inlines: Inline[]}
  | {type: "ul" | "ol"; items: Inline[][]}
  | {type: "image"; image: GeneratedImage; alt: string}
  | {type: "video"; video: VideoRef}
  | {type: "doctor-callout"; blocks: ArticleBlock[]};

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: Topic;
  date: string;
  cover: GeneratedImage;
  coverAlt: string;
  relatedCategory: string | null;
  readingMinutes: number;
  body: ArticleBlock[];
  toc: {id: string; text: string}[];
}

export interface Settings {
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

export interface Catalog {
  source: "live" | "fixture";
  generatedAt: string;
  products: Product[];
  categories: Category[];
  settings: Settings;
  delivery: DeliveryArea[];
  seminars: Seminar[];
  highlights: Highlight[];
  videos: Video[];
  stories: Story[];
  articles: Article[];
}
