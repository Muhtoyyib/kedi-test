// Order-details validation and remembered-details persistence
// (sections/04-order-details-form). Referral codes use the change-06 format.

import {normalizeNigerianPhone} from "@/lib/phone";
import {REFERRAL_CODE_RE} from "@/lib/referral/code";

export const OTHER_AREA = "__other__";
const DETAILS_KEY = "order-details:v1";

export interface OrderDetails {
  name: string;
  phone: string;
  area: string; // delivery area name, or OTHER_AREA for "Other (we'll confirm)"
  areaOther: string;
  referralCode: string;
  followupConsent: boolean;
  company: string; // honeypot — must stay empty
}

export type DetailsField = "name" | "phone" | "area" | "areaOther" | "referralCode";
export type DetailsErrors = Partial<Record<DetailsField, string>>;

export const emptyDetails: OrderDetails = {
  name: "",
  phone: "",
  area: "",
  areaOther: "",
  referralCode: "",
  followupConsent: false,
  company: "",
};

export interface ValidatedDetails {
  errors: DetailsErrors;
  /** Normalised E.164 phone, when valid. */
  phoneE164: string | null;
}

type Validator = (d: OrderDetails) => string | null;

const VALIDATORS: Record<DetailsField, Validator> = {
  name: (d) => {
    const name = d.name.trim();
    return name.length < 2 || name.length > 60 || !/\p{L}/u.test(name) ? "Enter your name so we know who's ordering" : null;
  },
  phone: (d) => (normalizeNigerianPhone(d.phone) ? null : "Enter a Nigerian mobile number, e.g. 0803 123 4567"),
  area: (d) => (d.area ? null : "Choose where we should deliver"),
  areaOther: (d) => {
    if (d.area !== OTHER_AREA) return null;
    const other = d.areaOther.trim();
    return other.length < 2 || other.length > 80 ? "Tell us your area" : null;
  },
  referralCode: (d) => {
    const code = d.referralCode.trim();
    return code && !REFERRAL_CODE_RE.test(code) ? "This code doesn't look right. Check it or leave it empty." : null;
  },
};

export function validateDetails(d: OrderDetails): ValidatedDetails {
  const errors: DetailsErrors = {};
  for (const field of Object.keys(VALIDATORS) as DetailsField[]) {
    const message = VALIDATORS[field](d);
    if (message) errors[field] = message;
  }
  return {errors, phoneE164: normalizeNigerianPhone(d.phone)};
}

export const hasErrors = (errors: DetailsErrors): boolean => Object.keys(errors).length > 0;

// Remembered details — name, phone, area, areaOther only. Consent is never
// remembered (always unticked) and the referral code is not stored here.
export interface SavedDetails {
  name: string;
  phone: string;
  area: string;
  areaOther: string;
}

interface StorageLike {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
}

export function saveDetails(details: SavedDetails, storage: StorageLike | null = defaultStorage()): void {
  storage?.setItem(DETAILS_KEY, JSON.stringify(details));
}

export function loadDetails(storage: StorageLike | null = defaultStorage()): SavedDetails | null {
  try {
    const raw = JSON.parse(storage?.getItem(DETAILS_KEY) ?? "null") as Partial<SavedDetails> | null;
    if (!raw || typeof raw.name !== "string" || typeof raw.phone !== "string") return null;
    return {name: raw.name, phone: raw.phone, area: raw.area ?? "", areaOther: raw.areaOther ?? ""};
  } catch {
    return null;
  }
}

export function clearDetails(storage: StorageLike | null = defaultStorage()): void {
  storage?.removeItem(DETAILS_KEY);
}

function defaultStorage(): StorageLike | null {
  return typeof window === "undefined" ? null : window.localStorage;
}
