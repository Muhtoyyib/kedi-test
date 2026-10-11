import type {Seminar} from "@/lib/catalog/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Hero seminar button label — "this week" inside 7 days (inclusive). */
export function heroSeminarLabel(next: Seminar | undefined, now: Date): string {
  if (!next) return "See upcoming seminars";
  return new Date(next.startsAt).getTime() - now.getTime() <= WEEK_MS ? "Join this week's free seminar" : "Join our next free seminar";
}
