// schema.org JSON-LD builders (seo/structured-data spec). The business is
// an independent distributor — never emit parentOrganization or imply KEDI
// ownership; KEDI appears only as the product *brand*.

import {getSettings} from "../catalog/settings";
import type {GeneratedImage} from "../catalog/types";
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

export function localBusinessLd(): JsonLd {
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

/** TanStack head() script entries — one script per entity. */
export function jsonLdScripts(entities: JsonLd[]): {type: string; children: string}[] {
  return entities.map((e) => ({type: "application/ld+json", children: JSON.stringify(e)}));
}
