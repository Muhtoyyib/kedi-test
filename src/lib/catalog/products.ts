// Product selection and ordering helpers (catalog/access spec).

import {catalog} from "./data.ts";
import type {Catalog, Product} from "./types.ts";

/** Out-of-stock sorts after in-stock, then sortOrder, then name A–Z. */
const gridOrder = (a: Product, b: Product) =>
  Number(b.inStock) - Number(a.inStock) || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);

export function getProducts(cat: Catalog = catalog): Product[] {
  return [...cat.products].sort(gridOrder);
}

export function getProduct(slug: string, cat: Catalog = catalog): Product | undefined {
  return cat.products.find((p) => p.slug === slug);
}

/** Products in one category, in storefront order. */
export function getProductsByCategory(slug: string, cat: Catalog = catalog): Product[] {
  return getProducts(cat).filter((p) => p.categorySlug === slug);
}

/**
 * Featured products first (grid order). If fewer than 4 are featured, fill to
 * 4 with in-stock products. Capped at `limit` (home shows up to 4 by default).
 */
export function getFeaturedProducts(limit = 4, cat: Catalog = catalog): Product[] {
  const all = getProducts(cat);
  const featured = all.filter((p) => p.featured);
  const fill = featured.length < 4 ? all.filter((p) => !p.featured && p.inStock).slice(0, 4 - featured.length) : [];
  return [...featured, ...fill].slice(0, limit);
}

/**
 * 1. the sheet's relatedIds in order (missing ids skipped);
 * 2. same-category products, excluding the current product;
 * 3. everything else by grid order — at most `limit`.
 */
export function getRelatedProducts(product: Product, limit = 4, cat: Catalog = catalog): Product[] {
  const byId = new Map(cat.products.map((p) => [p.id, p]));
  const chosen: Product[] = [];
  const take = (p: Product | undefined) => {
    if (p && p.id !== product.id && !chosen.includes(p)) chosen.push(p);
  };
  for (const id of product.relatedIds) take(byId.get(id));
  const rest = getProducts(cat).filter((p) => p.id !== product.id && !chosen.includes(p));
  for (const p of rest.filter((p) => p.categorySlug === product.categorySlug)) take(p);
  for (const p of rest) take(p);
  return chosen.slice(0, limit);
}
