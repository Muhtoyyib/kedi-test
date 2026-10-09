// Seminar helpers. `now` is injectable so callers can re-evaluate at client
// hydration — a prerendered page must not show a seminar that already started.

import {catalog} from "./data.ts";
import type {Catalog, Seminar} from "./types.ts";

export function getSeminars(cat: Catalog = catalog): Seminar[] {
  return [...cat.seminars].sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1));
}

const toDate = (now: Date | string): Date => (typeof now === "string" ? new Date(now) : now);

/** Earliest scheduled seminar starting after `now` — cancelled skipped. */
export function getNextSeminar(now: Date | string = new Date(), cat: Catalog = catalog): Seminar | undefined {
  const t = toDate(now);
  return getSeminars(cat).find((s) => s.status === "scheduled" && new Date(s.startsAt) > t);
}

/** Past seminars: explicitly done, or ended before `now`. Newest first. */
export function getPastSeminars(now: Date | string = new Date(), cat: Catalog = catalog): Seminar[] {
  const t = toDate(now);
  return getSeminars(cat)
    .filter((s) => s.status === "done" || new Date(s.endsAt) <= t)
    .sort((a, b) => (a.startsAt < b.startsAt ? 1 : -1));
}
