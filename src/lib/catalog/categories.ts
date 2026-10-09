// Category helpers.

import {catalog} from "./data.ts";
import {getProducts} from "./products.ts";
import type {Catalog, Category, Product} from "./types.ts";

export function getCategories(cat: Catalog = catalog): Category[] {
  return [...cat.categories].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function getCategory(slug: string, cat: Catalog = catalog): Category | undefined {
  return cat.categories.find((c) => c.slug === slug);
}

/** Products in a category, grid-ordered (in-stock first, then sort order + name). */
export function getProductsByCategory(slug: string, cat: Catalog = catalog): Product[] {
  return getProducts(cat).filter((p) => p.categorySlug === slug);
}
