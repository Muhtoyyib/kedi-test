// Form intake — contact, business_interest and seminar_interest all upsert
// into Leads & Customers by phone (design §2, form-intake spec). Consent is
// required; a missing/false consent rejects the submission outright.

import {normalizeNigerianPhone} from "./phone.ts";
import {TABS} from "./schema.ts";
import type {Store} from "./store.ts";
import {findRow, str, toDateStr, type Cell} from "./table.ts";

export type FormKind = "contact" | "business_interest" | "seminar_interest";

const SOURCES: Record<FormKind, string> = {
  contact: "contact_form",
  business_interest: "business_form",
  seminar_interest: "seminar_form",
};

const MAX_FIELD = 500;
const MAX_MESSAGE = 2000;

export interface FormPayload {
  kind: FormKind;
  name: string;
  phone: string; // normalised
  email: string;
  message: string;
  location: string;
  occupation: string;
  consentAt: string | null;
}

/** Validate + normalise a form payload. consent must be exactly true. */
export function parseFormPayload(kind: FormKind, raw: unknown): FormPayload | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Record<string, unknown>;
  if (p.consent !== true) return null;
  const phone = normalizeNigerianPhone(str(p.phone as Cell));
  const name = str(p.name as Cell);
  if (!phone || !name || name.length > MAX_FIELD) return null;
  return {
    kind,
    name,
    phone,
    email: str(p.email as Cell).slice(0, 200),
    message: str(p.message as Cell).slice(0, MAX_MESSAGE),
    location: str(p.location as Cell).slice(0, MAX_FIELD),
    occupation: str(p.occupation as Cell).slice(0, MAX_FIELD),
    consentAt: null,
  };
}

export function recordForm(store: Store, payload: FormPayload, now: Date): {ok: true} {
  const today = toDateStr(now);
  const leads = store.table(TABS.leads);
  const existing = findRow(leads, "phone", payload.phone);
  const interest = interestFor(payload);
  if (!existing) {
    store.append(TABS.leads, {
      phone: payload.phone,
      name: payload.name,
      area: payload.location,
      source: SOURCES[payload.kind],
      interest,
      status: "New Lead",
      business_interest: payload.kind === "business_interest" ? "Yes" : "No",
      consent: "Yes",
      consent_at: today,
      date_added: today,
      last_contact: today,
      order_count: 0,
      notes: noteFor(payload),
    });
    return {ok: true};
  }
  const patch: Record<string, Cell> = {last_contact: today};
  if (!str(existing.rec.name)) patch.name = payload.name;
  if (!str(existing.rec.area) && payload.location) patch.area = payload.location;
  if (!str(existing.rec.interest)) patch.interest = interest;
  if (payload.kind === "business_interest") patch.business_interest = "Yes";
  if (!str(existing.rec.consent)) {
    patch.consent = "Yes";
    patch.consent_at = today;
  }
  const note = noteFor(payload);
  if (note) patch.notes = [str(existing.rec.notes), note].filter(Boolean).join("\n").slice(0, 4000);
  store.patch(TABS.leads, existing.row, patch);
  return {ok: true};
}

function interestFor(p: FormPayload): string {
  if (p.kind === "business_interest") return "Business opportunity";
  if (p.kind === "seminar_interest") return "Seminar";
  return "General enquiry";
}

function noteFor(p: FormPayload): string {
  const bits = [p.message, p.occupation && `Occupation: ${p.occupation}`, p.email && `Email: ${p.email}`].filter(Boolean);
  return bits.join(" · ");
}
