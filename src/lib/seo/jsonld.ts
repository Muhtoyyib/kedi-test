// schema.org JSON-LD builders (seo/structured-data spec). The business is
// an independent distributor — never emit parentOrganization or imply KEDI
// ownership; KEDI appears only as the product *brand*.

import {getSettings} from "../catalog/settings";
import type {Article, GeneratedImage, Product, Seminar} from "../catalog/types";
import {getAbout} from "../content/about";
import {siteConfig} from "../site-config";
import {absoluteUrl} from "./meta";

export type JsonLdValue = string | number | boolean | null | JsonLdValue[] | {[key: string]: JsonLdValue};
export type JsonLd = {[key: string]: JsonLdValue};

const ORG_TYPE = "https://schema.org/";

export function absoluteImageUrl(image: GeneratedImage | null): string | null {
  const last = image?.variants.at(-1);
  return last ? absoluteUrl(last.webp) : null;
}

export function socialUrls(): string[] {
  return Object.values(siteConfig.socials).filter((v) => typeof v === "string" && v.startsWith("http"));
}

export function organizationLd(): JsonLd {
  const sameAs = socialUrls();
  return {
    "@context": ORG_TYPE,
    "@type": "Organization",
    name: siteConfig.name,
    ...(siteConfig.url ? {url: siteConfig.url} : {}),
    ...(sameAs.length ? {sameAs} : {}),
  };
}

function to24(hour: string, minute: string, meridiem: string): string {
  let h = +hour;
  if (meridiem.toUpperCase() === "PM" && h !== 12) h += 12;
  if (meridiem.toUpperCase() === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

/** "Mon–Sat, 9:00 AM – 6:00 PM" → openingHoursSpecification, else null. */
export function openingHoursSpec(text: string): JsonLd | null {
  const m = /^([A-Za-z]{3})(?:\s*–\s*([A-Za-z]{3}))?,\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*–\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(text.trim());
  if (!m) return null;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const norm = (d: string) => d[0].toUpperCase() + d.slice(1, 3).toLowerCase();
  const from = days.indexOf(norm(m[1]));
  const to = m[2] ? days.indexOf(norm(m[2])) : from;
  if (from < 0 || to < 0) return null;
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: dayNames.slice(from, to + 1),
    opens: to24(m[3], m[4], m[5]),
    closes: to24(m[6], m[7], m[8]),
  };
}

/** Person node for the distributor — page-level `founder` on the
 *  LocalBusiness node emitted by the /about route (about/page design). */
export function personLd(): JsonLd {
  const {distributor} = getAbout();
  return {
    "@type": "Person",
    name: distributor.name,
    jobTitle: "Independent KEDI Distributor",
    worksFor: {"@type": "Organization", name: siteConfig.name},
  };
}

export function localBusinessLd(founder?: JsonLd): JsonLd {
  const settings = getSettings();
  const {address, phone} = siteConfig;
  const spec = openingHoursSpec(settings.openingHours);
  return {
    "@context": ORG_TYPE,
    "@type": "HealthAndBeautyBusiness",
    name: siteConfig.name,
    description: `${siteConfig.name} is an independent distributor of KEDI Healthcare products in ${siteConfig.city}, Nigeria.`,
    ...(siteConfig.url ? {url: siteConfig.url} : {}),
    telephone: phone.number,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      addressCountry: "NG",
    },
    ...(settings.openingHours ? {openingHours: settings.openingHours} : {}),
    ...(spec ? {openingHoursSpecification: spec} : {}),
    areaServed: [...siteConfig.serviceAreas],
    sameAs: socialUrls(),
    ...(founder ? {founder} : {}),
  };
}

/** ContactPage node referencing the business (contact/page design). */
export function contactPageLd(): JsonLd {
  return {
    "@context": ORG_TYPE,
    "@type": "ContactPage",
    name: `Contact ${siteConfig.name}`,
    ...(siteConfig.url ? {url: `${siteConfig.url}/contact`} : {}),
    about: {
      "@type": "HealthAndBeautyBusiness",
      name: siteConfig.name,
      ...(siteConfig.url ? {url: siteConfig.url} : {}),
    },
  };
}

export function webSiteLd(): JsonLd {
  return {
    "@context": ORG_TYPE,
    "@type": "WebSite",
    name: siteConfig.name,
    ...(siteConfig.url ? {url: siteConfig.url} : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbLd(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": ORG_TYPE,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(absoluteUrl(item.path) ? {item: absoluteUrl(item.path)} : {}),
    })),
  };
}

/** ItemList of product URLs for shop/category listings. */
export function itemListLd(paths: string[]): JsonLd {
  return {
    "@context": ORG_TYPE,
    "@type": "ItemList",
    itemListElement: paths.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      ...(absoluteUrl(p) ? {url: absoluteUrl(p)} : {name: p}),
    })),
  };
}

/** Product schema for /products/{slug}. Offer only when priced — an
 *  ask-price product must not publish a fake price. */
export function productLd(product: Product, categoryName: string): JsonLd {
  return {
    "@context": ORG_TYPE,
    "@type": "Product",
    name: product.name,
    description: product.seo.description || product.shortBenefit,
    ...(absoluteUrl(`/products/${product.slug}`) ? {url: absoluteUrl(`/products/${product.slug}`)} : {}),
    ...(absoluteImageUrl(product.images[0] ?? null) ? {image: absoluteImageUrl(product.images[0]!)} : {}),
    sku: product.id,
    category: categoryName,
    brand: {"@type": "Brand", name: "KEDI Healthcare"},
    ...(product.priceNgn !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: product.priceNgn,
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            ...(absoluteUrl(`/products/${product.slug}`) ? {url: absoluteUrl(`/products/${product.slug}`)} : {}),
          },
        }
      : {}),
  };
}

/** Event schema for a scheduled seminar (seminars/page spec). Free offer,
 *  WAT times as authored, Place vs VirtualLocation by format. */
export function seminarEventLd(s: Seminar): JsonLd {
  const online = s.format === "online";
  return {
    "@context": ORG_TYPE,
    "@type": "Event",
    name: s.topic,
    description: s.summary,
    startDate: s.startsAt,
    endDate: s.endsAt,
    eventStatus: `https://schema.org/${s.status === "cancelled" ? "EventCancelled" : "EventScheduled"}`,
    eventAttendanceMode: `https://schema.org/${online ? "Online" : "Offline"}EventAttendanceMode`,
    location: online ? {"@type": "VirtualLocation", url: s.lumaUrl} : {"@type": "Place", name: s.venue, address: s.venue},
    organizer: {"@type": "Organization", name: siteConfig.name, ...(siteConfig.url ? {url: siteConfig.url} : {})},
    offers: {"@type": "Offer", price: 0, priceCurrency: "NGN", availability: "https://schema.org/InStock", url: s.lumaUrl},
    isAccessibleForFree: true,
  };
}

/** Article schema for /learn/{slug} (learn/page spec). The business is both
 *  author and publisher — never KEDI. */
export function articleLd(article: Article): JsonLd {
  const org = {"@type": "Organization", name: siteConfig.name, ...(siteConfig.url ? {url: siteConfig.url} : {})};
  const image = absoluteImageUrl(article.cover);
  const url = absoluteUrl(`/learn/${article.slug}`);
  return {
    "@context": ORG_TYPE,
    "@type": "Article",
    headline: article.title,
    description: article.description,
    ...(image ? {image: [image]} : {}),
    datePublished: article.date,
    author: org,
    publisher: org,
    ...(url ? {mainEntityOfPage: url} : {}),
  };
}

/** FAQPage schema — product-specific FAQs only (general ordering FAQs are
 *  repeated across pages and would duplicate). */
export function faqPageLd(faqs: readonly {question: string; answer: string}[]): JsonLd | null {
  if (faqs.length === 0) return null;
  return {
    "@context": ORG_TYPE,
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {"@type": "Answer", text: f.answer},
    })),
  };
}

/** TanStack head() script entries — one script per entity. */
export function jsonLdScripts(entities: JsonLd[]): {type: string; children: string}[] {
  return entities.map((e) => ({type: "application/ld+json", children: JSON.stringify(e)}));
}
