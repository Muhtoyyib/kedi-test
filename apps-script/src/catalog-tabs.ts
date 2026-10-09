// Per-tab catalog builders used by buildCatalog. Products/categories/seminars/
// delivery/settings are KEDI-approved or schedule data (banned words →
// warnings); articles are client-written (the Doc converter reports errors).

import {num, splitList, str, yn, dateOnly, type Cell, type TableRow} from "./table.ts";
import {bannedWordsIn, isHttpsUrl, isIsoDate, isTime24, slugify, type Issues} from "./validate.ts";
import type {ApiArticle, ApiCategory, ApiProduct, ApiDelivery, ApiSeminar, ApiSettings, StoreLike} from "./catalog.ts";
import type {DocConversion} from "./docs.ts";
import {docIdFromUrl} from "./docs.ts";
import {SEMINAR_FORMATS, SEMINAR_STATUSES, TABS, TOPICS, type Topic} from "./schema.ts";

const PRODUCT_REQUIRED = [
  "product_id",
  "name",
  "category",
  "pack_size",
  "pack_days",
  "short_benefit",
  "description",
  "how_to_use",
  "image_ids",
];

export function categoriesFrom(store: StoreLike, issues: Issues): ApiCategory[] {
  const out: ApiCategory[] = [];
  const seen = new Set<string>();
  for (const {row, rec} of store.table(TABS.categories).rows) {
    if (!yn(rec.active)) continue;
    const slug = str(rec.slug);
    if (!slug || !str(rec.name)) {
      issues.error(TABS.categories, row, slug, "slug and name are required");
      continue;
    }
    if (seen.has(slug)) {
      issues.error(TABS.categories, row, slug, `duplicate category slug "${slug}"`);
      continue;
    }
    seen.add(slug);
    out.push({
      slug,
      name: str(rec.name),
      description: str(rec.description),
      sortOrder: num(rec.sort_order) ?? 999,
      imageId: str(rec.image_id) || null,
    });
  }
  return out.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function productsFrom(store: StoreLike, issues: Issues, categories: ApiCategory[]): ApiProduct[] {
  const faqRows = store.table(TABS.faqs).rows;
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const out: ApiProduct[] = [];
  for (const {row, rec} of store.table(TABS.products).rows) {
    if (!yn(rec.active)) continue;
    const id = str(rec.product_id);
    if (invalidProduct(rec, row, id, issues, categorySlugs, seenId, seenSlug)) continue;
    out.push(
      productItem(
        rec,
        faqRows.filter((f) => str(f.rec.product_id) === id),
        issues,
        row,
        id
      )
    );
  }
  if (out.length && !out.some((p) => p.featured)) {
    issues.warn(TABS.products, 0, "", "no product is marked featured — the home page featured row will be empty");
  }
  return out.sort((a, b) => a.sortOrder - b.sortOrder);
}

function invalidProduct(
  rec: Record<string, Cell>,
  row: number,
  id: string,
  issues: Issues,
  categorySlugs: Set<string>,
  seenId: Set<string>,
  seenSlug: Set<string>
): boolean {
  let bad = false;
  for (const field of PRODUCT_REQUIRED) {
    if (str(rec[field]) === "") {
      issues.error(TABS.products, row, id, `required field "${field}" is empty`);
      bad = true;
    }
  }
  if (!id) return true;
  if (seenId.has(id)) {
    issues.error(TABS.products, row, id, `duplicate product_id "${id}"`);
    bad = true;
  }
  seenId.add(id);
  const slug = str(rec.slug) || slugify(str(rec.name));
  if (seenSlug.has(slug)) {
    issues.error(TABS.products, row, id, `duplicate slug "${slug}"`);
    bad = true;
  }
  seenSlug.add(slug);
  if (str(rec.category) && !categorySlugs.has(str(rec.category))) {
    issues.error(TABS.products, row, id, `category "${str(rec.category)}" isn't in Categories`);
    bad = true;
  }
  const price = num(rec.price_ngn);
  if (str(rec.price_ngn) !== "" && (price === null || !Number.isInteger(price) || price <= 0)) {
    issues.error(
      TABS.products,
      row,
      id,
      `price_ngn must be a positive whole number (got "${str(rec.price_ngn)}") — or leave blank for "Ask for price"`
    );
    bad = true;
  }
  const days = num(rec.pack_days);
  if (str(rec.pack_days) !== "" && (days === null || !Number.isInteger(days) || days < 1 || days > 365)) {
    issues.error(TABS.products, row, id, "pack_days must be a whole number from 1 to 365");
    bad = true;
  }
  return bad;
}

function productItem(rec: Record<string, Cell>, faqRows: TableRow[], issues: Issues, row: number, id: string): ApiProduct {
  let shortBenefit = str(rec.short_benefit);
  if (shortBenefit.length > 90) {
    issues.warn(TABS.products, row, id, "short_benefit is over 90 characters — it will be truncated");
    shortBenefit = shortBenefit.slice(0, 90);
  }
  if (!str(rec.nafdac_no)) issues.warn(TABS.products, row, id, "nafdac_no is blank — the NAFDAC line will be hidden");
  for (const word of bannedWordsIn(`${str(rec.short_benefit)}\n${str(rec.description)}`)) {
    issues.warn(TABS.products, row, id, `check "${word}" is KEDI-approved wording`);
  }
  const name = str(rec.name);
  const packSize = str(rec.pack_size);
  return {
    id,
    slug: str(rec.slug) || slugify(name),
    name,
    categorySlug: str(rec.category),
    priceNgn: str(rec.price_ngn) === "" ? null : num(rec.price_ngn),
    packSize,
    packDays: num(rec.pack_days) ?? 0,
    inStock: yn(rec.in_stock),
    featured: yn(rec.featured),
    sortOrder: num(rec.sort_order) ?? 999,
    shortBenefit,
    description: str(rec.description)
      .split(/\n\s*\n/)
      .filter(Boolean),
    ingredients: splitList(rec.ingredients, "\n"),
    howToUse: splitList(rec.how_to_use, "\n"),
    nafdacNo: str(rec.nafdac_no) || null,
    imageIds: splitList(rec.image_ids).slice(0, 6),
    relatedIds: splitList(rec.related_ids),
    faqs: faqRows.map((f) => ({question: str(f.rec.question), answer: str(f.rec.answer)})).filter((f) => f.question && f.answer),
    seo: {title: str(rec.seo_title) || `${name} — ${packSize}`, description: str(rec.seo_description) || shortBenefit},
  };
}

export function seminarsFrom(store: StoreLike, issues: Issues): ApiSeminar[] {
  const out: ApiSeminar[] = [];
  for (const {row, rec} of store.table(TABS.seminars).rows) {
    const id = str(rec.seminar_id);
    const date = dateOnly(rec.date);
    const start = str(rec.start_time);
    const end = str(rec.end_time);
    const luma = str(rec.luma_url);
    if (!id || !date || !isIsoDate(date) || !isTime24(start) || !isTime24(end)) {
      issues.error(TABS.seminars, row, id, "seminar needs an ID, a YYYY-MM-DD date and HH:mm times");
      continue;
    }
    if (!isHttpsUrl(luma)) {
      issues.error(TABS.seminars, row, id, "luma_url must be an https:// link");
      continue;
    }
    const format = str(rec.format);
    const status = str(rec.status);
    if (!(SEMINAR_FORMATS as readonly string[]).includes(format) || !(SEMINAR_STATUSES as readonly string[]).includes(status)) {
      issues.error(TABS.seminars, row, id, "format must be physical/online and status scheduled/cancelled/done");
      continue;
    }
    out.push({
      id,
      startsAt: `${date}T${start}:00+01:00`,
      endsAt: `${date}T${end}:00+01:00`,
      topic: str(rec.topic),
      summary: str(rec.summary),
      learnPoints: splitList(rec.learn_points, "|"),
      audience: str(rec.audience),
      format: format as ApiSeminar["format"],
      venue: str(rec.venue),
      lumaUrl: luma,
      lumaEventId: str(rec.luma_event_id),
      status: status as ApiSeminar["status"],
      recordingUrl: str(rec.recording_url) || null,
    });
  }
  return out.sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1));
}

export function deliveryFrom(store: StoreLike, issues: Issues): ApiDelivery[] {
  const zones = ["local", "interstate", "pickup"];
  const out: (ApiDelivery & {sortOrder: number})[] = [];
  for (const {row, rec} of store.table(TABS.delivery).rows) {
    if (!yn(rec.active)) continue;
    const zone = str(rec.zone);
    const fee = num(rec.fee_ngn);
    if (!str(rec.area) || !zones.includes(zone) || fee === null) {
      issues.error(TABS.delivery, row, str(rec.area), `area, zone (${zones.join("/")}) and a numeric fee_ngn are required`);
      continue;
    }
    out.push({
      area: str(rec.area),
      zone: zone as ApiDelivery["zone"],
      feeNgn: fee,
      timelineText: str(rec.timeline_text),
      sortOrder: num(rec.sort_order) ?? 999,
    });
  }
  return out.sort((a, b) => a.sortOrder - b.sortOrder).map(({sortOrder: _s, ...rest}) => rest);
}

export function settingsFrom(store: StoreLike): ApiSettings {
  const kv = new Map(store.table(TABS.settings).rows.map(({rec}) => [str(rec.key), str(rec.value)]));
  const get = (key: string) => kv.get(key) ?? "";
  const bank =
    get("bank_name") && get("bank_account_name") && get("bank_account_number")
      ? {name: get("bank_name"), accountName: get("bank_account_name"), accountNumber: get("bank_account_number")}
      : null;
  const threshold = get("free_delivery_threshold_ngn");
  return {
    bank,
    openingHours: get("opening_hours"),
    pickupAddress: get("pickup_address"),
    deliveryNote: get("delivery_note"),
    announcement: get("announcement_text") ? {text: get("announcement_text"), href: get("announcement_link") || null} : null,
    seminarOfferText: get("seminar_offer_text") || null,
    referralRewardText: get("referral_reward_text") || "",
    referralFriendRewardText: get("referral_friend_reward_text") || "",
    loyaltyText: get("loyalty_text") || null,
    freeDeliveryThresholdNgn: threshold ? (num(threshold) ?? null) : null,
  };
}

export function articlesFrom(
  store: StoreLike,
  issues: Issues,
  convertDoc: (docId: string, articleId: string) => DocConversion
): ApiArticle[] {
  const out: ApiArticle[] = [];
  const seen = new Set<string>();
  for (const {row, rec} of store.table(TABS.articles).rows) {
    if (!yn(rec.ready)) continue;
    const id = str(rec.article_id);
    const article = articleItem(rec, row, id, issues, seen, convertDoc);
    if (article) out.push(article);
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function articleItem(
  rec: Record<string, Cell>,
  row: number,
  id: string,
  issues: Issues,
  seen: Set<string>,
  convertDoc: (docId: string, articleId: string) => DocConversion
): ApiArticle | null {
  if (!id || seen.has(id)) {
    issues.error(TABS.articles, row, id, id ? `duplicate article_id "${id}"` : "article_id is required");
    return null;
  }
  seen.add(id);
  const docId = docIdFromUrl(str(rec.doc_url));
  const topic = str(rec.topic);
  if (!docId) {
    issues.error(TABS.articles, row, id, "doc_url must be a Google Doc link");
    return null;
  }
  if (
    !(TOPICS as readonly string[]).includes(topic) ||
    !str(rec.description) ||
    !str(rec.cover_image_id) ||
    !str(rec.cover_alt) ||
    !dateOnly(rec.date)
  ) {
    issues.error(TABS.articles, row, id, "topic, description, cover_image_id, cover_alt and a valid date are required");
    return null;
  }
  let doc: DocConversion;
  try {
    doc = convertDoc(docId, id);
  } catch {
    issues.error(TABS.articles, row, id, `the Doc can't be opened — share it with the Google account that runs the website script`);
    return null;
  }
  doc.warnings.forEach((m) => issues.warn(TABS.articles, row, id, m));
  doc.errors.forEach((m) => issues.error(TABS.articles, row, id, m));
  if (doc.errors.length) return null;
  const title = str(rec.title) || doc.title || "";
  if (!title) {
    issues.error(TABS.articles, row, id, "no title — set the title column or add a Doc title");
    return null;
  }
  return {
    id,
    slug: str(rec.slug) || slugify(title),
    title,
    description: str(rec.description),
    topic: topic as Topic,
    date: dateOnly(rec.date)!,
    coverImageId: str(rec.cover_image_id),
    coverAlt: str(rec.cover_alt),
    relatedCategory: str(rec.related_category) || null,
    readingMinutes: doc.readingMinutes,
    body: doc.blocks,
    toc: doc.blocks
      .filter((b): b is {type: "h2" | "h3"; id: string; text: string} => b.type === "h2")
      .map((b) => ({id: b.id, text: b.text})),
  };
}
