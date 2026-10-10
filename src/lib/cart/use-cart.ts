// useCart — the hook every cart UI reads. Memoised over the storage snapshot
// and catalog; mutations prune stale product IDs first (spec: pruned on the
// next write).

import {useMemo, useSyncExternalStore} from "react";
import {catalog as defaultCatalog} from "@/lib/catalog/data";
import type {Catalog} from "@/lib/catalog/types";
import type {CartResult} from "./reducer";
import {selectHasAskPrice, selectLines, selectRemovedProducts, selectCount, selectSubtotal, type PricedLine} from "./selectors";
import {cartStore, dispatch} from "./store";

export interface CartApi {
  lines: PricedLine[];
  count: number;
  subtotalNgn: number;
  hasAskPrice: boolean;
  removedIds: string[];
  add: (productId: string, qty?: number) => CartResult;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export function useCart(cat: Catalog = defaultCatalog): CartApi {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);

  return useMemo(() => {
    const lines = selectLines(cart, cat);
    const removedIds = selectRemovedProducts(cart, cat);
    const prune = () => {
      for (const id of removedIds) dispatch({type: "remove", productId: id});
    };
    return {
      lines,
      count: selectCount(lines),
      subtotalNgn: selectSubtotal(lines),
      hasAskPrice: selectHasAskPrice(lines),
      removedIds,
      add: (productId: string, qty?: number) => {
        prune();
        return dispatch({type: "add", productId, qty});
      },
      setQty: (productId: string, qty: number) => {
        prune();
        dispatch({type: "setQty", productId, qty});
      },
      remove: (productId: string) => {
        prune();
        dispatch({type: "remove", productId});
      },
      clear: () => {
        prune();
        dispatch({type: "clear"});
      },
    };
  }, [cart, cat]);
}

/** Imperative add for non-hook callers (tests, drawer helpers). */
export const addToCart = (productId: string, qty = 1): CartResult => dispatch({type: "add", productId, qty});
