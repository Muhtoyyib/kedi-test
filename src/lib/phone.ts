// Nigerian mobile normalisation. Accepted inputs: 08031234567, 8031234567,
// +2348031234567, 2348031234567 (and spaced/dashed variants). Stored as E.164.

// Mobile national significant numbers start with 70, 80, 81, 90 or 91.
const MOBILE_PREFIXES = ["70", "80", "81", "90", "91"];

export function normalizeNigerianPhone(input: string): string | null {
  const digits = input.replace(/[\s().-]/g, "").replace(/^\+/, "");
  const national = digits.startsWith("234") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;

  if (!/^\d{10}$/.test(national)) return null;
  if (!MOBILE_PREFIXES.includes(national.slice(0, 2))) return null;
  return `+234${national}`;
}

// "+2348031234567" → "0803 123 4567" for display.
export function formatPhoneDisplay(e164: string): string {
  const national = normalizeNigerianPhone(e164)?.slice(4);
  if (!national) return e164;
  return `0${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
}
