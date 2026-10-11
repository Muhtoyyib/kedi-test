import {track} from "@/lib/analytics/track";
import type {Seminar} from "@/lib/catalog/types";
import {formatSeminarDate, formatSeminarTime} from "@/lib/format/seminar-date";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {businessInterestMessage} from "@/lib/whatsapp/messages";
import {SunArc} from "@/components/marketing/sun-arc";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";

function nextLine(next: Seminar): string {
  const where = next.format === "online" ? "Online" : `In person at ${next.venue}`;
  return `Next: ${formatSeminarDate(next.startsAt)} · ${formatSeminarTime(next.startsAt)} WAT · ${where}`;
}

// Invitation to the business segment of the weekly seminar
// (business/seminar-business-segment spec). The caller re-evaluates the next
// seminar on hydration so a started seminar is never advertised.
export function SeminarInvite({next}: {next?: Seminar}) {
  return (
    <SiteSection tone="canvas">
      <div className="relative overflow-hidden rounded-panel bg-ink p-6 text-canvas md:p-10">
        <SunArc size="lg" className="absolute -top-8 right-6 opacity-25" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-eyebrow font-bold tracking-[0.12em] text-sun uppercase">
            <span className="size-2 rounded-full bg-sun" aria-hidden="true" />
            Business session
          </p>
          <h2 className="mt-3 text-h2 font-bold text-balance text-canvas md:text-h2-md">Hear how it works, in person or online</h2>
          <p className="mt-4 max-w-2xl text-lead text-canvas/85">
            Our weekly seminar ends with a short session for anyone curious about becoming a distributor. Come, listen and ask questions. No
            commitment.
          </p>
          <p className="mt-4 text-sm text-canvas/70">
            {next ? nextLine(next) : "New dates are announced every week. Ask us on WhatsApp for the next one."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="sun"
              href="/seminars#register"
              onClick={() => next && track({event: "seminar_register_click", seminar_id: next.id, location: "business_invite"})}
            >
              Register free
            </Button>
            <Button
              variant="link"
              href={buildWhatsAppLink(businessInterestMessage())}
              target="_blank"
              rel="noopener"
              className="text-canvas"
              onClick={() => track({event: "whatsapp_chat_click", location: "business"})}
            >
              Or ask us on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </SiteSection>
  );
}
