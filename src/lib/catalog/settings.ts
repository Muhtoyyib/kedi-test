// Settings + delivery helpers. Defaults read the slim shell data (settings,
// categories, delivery only) so the eager layout bundle never pulls the full
// product catalog — callers holding a full Catalog can still pass it.

import {shell} from "./shell-data.ts";
import type {Catalog, DeliveryArea, Settings} from "./types.ts";

export function getSettings(cat: Pick<Catalog, "settings"> = shell): Settings {
  return cat.settings;
}

export function getDeliveryAreas(cat: Pick<Catalog, "delivery"> = shell): DeliveryArea[] {
  return cat.delivery;
}
