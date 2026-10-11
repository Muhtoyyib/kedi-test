import {Clock, MapPin, Monitor} from "lucide-react";
import {cn} from "cn";
import {track} from "@/lib/analytics/track";
import type {Seminar} from "@/lib/catalog/types";
import {formatSeminarDate, formatSeminarTime} from "@/lib/format/seminar-date";
import {Button} from "@/components/ui/button";

const LAGOS = "Africa/Lagos";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const dayName = new Intl.DateTimeFormat("en-US", {weekday: "short", timeZone: LAGOS});
const dayNum = new Intl.DateTimeFormat("en-US", {day: "numeric", timeZone: LAGOS});
const monthName = new Intl.DateTimeFormat("en-US", {month: "short", timeZone: LAGOS});

interface SeminarCardProps {
  seminar: Seminar;
  /** banner — the blue home panel; list — seminars page upcoming list. */
  variant: "banner" | "list";
  registerHref: string;
  location: "home_banner" | "upcoming_list";
  /** Injectable clock — defaults to Date.now() at render. */
  now?: Date;
}

export function seminarEyebrow(seminar: Seminar, now: Date): string {
  return new Date(seminar.startsAt).getTime() - now.getTime() <= WEEK_MS ? "This week's free seminar" : "Next free seminar";
}

function seminarLocation(s: Seminar): string {
  return s.format === "online" ? "Online (YouTube Live)" : s.venue;
}

function DateBlock({iso, large}: {iso: string; large: boolean}) {
  const d = new Date(iso);
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card bg-sun text-ink",
        large ? "h-20 w-18 md:h-27 md:w-24" : "h-20 w-18"
      )}
    >
      <span className="text-sm font-bold uppercase">{dayName.format(d)}</span>
      <span className="text-2xl font-extrabold md:text-3xl">{dayNum.format(d)}</span>
      <span className="text-sm font-bold uppercase">{monthName.format(d)}</span>
    </div>
  );
}

function MetaLine({seminar, light}: {seminar: Seminar; light?: boolean}) {
  const icon = `size-5 ${light ? "text-sun" : "text-brand-strong"}`;
  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="inline-flex items-center gap-1.5">
        <Clock className={icon} aria-hidden="true" />
        {formatSeminarTime(seminar.startsAt)} – {formatSeminarTime(seminar.endsAt)} WAT
      </span>
      <span className="inline-flex items-center gap-1.5">
        {seminar.format === "online" ? <Monitor className={icon} aria-hidden="true" /> : <MapPin className={icon} aria-hidden="true" />}
        {seminarLocation(seminar)}
      </span>
    </span>
  );
}

// The next-seminar promotion. "banner" renders inside the blue home panel;
// "list" is the compact upcoming-list row (change 13).
export function SeminarCard({seminar, variant, registerHref, location, now = new Date()}: SeminarCardProps) {
  const onRegister = () => track({event: "seminar_register_click", seminar_id: seminar.id, location});
  if (variant === "list") {
    return (
      <article className="flex items-center gap-4 rounded-card border border-line bg-canvas p-4">
        <DateBlock iso={seminar.startsAt} large={false} />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-text-heading">{seminar.topic}</h3>
          <p className="mt-1 text-sm text-text-muted">
            {formatSeminarDate(seminar.startsAt)} · <MetaLine seminar={seminar} />
          </p>
        </div>
        <Button variant="primary" href={registerHref} onClick={onRegister} className="max-md:hidden">
          Register free
        </Button>
      </article>
    );
  }
  return (
    <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-8">
      <DateBlock iso={seminar.startsAt} large />
      <div className="min-w-0 flex-1">
        <p className="text-eyebrow font-bold uppercase text-sun">{seminarEyebrow(seminar, now)}</p>
        <h2 className="mt-2 text-h2 font-bold text-canvas">{seminar.topic}</h2>
        <p className="mt-3 text-lg text-canvas/90">
          <MetaLine seminar={seminar} light />
        </p>
        <p className="mt-2 line-clamp-2 text-lg text-canvas/90">{seminar.summary}</p>
      </div>
      <div className="flex w-full flex-col gap-3 md:w-auto">
        <Button variant="sun" size="lg" fullWidth href={registerHref} onClick={onRegister}>
          Register free
        </Button>
        <Button variant="link" href="/seminars" className="text-canvas">
          See all seminars →
        </Button>
      </div>
    </div>
  );
}
