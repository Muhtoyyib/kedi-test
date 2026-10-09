// Referral code registry (form-intake spec). One row per code + phone; a code
// claimed by a second phone is stored flagged duplicate for the distributor.

import {normalizeNigerianPhone} from "./phone.ts";
import {TABS} from "./schema.ts";
import type {Store} from "./store.ts";
import {str, toDateStr, type Cell} from "./table.ts";

export interface ReferralPayload {
  firstName: string;
  phone: string; // normalised
  code: string;
}

const CODE = /^[A-Z0-9-]{4,24}$/;

export function parseReferralPayload(raw: unknown): ReferralPayload | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Record<string, unknown>;
  const phone = normalizeNigerianPhone(str(p.phone as Cell));
  const firstName = str(p.firstName as Cell);
  const code = str(p.code as Cell).toUpperCase();
  if (!phone || !firstName || firstName.length > 100 || !CODE.test(code)) return null;
  return {firstName, phone, code};
}

export function registerReferralCode(store: Store, payload: ReferralPayload, now: Date): {ok: true} {
  const referrals = store.table(TABS.referrals);
  const same = referrals.rows.filter((r) => str(r.rec.code).toUpperCase() === payload.code);
  if (same.some((r) => str(r.rec.referrer_phone) === payload.phone)) return {ok: true};
  store.append(TABS.referrals, {
    code: payload.code,
    referrer_name: payload.firstName,
    referrer_phone: payload.phone,
    created_at: toDateStr(now),
    reward_status: "Pending",
    duplicate_flag: same.length ? "Yes" : "No",
  });
  return {ok: true};
}
