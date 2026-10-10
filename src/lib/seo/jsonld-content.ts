// schema.org builders for catalog entities: Product+Offer, seminar Event,
// FAQPage and Article (seo/structured-data spec).

import type {Article, Product, Seminar} from "../catalog/types";
import {siteConfig} from "../site-config";
import {absoluteImageUrl, organizationLd, type JsonLd} from "./jsonld";
import {absoluteUrl} from "./meta";

const ORG_TYPE = "https://schema.org/";

export function productLd(p: Product): JsonLd {
  const image = absoluteImageUrl(p.images[0] ?? null);
  return {
    "@context": ORG_TYPE,
    "@type": "Product",
    name: p.name,
    description: p.seo.description || p.shortBenefit,
    ...(image ? {image} : {}),
    brand: {"@type": "Brand", name: "KEDI"},
    ...(absoluteUrl(`/products/${p.slug}`) ? {url: absoluteUrl(`/products/${p.slug}`)} : {}),
    ...(p.priceNgn === null
      ? {}
      : {
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: p.priceNgn,
            availability: `${ORG_TYPE}${p.inStock ? "InStock" : "OutOfStock"}`,
            seller: {"@type": "Organization", name: siteConfig.name},
          },
        }),
  };
}

export function eventLd(s: Seminar): JsonLd {
  const online = s.format === "online";
  return {
    "@context": ORG_TYPE,
    "@type": "Event",
    name: s.topic,
    description: s.summary,
    startDate: s.startsAt,
    endDate: s.endsAt,
    eventStatus: `${ORG_TYPE}EventScheduled`,
    eventAttendanceMode: `${ORG_TYPE}${online ? "OnlineEventAttendanceMode" : "OfflineEventAttendanceMode"}`,
    location: online
      ? {"@type": "VirtualLocation", url: s.lumaUrl}
      : {"@type": "Place", name: s.venue, address: {"@type": "PostalAddress", addressCountry: "NG"}},
    organizer: organizationLd(),
    offers: {"@type": "Offer", price: 0, priceCurrency: "NGN", availability: `${ORG_TYPE}InStock`, url: s.lumaUrl},
  };
}

export function faqLd(faqs: {question: string; answer: string}[]): JsonLd {
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

export function articleLd(a: Article): JsonLd {
  const image = absoluteImageUrl(a.cover);
  return {
    "@context": ORG_TYPE,
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    ...(image ? {image} : {}),
    author: organizationLd(),
    publisher: organizationLd(),
    ...(absoluteUrl(`/learn/${a.slug}`) ? {mainEntityOfPage: absoluteUrl(`/learn/${a.slug}`)} : {}),
  };
}
