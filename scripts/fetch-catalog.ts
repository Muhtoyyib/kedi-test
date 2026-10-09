// Orchestrates catalog fetch → validate → images → write:
//
//   CATALOG_SOURCE=fixture (default): parse scripts/fixtures/catalog.fixture.json,
//     serve images from scripts/fixtures/images/, posters from a local stub.
//   CATALOG_SOURCE=live: fetch ?action=catalog from the Apps Script web app
//     (APPS_SCRIPT_URL + CATALOG_READ_TOKEN env vars), then ?action=image /
//     doc_image for media.
//
// Failure policy (design §6):
//   endpoint unreachable/non-200  → local dev: keep previous catalog.json with a
//                                   loud warning; CI: fail.
//   validation/compliance errors  → always fail, listing every problem.
//   one image fails               → reuse the cached copy if present, else fail.
//   no active products            → fail ("Catalog has no active products").
//   video poster unavailable      → branded placeholder + warning.

import {existsSync, mkdirSync} from "node:fs";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import type {Catalog} from "../src/lib/catalog/types.ts";
import {isRecord, readString, type UntrustedValue} from "../src/lib/untrusted.ts";
import {checkCompliance} from "./lib/compliance.ts";
import {ImageCache} from "./lib/image-cache.ts";
import {fixtureFetcher, liveFetcher, mediaResolver, type ImageFetcher} from "./lib/image-fetchers.ts";
import {CatalogError} from "./lib/parsed-types.ts";
import {parseCatalog} from "./lib/parse-catalog.ts";
import {collectImages, resolveCatalogImages} from "./lib/resolve-content.ts";

const root = path.resolve(import.meta.dirname, "..");
const GENERATED = path.join(root, "src/generated");
const CATALOG_OUT = path.join(GENERATED, "catalog.json");
const IMAGES_OUT = path.join(GENERATED, "images.json");
const FIXTURE = path.join(root, "scripts/fixtures/catalog.fixture.json");
const FIXTURE_IMAGES = path.join(root, "scripts/fixtures/images");
const CACHE_FILE = path.join(root, ".cache/images.json");

const isCI = Boolean(process.env.CI);
const live = (process.env.CATALOG_SOURCE ?? "fixture") === "live";
const warnings: string[] = [];

function fail(lines: string[]): never {
  for (const line of lines) console.error(`catalog: ${line}`);
  process.exit(1);
}

async function fetchLiveWire(): Promise<UntrustedValue> {
  const endpoint = process.env.APPS_SCRIPT_URL;
  const token = process.env.CATALOG_READ_TOKEN;
  if (!endpoint || !token) fail(["CATALOG_SOURCE=live needs APPS_SCRIPT_URL and CATALOG_READ_TOKEN in the environment"]);
  const sep = endpoint.includes("?") ? "&" : "?";
  const res = await fetch(`${endpoint}${sep}action=catalog&token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(`catalog endpoint returned HTTP ${res.status}`);
  const body: UntrustedValue = await res.json();
  if (!isRecord(body) || body.ok !== true || !isRecord(body.catalog)) {
    const msg = isRecord(body) ? readString(body, "message") : null;
    throw new Error(msg ?? "catalog endpoint returned an unexpected response");
  }
  return body.catalog;
}

/** id → slug for products + articles in the previously generated catalog. */
async function previousSlugs(): Promise<Map<string, string> | null> {
  if (!existsSync(CATALOG_OUT)) return null;
  try {
    const parsed: UntrustedValue = JSON.parse(await readFile(CATALOG_OUT, "utf8"));
    if (!isRecord(parsed)) return null;
    const slugs = new Map<string, string>();
    for (const section of ["products", "articles"] as const) collectSlugs(parsed[section], slugs);
    return slugs;
  } catch {
    return null;
  }
}

function collectSlugs(rows: UntrustedValue, slugs: Map<string, string>): void {
  if (!Array.isArray(rows)) return;
  for (const row of rows) {
    const id = isRecord(row) ? readString(row, "id") : null;
    const slug = isRecord(row) ? readString(row, "slug") : null;
    if (id && slug) slugs.set(id, slug);
  }
}

/** Warn when a kept item's URL slug changed — old links will 404. */
function warnSlugChanges(prev: Map<string, string> | null, next: Catalog): void {
  if (!prev) return;
  for (const item of [...next.products, ...next.articles]) {
    const before = prev.get(item.id);
    if (before && before !== item.slug) warnings.push(`slug changed for ${item.id}: "${before}" → "${item.slug}" — old URLs will 404`);
  }
}

interface Inputs {
  wire: UntrustedValue;
  fetcher: ImageFetcher;
}

/** Load wire JSON + the right fetcher. Returns null when live fetch fails in
 * local dev and a previous generated catalog exists (policy table). */
async function loadInputs(): Promise<Inputs | null> {
  if (!live) {
    const wire = JSON.parse(await readFile(FIXTURE, "utf8")) as UntrustedValue;
    return {wire, fetcher: fixtureFetcher(FIXTURE_IMAGES, warnings)};
  }
  try {
    const wire = await fetchLiveWire();
    return {
      wire,
      fetcher: liveFetcher(process.env.APPS_SCRIPT_URL as string, process.env.CATALOG_READ_TOKEN as string, warnings),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (isCI || !existsSync(CATALOG_OUT)) fail([`live catalog fetch failed: ${msg}`]);
    console.warn(`catalog: WARNING — live fetch failed (${msg}); keeping the previous generated catalog.json`);
    return null;
  }
}

async function writeOutputs(catalog: Catalog): Promise<void> {
  mkdirSync(GENERATED, {recursive: true});
  await writeFile(CATALOG_OUT, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  await writeFile(IMAGES_OUT, `${JSON.stringify(collectImages(catalog), null, 2)}\n`, "utf8");
}

function report(catalog: Catalog): void {
  for (const w of warnings) console.warn(`catalog: warning: ${w}`);
  console.log(
    `catalog: wrote ${catalog.products.length} products, ${catalog.categories.length} categories, ` +
      `${catalog.articles.length} articles, ${catalog.stories.length} stories (source: ${catalog.source})`
  );
}

async function main(): Promise<void> {
  const inputs = await loadInputs();
  if (!inputs) return;

  let parsed;
  try {
    parsed = parseCatalog(inputs.wire);
  } catch (err) {
    if (err instanceof CatalogError) fail(["catalog validation failed:", ...err.errors.map((e) => `  ${e}`)]);
    throw err;
  }

  const violations = checkCompliance(parsed);
  if (violations.length) fail(["compliance check failed:", ...violations.map((v) => `  ${v}`)]);

  const cache = await ImageCache.load(CACHE_FILE);
  const catalog = await resolveCatalogImages(parsed, mediaResolver(inputs.fetcher, cache, warnings));
  await cache.save();
  warnSlugChanges(await previousSlugs(), catalog);
  await writeOutputs(catalog);
  report(catalog);
}

await main();
