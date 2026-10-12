// The visitor's own referral code, remembered on this device only
// (refer/get-your-code design): {firstName, code} — never the phone number.

import type {UntrustedValue} from "@/lib/untrusted";
import {isRecord} from "@/lib/untrusted";

export const MY_REFERRAL_KEY = "my-referral:v1";

export interface MyReferral {
  firstName: string;
  code: string;
}

/** Parses the raw stored value — null when missing or malformed. */
export function parseMyReferral(raw: string | null): MyReferral | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as UntrustedValue;
    if (!isRecord(parsed)) return null;
    if (typeof parsed.firstName !== "string" || typeof parsed.code !== "string") return null;
    return {firstName: parsed.firstName, code: parsed.code};
  } catch {
    return null;
  }
}

export function loadMyReferral(
  storage: Pick<Storage, "getItem"> | null = typeof window === "undefined" ? null : window.localStorage
): MyReferral | null {
  try {
    return parseMyReferral(storage?.getItem(MY_REFERRAL_KEY) ?? null);
  } catch {
    return null;
  }
}

export function saveMyReferral(
  mine: MyReferral,
  storage: Pick<Storage, "setItem"> | null = typeof window === "undefined" ? null : window.localStorage
): void {
  try {
    storage?.setItem(MY_REFERRAL_KEY, JSON.stringify(mine));
  } catch {
    // private mode — the code still works this session
  }
}

export function clearMyReferral(
  storage: Pick<Storage, "removeItem"> | null = typeof window === "undefined" ? null : window.localStorage
): void {
  try {
    storage?.removeItem(MY_REFERRAL_KEY);
  } catch {
    // ignore
  }
}
