// Entry point for catalog parsing plus the product/category sections. Takes
// the Apps Script payload (or the fixture, same shape) → ParsedCatalog, or
// throws CatalogError listing every row-level problem.

import {isRecord, type UntrustedRecord, type UntrustedValue} from "../../src/lib/untrusted.ts";
import {CatalogError, type ParsedCatalog, type ParsedCategory, type ParsedProduct} from "./parsed-types.ts";
import {parseArticles} from "./parse-articles.ts";
import {parseDelivery, parseSeminars, parseSettings} from "./parse-sections.ts";
import {parseHighlights, parseStories, parseVideos} from "./parse-content.ts";
import {at, bool, Collector, eachRow, type Issue, list, optNum, paragraphs, str} from "./parse-utils.ts";
import {slugify} from "./slugify.ts";

const TAB = {
  products: "Products",
  categories: "Categories",
} as const;

function parseCategories(rows: UntrustedValue, c: Collector): ParsedCategory[] {
  const out: ParsedCategory[] = [];
  const seen = new Set<string>();
  eachRow(rows, (rec, i) => {
    const loc = at(TAB.categories, i, str(rec, "slug"));
    if (!loc.id || !str(rec, "name")) {
      c.error(loc, "slug and name are required");
      return;
    }
    if (seen.has(loc.id)) {
      c.error(loc, `duplicate slug "${loc.id}"`);
      return;
    }
    seen.add(loc.id);
    out.push({
      slug: loc.id,
      name: str(rec, "name"),
      description: str(rec, "description"),
      sortOrder: optNum(rec, "sortOrder") ?? 999,
      imageId: str(rec, "imageId") || null,
    });
  });
  return out.sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Returns an error message on the first sight of a repeat, else records it. */
function mark(seen: Set<string>, value: string, label: string): string | null {
  if (seen.has(value)) return `duplicate ${label} "${value}"`;
  seen.add(value);
  return null;
}

function productNumberProblems(rec: UntrustedRecord, issue: Issue): boolean {
  let bad = false;
  const price = rec.priceNgn;
  if (price !== null && price !== undefined && (typeof price !== "number" || !Number.isInteger(price) || price <= 0)) {
    issue("price_ngn is not a number");
    bad = true;
  }
  const days = optNum(rec, "packDays");
  if (days === null || !Number.isInteger(days) || days < 1 || days > 365) {
    issue("pack_days must be a whole number from 1 to 365");
    bad = true;
  }
  return bad;
}

function productTextProblems(rec: UntrustedRecord, issue: Issue, categorySlugs: Set<string>): boolean {
  let bad = false;
  if (!categorySlugs.has(str(rec, "categorySlug"))) {
    issue(`category "${str(rec, "categorySlug")}" isn't in Categories`);
    bad = true;
  }
  for (const f of ["packSize", "shortBenefit"] as const) {
    if (!str(rec, f)) {
      issue(`${f} is required`);
      bad = true;
    }
  }
  if (!paragraphs(rec, "description").length || !list(rec, "howToUse", "\n").length || !list(rec, "imageIds").length) {
    issue("description, how_to_use and image_ids are required");
    bad = true;
  }
  return bad;
}

function parseProducts(rows: UntrustedValue, c: Collector, categorySlugs: Set<string>): ParsedProduct[] {
  const out: ParsedProduct[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  eachRow(rows, (rec, i) => {
    const loc = at(TAB.products, i, str(rec, "id"));
    if (!loc.id || !str(rec, "name")) {
      c.error(loc, "id and name are required");
      return;
    }
    const issue = (m: string) => c.error(loc, m);
    const slug = str(rec, "slug") || slugify(str(rec, "name"));
    let bad = false;
    for (const m of [mark(seenId, loc.id, "product_id"), mark(seenSlug, slug, "slug")]) {
      if (m) {
        issue(m);
        bad = true;
      }
    }
    if (productNumberProblems(rec, issue) || productTextProblems(rec, issue, categorySlugs)) bad = true;
    if (!bad) out.push(productItem(rec, loc.id, slug));
  });
  return out.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

function productItem(rec: UntrustedRecord, id: string, slug: string): ParsedProduct {
  const name = str(rec, "name");
  const packSize = str(rec, "packSize");
  const shortBenefit = str(rec, "shortBenefit").slice(0, 90);
  const seo = isRecord(rec.seo) ? rec.seo : {};
  return {
    id,
    slug,
    name,
    categorySlug: str(rec, "categorySlug"),
    priceNgn: typeof rec.priceNgn === "number" ? rec.priceNgn : null,
    packSize,
    packDays: optNum(rec, "packDays") ?? 0,
    inStock: bool(rec, "inStock"),
    featured: bool(rec, "featured"),
    sortOrder: optNum(rec, "sortOrder") ?? 999,
    shortBenefit,
    description: paragraphs(rec, "description"),
    ingredients: list(rec, "ingredients", "\n"),
    howToUse: list(rec, "howToUse", "\n"),
    nafdacNo: str(rec, "nafdacNo") || null,
    imageIds: list(rec, "imageIds").slice(0, 6),
    relatedIds: list(rec, "relatedIds"),
    faqs: parseFaqs(rec.faqs),
    seo: {title: str(seo, "title") || `${name} — ${packSize}`, description: str(seo, "description") || shortBenefit},
  };
}

function parseFaqs(raw: UntrustedValue): {question: string; answer: string}[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((f): f is UntrustedRecord => isRecord(f))
    .map((f) => ({question: str(f, "question"), answer: str(f, "answer")}))
    .filter((f) => f.question && f.answer);
}

/**
 * Parse + validate the wire payload (`{ok, catalog}` body or the bare catalog
 * fixture). Throws CatalogError listing every problem; returns a ParsedCatalog
 * whose image/poster refs still need resolving.
 */
export function parseCatalog(raw: UntrustedValue): ParsedCatalog {
  const root = isRecord(raw) && isRecord(raw.catalog) ? raw.catalog : raw;
  if (!isRecord(root)) throw new CatalogError(["catalog payload is not an object"]);
  const c = new Collector();
  const categories = parseCategories(root.categories, c);
  const categorySlugs = new Set(categories.map((x) => x.slug));
  const products = parseProducts(root.products, c, categorySlugs);
  if (products.length === 0) c.error({tab: TAB.products, row: 0, id: ""}, "Catalog has no active products");
  const catalog: ParsedCatalog = {
    source: str(root, "source") === "live" ? "live" : "fixture",
    generatedAt: str(root, "generatedAt") || new Date(0).toISOString(),
    products,
    categories,
    settings: parseSettings(root.settings),
    delivery: parseDelivery(root.delivery, c),
    seminars: parseSeminars(root.seminars, c),
    highlights: parseHighlights(root.highlights, c),
    videos: parseVideos(root.videos, c),
    stories: parseStories(root.stories, c),
    articles: parseArticles(root.articles, c, categorySlugs),
  };
  if (c.errors.length) throw new CatalogError(c.errors);
  return catalog;
}
