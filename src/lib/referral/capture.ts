// Referral capture — ?ref=CODE on any page is stored for 30 days, stripped
// from the address bar, and tracked as referral_landing.

import {track} from "@/lib/analytics/track";
import {isValidReferralCode, normalizeReferralCode} from "./code.ts";

export const REFERRAL_KEY = "ref:v1";
export const REFERRAL_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface StorageLike {
  getItem: (k: string) => string | null;
  setItem?: (k: string, v: string) => void;
  removeItem: (k: string) => void;
}

interface CaptureInput {
  location: {search: string; pathname: string; hash: string};
  storage: StorageLike | null;
  history?: {replaceState: (data: null, title: string, url: string) => void};
  now?: number;
  trackLanding?: boolean;
}

function parseStored(raw: string | null): {code: string; at: number} | null {
  try {
    const parsed = JSON.parse(raw ?? "null") as {code?: string; at?: number} | null;
    return parsed && typeof parsed.code === "string" && typeof parsed.at === "number" ? {code: parsed.code, at: parsed.at} : null;
  } catch {
    return null;
  }
}

/** The stored referral code if fresh (≤ 30 days); null otherwise. */
export function getStoredReferralCode(
  storage: StorageLike | null = typeof window === "undefined" ? null : window.localStorage,
  now: number = Date.now()
): string | null {
  const stored = storage ? parseStored(storage.getItem(REFERRAL_KEY)) : null;
  if (!stored) return null;
  if (!isValidReferralCode(stored.code) || now - stored.at > REFERRAL_MAX_AGE_MS) {
    storage?.removeItem(REFERRAL_KEY);
    return null;
  }
  return stored.code;
}

/**
 * Run once after hydration on the root component: remembers a valid ?ref=
 * code (a newer link overrides an older one), tracks the landing, then
 * removes `ref` from the address bar keeping every other param. Returns the
 * captured code or null.
 */
export function captureReferralFromUrl(input: CaptureInput): string | null {
  const params = new URLSearchParams(input.location.search);
  const raw = params.get("ref");
  if (raw === null) return null;

  params.delete("ref");
  const search = params.toString();
  const url = `${input.location.pathname}${search ? `?${search}` : ""}${input.location.hash}`;
  input.history?.replaceState(null, "", url);

  if (!isValidReferralCode(raw)) return null;
  const code = normalizeReferralCode(raw);
  input.storage?.setItem?.(REFERRAL_KEY, JSON.stringify({code, at: input.now ?? Date.now()}));
  if (input.trackLanding !== false) track({event: "referral_landing"});
  return code;
}
