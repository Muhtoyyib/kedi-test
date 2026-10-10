// External cart store: localStorage["cart:v1"], synced across tabs via the
// storage event, memoised snapshot for useSyncExternalStore, deterministic
// empty snapshot during prerender.

import type {StorageLike} from "@/lib/announcement";
import {cartReducer, type CartResult} from "./reducer";
import {emptyCart, CART_MAX_LINES, CART_MAX_QTY, type Cart, type CartAction} from "./types";

export const CART_KEY = "cart:v1";

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedCart: Cart = emptyCart;

function storage(): StorageLike | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

/** Parses stored JSON; on any problem returns an empty cart. */
export function parseCart(raw: string | null): Cart {
  if (!raw) return emptyCart;
  try {
    const parsed = JSON.parse(raw) as Partial<Cart>;
    if (parsed.version !== 1 || !Array.isArray(parsed.lines)) return emptyCart;
    const lines = parsed.lines.filter(
      (l): l is Cart["lines"][number] =>
        typeof l === "object" &&
        l !== null &&
        typeof l.productId === "string" &&
        l.productId.length > 0 &&
        Number.isInteger(l.qty) &&
        l.qty >= 1 &&
        l.qty <= CART_MAX_QTY
    );
    return {version: 1, lines: lines.slice(0, CART_MAX_LINES)};
  } catch {
    return emptyCart;
  }
}

function getSnapshot(): Cart {
  const raw = storage()?.getItem(CART_KEY) ?? null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedCart = parseCart(raw);
  }
  return cachedCart;
}

function getServerSnapshot(): Cart {
  return emptyCart;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function dispatch(action: CartAction): CartResult {
  const store = storage();
  if (!store) return "ok";
  const {cart, result} = cartReducer(getSnapshot(), action);
  if (result === "ok") {
    const raw = JSON.stringify(cart);
    store.setItem(CART_KEY, raw);
    cachedRaw = raw;
    cachedCart = cart;
  }
  for (const listener of listeners) listener();
  return result;
}

/** Clears the cart — used after a confirmed send. */
export function clearCart(): void {
  dispatch({type: "clear"});
}

/** Reads the raw cart for hashing (return-from-WhatsApp detection). */
export function cartFingerprint(): string {
  return storage()?.getItem(CART_KEY) ?? "";
}

export const cartStore = {subscribe, getSnapshot, getServerSnapshot};
