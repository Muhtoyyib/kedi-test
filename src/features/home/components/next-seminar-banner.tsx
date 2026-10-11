import {track} from "@/lib/analytics/track";
import {getNextSeminar} from "@/lib/catalog/seminars";
import {siteConfig} from "@/lib/site-config";
import {useHydrated} from "@/lib/use-hydrated";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {SeminarCard} from "@/components/marketing/seminar-card";
import {SiteSection} from "@/components/marketing/site-section";
import {SunArc} from "@/components/marketing/sun-arc";

// "New seminar dates are coming soon" — same blue panel, no date block.
function ComingSoon() {
  return (
    <div className="max-w-2xl">
      <p className="text-eyebrow font-bold uppercase text-sun">Free wellness seminars</p>
      <h2 className="mt-2 text-h2 font-bold text-canvas">New seminar dates are coming soon</h2>
      <p className="mt-3 text-lg text-canvas/90">Get a notification as soon as the next date is set.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="sun"
          href={siteConfig.luma.calendarUrl}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "calendar_subscribe_click"})}
        >
          Get notified of every seminar
        </Button>
        <Button variant="link" href={buildWhatsAppLink(generalChatMessage())} target="_blank" rel="noopener" className="text-canvas">
          Ask us on WhatsApp
        </Button>
      </div>
    </div>
  );
}

// The next seminar, evaluated at prerender (buildNow = catalog generatedAt)
// and re-checked on hydration so a started seminar is never advertised.
export function NextSeminarBanner({buildNow}: {buildNow: Date}) {
  const hydrated = useHydrated();
  const next = getNextSeminar(hydrated ? new Date() : buildNow);

  return (
    <SiteSection spacing="tight">
      <div className="relative overflow-hidden rounded-panel bg-brand p-6 md:p-10">
        <SunArc size="none" className="absolute right-0 -bottom-10 w-2/5 rotate-180" />
        <div className="relative">
          {next ? (
            <SeminarCard
              seminar={next}
              variant="banner"
              registerHref="/seminars#register"
              location="home_banner"
              now={hydrated ? new Date() : buildNow}
            />
          ) : (
            <ComingSoon />
          )}
        </div>
      </div>
    </SiteSection>
  );
}
