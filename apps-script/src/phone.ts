// Nigerian mobile normalisation — kept identical to the site's
// src/lib/phone.ts so browser and backend agree. Accepted inputs:
// 08031234567, 8031234567, +2348031234567, 2348031234567 (+ spaced/dashed).
// Stored as E.164.

// Mobile national significant numbers start with 70, 80, 81, 90 or 91.
const MOBILE_PREFIXES = ["70", "80", "81", "90", "91"];

export function normalizeNigerianPhone(input: string): string | null {
  const digits = input.replace(/[\s().-]/g, "").replace(/^\+/, "");
  const national = digits.startsWith("234") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;

  if (!/^\d{10}$/.test(national)) return null;
  if (!MOBILE_PREFIXES.includes(national.slice(0, 2))) return null;
  return `+234${national}`;
}
