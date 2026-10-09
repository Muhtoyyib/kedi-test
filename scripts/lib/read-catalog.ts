import {existsSync, readFileSync} from "node:fs";
import path from "node:path";

// Minimal catalog shape needed to derive prerender paths and mark the data
// source. Change 04 replaces this with the full parsed Catalog type.
export interface CatalogPaths {
  source: "live" | "fixture";
  products: {slug: string}[];
  categories: {slug: string}[];
}

const GENERATED = path.resolve(import.meta.dirname, "../../src/generated/catalog.json");
const FIXTURE = path.resolve(import.meta.dirname, "../fixtures/catalog.fixture.json");

export function readCatalog(): CatalogPaths {
  const file = existsSync(GENERATED) ? GENERATED : FIXTURE;
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<CatalogPaths>;
  return {
    source: parsed.source === "live" ? "live" : "fixture",
    products: Array.isArray(parsed.products) ? parsed.products : [],
    categories: Array.isArray(parsed.categories) ? parsed.categories : [],
  };
}
