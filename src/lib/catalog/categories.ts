// Category helpers — backed by the slim shell data so the eager layout (footer
// nav, mobile menu) never pulls the full product catalog into its bundle.

import {shell} from "./shell-data.ts";
import type {Catalog, Category} from "./types.ts";

export function getCategories(cat: Pick<Catalog, "categories"> = shell): Category[] {
  return [...cat.categories].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function getCategory(slug: string, cat: Pick<Catalog, "categories"> = shell): Category | undefined {
  return cat.categories.find((c) => c.slug === slug);
}
