import {MapPin} from "lucide-react";
import type {Seminar} from "@/lib/catalog/types";
import {track} from "@/lib/analytics/track";
import {getNextSeminar} from "@/lib/catalog/seminars";
import {getAbout} from "@/lib/content/about";
import {siteConfig} from "@/lib/site-config";
import {useHydrated} from "@/lib/use-hydrated";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {heroSeminarLabel} from "@/features/home/hero-seminar-label";
import {Button} from "@/components/ui/button";
import {WhatsAppIcon} from "@/components/ui/whatsapp-icon";
import {SiteSection} from "@/components/marketing/site-section";
import {SunArc} from "@/components/marketing/sun-arc";

function joinAreas(areas: readonly string[]): string {
  return areas.join(", ");
}

function HeroPhoto() {
  const {distributor} = getAbout();
  return (
    <div className="relative mx-auto mt-8 w-full max-w-md md:mt-0 lg:max-w-xl">
      <SunArc size="none" className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2" />
      {distributor.photo ? (
        <img
          src={distributor.photo}
          alt={distributor.photoAlt}
          width={720}
          height={900}
          fetchPriority="high"
          className="relative aspect-4/5 w-full rounded-panel object-cover"
        />
      ) : (
        <div aria-hidden="true" className="relative flex aspect-4/5 w-full items-center justify-center rounded-panel bg-brand-soft">
          <span className="text-4xl font-extrabold text-brand-strong">{distributor.name[0] ?? "K"}</span>
        </div>
      )}
    </div>
  );
}

function HeroActions({next, now}: {next: Seminar | undefined; now: Date}) {
  const areas = siteConfig.serviceAreas;
  return (
    <>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <Button variant="primary" size="lg" href="/shop" fullWidth className="md:w-auto">
          Shop products
        </Button>
        <Button
          variant="sun"
          size="lg"
          href="/seminars#register"
          fullWidth
          className="md:w-auto"
          onClick={next ? () => track({event: "seminar_register_click", seminar_id: next.id, location: "home_hero"}) : undefined}
        >
          {heroSeminarLabel(next, now)}
        </Button>
      </div>
      <a
        href={buildWhatsAppLink(generalChatMessage())}
        target="_blank"
        rel="noopener"
        className="mt-4 inline-flex items-center gap-2 font-medium text-ink underline underline-offset-4"
        onClick={() => track({event: "whatsapp_chat_click", location: "hero"})}
      >
        <WhatsAppIcon size={18} />
        Not sure what you need? Chat with us on WhatsApp
      </a>
      {areas.length > 0 ? (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-text-muted">
          <MapPin className="size-4 shrink-0 text-brand-strong" aria-hidden="true" />
          Delivering across {joinAreas(areas)} and beyond
        </p>
      ) : null}
    </>
  );
}

// The five-second pitch: who, where, why, and the two main actions. The
// seminar label is computed at prerender and re-evaluated on hydration.
export function Hero({buildNow}: {buildNow: Date}) {
  const hydrated = useHydrated();
  const now = hydrated ? new Date() : buildNow;
  const next = getNextSeminar(now);

  return (
    <SiteSection spacing="tight" className="pt-6 pb-10 md:py-16">
      <div className="md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10">
        <div>
          <p className="flex items-center gap-2 text-eyebrow font-bold uppercase text-brand-strong">
            <span className="size-2 rounded-full bg-sun" aria-hidden="true" />
            Independent KEDI Distributor · {siteConfig.city}
          </p>
          <h1 className="mt-3 text-balance text-display font-extrabold text-ink md:text-display-md">
            Your trusted KEDI wellness partner in{" "}
            <span className="relative">
              {siteConfig.city}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-1 -z-10 h-1.5 rounded-full bg-sun" />
            </span>
          </h1>
          <p className="mt-4 text-lead text-text-body">
            Genuine products, real guidance and follow-up from people who actually check in on you.
          </p>
          <HeroActions next={next} now={now} />
        </div>
        <HeroPhoto />
      </div>
    </SiteSection>
  );
}
