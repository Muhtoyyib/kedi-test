import {existsSync, readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import type {UntrustedValue} from "../../src/lib/untrusted.ts";

// Minimal catalog shape needed to derive prerender paths and mark the data
// source — src/generated/catalog.json when present, else the fixture.
export interface CatalogPaths {
  source: "live" | "fixture";
  products: {slug: string}[];
  categories: {slug: string}[];
  articles: {slug: string}[];
}

const GENERATED = path.resolve(import.meta.dirname, "../../src/generated/catalog.json");
const SHELL_OUT = path.resolve(import.meta.dirname, "../../src/generated/shell.json");
const FIXTURE = path.resolve(import.meta.dirname, "../fixtures/catalog.fixture.json");

// shell.json feeds the eager shell bundle; write it when an older fetch left
// only catalog.json so devs don't need to re-run catalog:fetch.
function ensureShellJson(parsed: Partial<CatalogPaths> & {settings?: UntrustedValue; delivery?: UntrustedValue}): void {
  if (!existsSync(GENERATED) || existsSync(SHELL_OUT)) return;
  const shell = {settings: parsed.settings, categories: parsed.categories, delivery: parsed.delivery};
  writeFileSync(SHELL_OUT, `${JSON.stringify(shell, null, 2)}\n`, "utf8");
}

export function readCatalog(): CatalogPaths {
  const file = existsSync(GENERATED) ? GENERATED : FIXTURE;
  const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<CatalogPaths> & {
    settings?: UntrustedValue;
    delivery?: UntrustedValue;
  };
  ensureShellJson(parsed);
  return {
    source: parsed.source === "live" ? "live" : "fixture",
    products: Array.isArray(parsed.products) ? parsed.products : [],
    categories: Array.isArray(parsed.categories) ? parsed.categories : [],
    articles: Array.isArray(parsed.articles) ? parsed.articles : [],
  };
}

const ROUTE_CANDIDATES = (prefix: string, param: string): string[] =>
  [`src/routes/${prefix}/$${param}.tsx`, `src/routes/${prefix}.$${param}.tsx`].map((p) => path.resolve(import.meta.dirname, "../..", p));

const hasRoute = (prefix: string, param: string): boolean => ROUTE_CANDIDATES(prefix, param).some(existsSync);

/**
 * Catalog-driven prerender paths — /products/{slug}, /shop/{category},
 * /learn/{slug}. Each prefix is only included once its route exists (the page
 * changes land later); failOnError would otherwise break the build.
 */
export function catalogPrerenderPaths(catalog: CatalogPaths): string[] {
  const paths: string[] = [];
  if (hasRoute("products", "slug")) paths.push(...catalog.products.map((p) => `/products/${p.slug}`));
  if (hasRoute("shop", "category")) paths.push(...catalog.categories.map((c) => `/shop/${c.slug}`));
  if (hasRoute("learn", "slug")) paths.push(...catalog.articles.map((a) => `/learn/${a.slug}`));
  return paths;
}
