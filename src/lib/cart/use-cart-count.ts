// Catalog-free cart count for the header badge — keeps the generated catalog
// out of the eager bundle (full lines come with the lazy drawer chunk).

import {useSyncExternalStore} from "react";
import {cartStore} from "./store";

export function useCartCount(): number {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  return cart.lines.reduce((n, l) => n + l.qty, 0);
}
