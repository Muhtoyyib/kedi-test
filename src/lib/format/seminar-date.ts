const LAGOS = "Africa/Lagos";

const dateParts = new Intl.DateTimeFormat("en-GB", {weekday: "long", day: "numeric", month: "long", timeZone: LAGOS});
const timeFormat = new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "2-digit", hour12: true, timeZone: LAGOS});

// "Saturday, 12 October" — always in WAT, regardless of the visitor's timezone.
// en-GB omits the comma after the weekday, so the parts are joined by hand.
export function formatSeminarDate(iso: string): string {
  const parts = Object.fromEntries(dateParts.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return `${parts.weekday}, ${parts.day} ${parts.month}`;
}

// "4:00 PM" — the page adds the "WAT" suffix where needed.
export function formatSeminarTime(iso: string): string {
  return timeFormat.format(new Date(iso));
}

export function isUpcoming(now: Date, startsAt: string): boolean {
  return new Date(startsAt).getTime() > now.getTime();
}
