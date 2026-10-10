// Campaign attribution (analytics/attribution spec). First touch wins for
// the session: the first landing URL carrying any utm_* parameter is stored
// and read back by order and form payloads.

import type {StorageLike} from "./announcement";

export const ATTRIBUTION_KEY = "attribution:v1";

export interface Attribution {
  source: string;
  medium: string;
  campaign: string;
  landing_path: string;
  at: number;
}

/** Records the first utm-carrying landing of the session; returns it. */
export function captureAttribution(url: string | URL, storage: StorageLike, now: number): Attribution | null {
  const existing = getAttribution(storage);
  if (existing) return existing;
  const params = new URL(url).searchParams;
  const [source, medium, campaign] = ["utm_source", "utm_medium", "utm_campaign"].map((k) => params.get(k) ?? "");
  if (!source && !medium && !campaign) return null;
  const att: Attribution = {source, medium, campaign, landing_path: new URL(url).pathname, at: now};
  storage.setItem(ATTRIBUTION_KEY, JSON.stringify(att));
  return att;
}

export function getAttribution(storage: StorageLike): Attribution | null {
  try {
    const raw = JSON.parse(storage.getItem(ATTRIBUTION_KEY) ?? "null") as Attribution | null;
    if (raw && typeof raw.landing_path === "string" && typeof raw.at === "number") return raw;
  } catch {
    // corrupt value → treat as none
  }
  return null;
}
