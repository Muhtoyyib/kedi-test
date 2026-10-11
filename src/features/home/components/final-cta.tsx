import {Clock} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {getSettings} from "@/lib/catalog/settings";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {CtaBand} from "@/components/marketing/cta-band";
import {SiteSection} from "@/components/marketing/site-section";

function replyLine(openingHours: string): string {
  return openingHours.trim() !== ""
    ? `We usually reply within 1 hour, ${openingHours}.`
    : "We usually reply within 1 hour during business hours.";
}

// "Not sure what you need?" — the ink band at the bottom of the page.
export function FinalCta() {
  const hours = getSettings().openingHours;
  return (
    <SiteSection>
      <CtaBand
        title="Not sure what you need?"
        description="Tell us a little about your routine and we'll point you to the right product, or tell you honestly if you don't need one."
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <Button
            variant="whatsapp"
            size="lg"
            href={buildWhatsAppLink(generalChatMessage())}
            target="_blank"
            rel="noopener"
            onClick={() => track({event: "whatsapp_chat_click", location: "final_cta"})}
          >
            Chat with us on WhatsApp
          </Button>
          <Button variant="sun" size="lg" href="/seminars#register">
            Join the free seminar
          </Button>
        </div>
        <p className="mt-5 flex items-center gap-2 text-sm text-canvas/70">
          <Clock className="size-4 text-sun" aria-hidden="true" />
          {replyLine(hours)}
        </p>
      </CtaBand>
    </SiteSection>
  );
}
