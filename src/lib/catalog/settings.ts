// Settings + delivery helpers.

import {catalog} from "./data.ts";
import type {Catalog, DeliveryArea, Settings} from "./types.ts";

export function getSettings(cat: Catalog = catalog): Settings {
  return cat.settings;
}

export function getDeliveryAreas(cat: Catalog = catalog): DeliveryArea[] {
  return cat.delivery;
}
