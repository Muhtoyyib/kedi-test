// Cookie-consent state (sections/06-cookie-consent). The choice is stored
// for 182 days; change 07's analytics loader subscribes to onConsentChange
// and only loads scripts when getConsent returns true.

import type {StorageLike} from "./announcement";

export const CONSENT_KEY = "cookie-consent";
const TTL_MS = 182 * 24 * 60 * 60 * 1000;
const EVENT = "kedi:consent-change";

interface ConsentChoice {
  analytics: boolean;
  at: number;
}

function read(storage: StorageLike): ConsentChoice | null {
  try {
    const raw = JSON.parse(storage.getItem(CONSENT_KEY) ?? "null") as ConsentChoice | null;
    if (raw && typeof raw.analytics === "boolean" && typeof raw.at === "number") return raw;
  } catch {
    // corrupt value → treated as no choice
  }
  return null;
}

/** true = accepted, false = declined, null = not asked yet or expired. */
export function getConsent(storage: StorageLike, now: number): boolean | null {
  const c = read(storage);
  if (!c || now - c.at >= TTL_MS) return null;
  return c.analytics;
}

export function setConsent(storage: StorageLike, analytics: boolean, now: number): void {
  storage.setItem(CONSENT_KEY, JSON.stringify({analytics, at: now} satisfies ConsentChoice));
  emitConsentChange();
}

export function clearConsent(storage: StorageLike): void {
  storage.removeItem(CONSENT_KEY);
  emitConsentChange();
}

export function onConsentChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

function emitConsentChange(): void {
  window.dispatchEvent(new Event(EVENT));
}

/** Removes analytics cookies on this domain after consent is withdrawn. */
export function clearAnalyticsCookies(doc: Document): void {
  const names = doc.cookie.split(";").map((part) => part.trim().split("=")[0]);
  for (const name of names) {
    if (/^(_ga|_fbp|_clck|_clsk)/.test(name)) {
      doc.cookie = `${name}=; Max-Age=0; path=/`;
      doc.cookie = `${name}=; Max-Age=0; path=/; domain=${doc.location.hostname}`;
    }
  }
}
