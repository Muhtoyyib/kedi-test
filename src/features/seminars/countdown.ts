import {formatSeminarTime} from "@/lib/format/seminar-date";

const LAGOS = "Africa/Lagos";
const DAY_MS = 24 * 60 * 60 * 1000;
const lagosDay = new Intl.DateTimeFormat("en-CA", {timeZone: LAGOS, dateStyle: "short"});

// "Starts in 2 days" / "Starts today at 4:00 PM" / "Starting soon" —
// computed on the client so a started seminar is never advertised.
export function seminarCountdown(startsAt: string, now: Date): string {
  const start = new Date(startsAt);
  if (start.getTime() <= now.getTime()) return "Starting soon";
  if (lagosDay.format(start) === lagosDay.format(now)) return `Starts today at ${formatSeminarTime(startsAt)}`;
  const days = Math.max(1, Math.ceil((start.getTime() - now.getTime()) / DAY_MS));
  return `Starts in ${days} ${days === 1 ? "day" : "days"}`;
}
