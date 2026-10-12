import {track} from "@/lib/analytics/track";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {CtaBand} from "@/components/marketing/cta-band";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";

// End-of-page CTA (about/cta spec — exact copy).
export function AboutCta() {
  return (
    <SiteSection tone="canvas">
      <CtaBand title="Come and say hello" description="Join our free weekly seminar or send us a message. We'd love to help.">
        <Button variant="sun" href="/seminars">
          See seminar dates
        </Button>
        <Button
          variant="whatsapp"
          href={buildWhatsAppLink(generalChatMessage())}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "whatsapp_chat_click", location: "about_cta"})}
        >
          Chat on WhatsApp
        </Button>
      </CtaBand>
    </SiteSection>
  );
}
