// Highlight helpers — newest first.

import {catalog} from "./data.ts";
import type {Catalog, Highlight} from "./types.ts";

export function getHighlights(limit?: number, cat: Catalog = catalog): Highlight[] {
  const sorted = [...cat.highlights].sort((a, b) => (a.date < b.date ? 1 : -1));
  return limit === undefined ? sorted : sorted.slice(0, limit);
}
