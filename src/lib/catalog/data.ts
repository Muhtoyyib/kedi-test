// The generated catalog singleton. src/generated/catalog.json is written by
// `vp run catalog:fetch` (fixture by default, live on deploy). Pages must read
// through the helpers in this directory, not the JSON directly.

import raw from "../../generated/catalog.json";
import type {Catalog} from "./types.ts";

export const catalog = raw as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}
