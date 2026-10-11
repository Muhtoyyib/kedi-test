// Personal referral codes — deterministic from first name + last 4 phone
// digits (spec: referrals/code-generation). No server lookup needed.

export const REFERRAL_CODE_RE = /^[A-Z]{2,12}-\d{4}[A-Z]?$/;

const FALLBACK_NAME = "FRIEND";

/** First name → uppercase Latin letters only, ≤ 12, or "FRIEND". */
function namePart(firstName: string): string {
  const letters = firstName
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 12);
  return letters.length >= 2 ? letters : FALLBACK_NAME;
}

/** Same name + number always produce the same code. */
export function createReferralCode(firstName: string, phone: string): string {
  return `${namePart(firstName)}-${phone.replace(/\D/g, "").slice(-4)}`;
}

/** Trimmed, uppercase code for comparison/storage. */
export function normalizeReferralCode(input: string): string {
  return input.trim().toUpperCase();
}

export function isValidReferralCode(input: string): boolean {
  return REFERRAL_CODE_RE.test(normalizeReferralCode(input));
}
