import {CalendarDays} from "lucide-react";
import {track} from "@/lib/analytics/track";
import type {Seminar} from "@/lib/catalog/types";
import {siteConfig} from "@/lib/site-config";
import {Button} from "@/components/ui/button";
import {SeminarCard} from "@/components/marketing/seminar-card";
import {SiteSection} from "@/components/marketing/site-section";

function CalendarPanel() {
  const channel = siteConfig.socials.whatsappChannel;
  return (
    <div className="mt-10 rounded-panel bg-ink p-6 text-canvas md:p-8">
      <CalendarDays className="size-8 text-sun" aria-hidden="true" />
      <h3 className="mt-3 text-h3 text-canvas">Never miss a seminar</h3>
      <p className="mt-2 max-w-prose text-base text-canvas/80">
        Subscribe to our seminar calendar and Luma will email you whenever a new date is added.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button
          variant="sun"
          href={siteConfig.luma.calendarUrl}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "calendar_subscribe_click"})}
        >
          Get notified of every seminar
        </Button>
        {typeof channel === "string" && channel.startsWith("http") ? (
          <a href={channel} target="_blank" rel="noopener" className="font-semibold text-canvas underline underline-offset-2">
            Or join our WhatsApp Channel
          </a>
        ) : null}
      </div>
    </div>
  );
}

// "Coming up" — later scheduled seminars as list cards, then the calendar
// subscription panel. `upcoming` excludes the featured next seminar.
export function UpcomingAndCalendar({upcoming, now}: {upcoming: Seminar[]; now: Date}) {
  return (
    <SiteSection tone="surface" aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading" className="text-h2 text-text-heading">
        Coming up
      </h2>
      {upcoming.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {upcoming.map((s) => (
            <li key={s.id}>
              <SeminarCard seminar={s} variant="list" registerHref={s.lumaUrl} location="upcoming_list" now={now} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-base text-text-body">More dates will be added soon.</p>
      )}
      <CalendarPanel />
    </SiteSection>
  );
}
