// Stored referral code (localStorage["ref:v1"] = {code, at}). The capture
// half — reading ?ref= and writing the key — lands in change
// 06-add-referral-tracking; until then this simply returns null when nothing
// was ever stored.

export const REFERRAL_KEY = "ref:v1";
export const REFERRAL_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const REFERRAL_CODE_RE = /^[A-Z]{2,12}-\d{4}[A-Z]?$/;

interface StorageLike {
  getItem: (k: string) => string | null;
  removeItem: (k: string) => void;
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
  if (!REFERRAL_CODE_RE.test(stored.code) || now - stored.at > REFERRAL_MAX_AGE_MS) {
    storage?.removeItem(REFERRAL_KEY);
    return null;
  }
  return stored.code;
}
