import {CalendarDays, Clock, MapPin, Monitor, Users} from "lucide-react";
import {track} from "@/lib/analytics/track";
import type {Seminar} from "@/lib/catalog/types";
import {formatSeminarDate, formatSeminarTime} from "@/lib/format/seminar-date";
import {siteConfig} from "@/lib/site-config";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {seminarQuestionMessage} from "@/lib/whatsapp/messages";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {seminarEyebrow} from "@/components/marketing/seminar-card";
import {SiteSection} from "@/components/marketing/site-section";
import {requestRegistrationLoad} from "../register-load";
import {seminarCountdown} from "../countdown";

const LAGOS = "Africa/Lagos";
const dayName = new Intl.DateTimeFormat("en-US", {weekday: "short", timeZone: LAGOS});
const dayNum = new Intl.DateTimeFormat("en-US", {day: "numeric", timeZone: LAGOS});
const monthName = new Intl.DateTimeFormat("en-US", {month: "short", timeZone: LAGOS});

function durationText(s: Seminar): string {
  const mins = Math.round((new Date(s.endsAt).getTime() - new Date(s.startsAt).getTime()) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 && m > 0 ? `${h} hr ${m} min` : h > 0 ? `${h} hr` : `${m} min`;
}

function directionsUrl(venue: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
}

function shareSeminar(s: Seminar): void {
  const url = `${siteConfig.url ?? window.location.origin}/seminars`;
  const text = `Join me at a free wellness seminar: ${s.topic}, ${formatSeminarDate(s.startsAt)} ${formatSeminarTime(s.startsAt)}. Register here: ${url}`;
  if (typeof navigator !== "undefined" && "share" in navigator) {
    track({event: "seminar_share", method: "native_share"});
    void navigator.share({title: s.topic, text, url}).catch(() => undefined);
    return;
  }
  track({event: "seminar_share", method: "whatsapp"});
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

function MetaList({s}: {s: Seminar}) {
  const icon = "size-5 shrink-0 text-brand-strong";
  return (
    <ul className="mt-5 space-y-2.5 text-base text-text-body">
      <li className="flex items-center gap-2.5">
        <CalendarDays className={icon} aria-hidden="true" />
        {formatSeminarDate(s.startsAt)}
      </li>
      <li className="flex items-center gap-2.5">
        <Clock className={icon} aria-hidden="true" />
        {formatSeminarTime(s.startsAt)} – {formatSeminarTime(s.endsAt)} WAT ({durationText(s)})
      </li>
      {s.format === "online" ? (
        <li className="flex items-center gap-2.5">
          <Monitor className={icon} aria-hidden="true" />
          Online: YouTube Live — link sent after you register
        </li>
      ) : (
        <li className="flex items-center gap-2.5">
          <MapPin className={icon} aria-hidden="true" />
          {s.venue}{" "}
          <a
            href={directionsUrl(s.venue)}
            target="_blank"
            rel="noopener"
            className="font-semibold text-brand-strong underline underline-offset-2"
          >
            Get directions
          </a>
        </li>
      )}
      <li className="flex items-center gap-2.5">
        <Users className={icon} aria-hidden="true" />
        Who should attend: {s.audience}
      </li>
    </ul>
  );
}

function DateCard({s, now, hydrated}: {s: Seminar; now: Date; hydrated: boolean}) {
  const d = new Date(s.startsAt);
  return (
    <div className="rounded-panel bg-canvas p-6 shadow-card">
      <div className="flex h-27 w-24 flex-col items-center justify-center rounded-card bg-sun text-ink">
        <span className="text-sm font-bold uppercase">{dayName.format(d)}</span>
        <span className="text-3xl font-extrabold">{dayNum.format(d)}</span>
        <span className="text-sm font-bold uppercase">{monthName.format(d)}</span>
      </div>
      {hydrated ? <p className="mt-4 text-sm font-semibold text-text-muted">{seminarCountdown(s.startsAt, now)}</p> : null}
    </div>
  );
}

function EmptyState() {
  return (
    <SiteSection tone="brand-soft" className="pt-8 pb-12">
      <p className="text-eyebrow font-bold tracking-[0.12em] text-brand-strong uppercase">Free wellness seminars</p>
      <h1 className="mt-3 text-balance text-h1 text-text-heading">Our next seminar date is coming soon</h1>
      <p className="mt-4 max-w-prose text-lead text-text-body">
        We run a free wellness seminar most weeks. Get notified as soon as the next date is set.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="sun"
          size="lg"
          href={siteConfig.luma.calendarUrl}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "calendar_subscribe_click"})}
        >
          Get notified of every seminar
        </Button>
        <Button
          variant="whatsapp"
          size="lg"
          href={buildWhatsAppLink(seminarQuestionMessage())}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "whatsapp_chat_click", location: "seminar_faq"})}
        >
          Ask us on WhatsApp
        </Button>
      </div>
    </SiteSection>
  );
}

// Top of /seminars — next seminar at a glance, or the coming-soon state.
export function SeminarHero({seminar, now, hydrated}: {seminar?: Seminar; now: Date; hydrated: boolean}) {
  if (!seminar) return <EmptyState />;
  return (
    <SiteSection tone="brand-soft" className="pt-8 pb-12">
      <div className="md:flex md:items-start md:justify-between md:gap-10">
        <div className="min-w-0 flex-1">
          <p className="text-eyebrow font-bold tracking-[0.12em] text-brand-strong uppercase">● {seminarEyebrow(seminar, now)}</p>
          <h1 className="mt-3 text-balance text-h1 text-text-heading">{seminar.topic}</h1>
          <p className="mt-4 max-w-prose text-lead text-text-body">{seminar.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="offer">Free</Badge>
            <Badge variant="brand">{seminar.format === "online" ? "Online" : "In person"}</Badge>
          </div>
          <MetaList s={seminar} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              href="#register"
              onClick={() => {
                track({event: "seminar_register_click", seminar_id: seminar.id, location: "seminar_hero"});
                requestRegistrationLoad();
              }}
            >
              Register free
            </Button>
            <Button variant="secondary" size="lg" onClick={() => shareSeminar(seminar)}>
              Share with a friend
            </Button>
          </div>
        </div>
        <div className="max-md:mt-8 md:shrink-0">
          <DateCard s={seminar} now={now} hydrated={hydrated} />
        </div>
      </div>
    </SiteSection>
  );
}
