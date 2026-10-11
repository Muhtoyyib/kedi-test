import {track} from "@/lib/analytics/track";
import {getAbout} from "@/lib/content/about";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {SiteSection} from "@/components/marketing/site-section";
import {SunArc} from "@/components/marketing/sun-arc";

// Meet the host — photo (or an initials tile until the client's photo lands),
// role, bio and a WhatsApp action addressed by first name.
export function Host() {
  const host = getAbout().host;
  return (
    <SiteSection tone="canvas">
      <div className="md:flex md:items-center md:gap-10">
        <div className="relative w-fit max-md:mb-8 md:shrink-0">
          <SunArc size="none" className="absolute -top-6 -left-6 w-[85%] rotate-180" />
          {host.photo ? (
            <img src={host.photo} alt={host.photoAlt} className="relative size-72 rounded-panel object-cover md:size-80" loading="lazy" />
          ) : (
            <div
              className="relative flex size-72 items-center justify-center rounded-panel bg-brand-soft text-6xl font-extrabold text-brand-strong md:size-80"
              role="img"
              aria-label={host.photoAlt}
            >
              {host.name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0].toUpperCase())
                .join("")}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-eyebrow font-bold tracking-[0.12em] text-brand-strong uppercase">Your host</p>
          <h2 className="mt-3 text-h2 text-text-heading">{host.name}</h2>
          <p className="mt-1 font-semibold text-brand-strong">{host.role}</p>
          <div className="mt-4 space-y-3 max-w-prose text-base text-text-body">
            {host.bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {host.stats.length > 0 ? <p className="mt-4 text-sm text-text-muted">{host.stats.join(" · ")}</p> : null}
          <Button
            variant="whatsapp"
            className="mt-6"
            href={buildWhatsAppLink(generalChatMessage())}
            target="_blank"
            rel="noopener"
            onClick={() => track({event: "whatsapp_chat_click", location: "seminar_faq"})}
          >
            Chat with {host.firstName} on WhatsApp
          </Button>
        </div>
      </div>
    </SiteSection>
  );
}
