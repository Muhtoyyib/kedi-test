// Pending-order marker for the return-from-WhatsApp banner. Written on send;
// sessionStorage first (survives the same-tab navigation), with a
// localStorage copy for when Android kills the tab. Expires after 24 h.

const SESSION_KEY = "pending-order:v1";
const LAST_KEY = "pending-order:last";
export const PENDING_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface PendingOrder {
  orderId: string;
  at: number;
  cartHash: string;
  /** The full WhatsApp message, so "Open WhatsApp again" needs no rebuild. */
  message: string;
}

interface StorageLike {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
}

/** Stable fingerprint of the cart's contents — changes when the cart does. */
export function cartHash(lines: {productId: string; qty: number}[]): string {
  return lines.map((l) => `${l.productId}:${l.qty}`).join(",");
}

export function savePending(
  order: PendingOrder,
  session: StorageLike | null = typeof window === "undefined" ? null : window.sessionStorage,
  local: StorageLike | null = typeof window === "undefined" ? null : window.localStorage
): void {
  const raw = JSON.stringify(order);
  try {
    session?.setItem(SESSION_KEY, raw);
  } catch {
    // storage may be full/blocked — localStorage copy still helps
  }
  try {
    local?.setItem(LAST_KEY, raw);
  } catch {
    // as above
  }
  cached = undefined;
}

export function readPending(
  now: number = Date.now(),
  session: StorageLike | null = typeof window === "undefined" ? null : window.sessionStorage,
  local: StorageLike | null = typeof window === "undefined" ? null : window.localStorage
): PendingOrder | null {
  return read(session, SESSION_KEY, now) ?? read(local, LAST_KEY, now);
}

export function clearPending(
  session: StorageLike | null = typeof window === "undefined" ? null : window.sessionStorage,
  local: StorageLike | null = typeof window === "undefined" ? null : window.localStorage
): void {
  session?.removeItem(SESSION_KEY);
  local?.removeItem(LAST_KEY);
  cached = undefined;
}

// useSyncExternalStore wiring for the return banner. The snapshot is cached
// because readPending returns a fresh object per call; it is invalidated by
// writes above and by the events below.
let cached: PendingOrder | null | undefined;

export function pendingSnapshot(): PendingOrder | null {
  if (cached === undefined) cached = readPending();
  return cached ?? null;
}

/** Re-reads on bfcache restore (pageshow persisted) and tab re-focus. */
export function subscribePending(listener: () => void): () => void {
  const fire = () => {
    cached = undefined;
    listener();
  };
  const onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted) fire();
  };
  const onVisible = () => {
    if (document.visibilityState === "visible") fire();
  };
  window.addEventListener("pageshow", onPageShow);
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.removeEventListener("pageshow", onPageShow);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

function read(storage: StorageLike | null, key: string, now: number): PendingOrder | null {
  try {
    const raw = JSON.parse(storage?.getItem(key) ?? "null") as Partial<PendingOrder> | null;
    if (!raw || typeof raw.orderId !== "string" || typeof raw.at !== "number" || typeof raw.message !== "string") return null;
    if (now - raw.at > PENDING_MAX_AGE_MS) return null;
    return {orderId: raw.orderId, at: raw.at, cartHash: raw.cartHash ?? "", message: raw.message};
  } catch {
    return null;
  }
}
