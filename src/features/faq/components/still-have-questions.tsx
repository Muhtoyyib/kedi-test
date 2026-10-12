import {track} from "@/lib/analytics/track";
import {siteConfig} from "@/lib/site-config";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {CtaBand} from "@/components/marketing/cta-band";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";

// faq/still-have-questions design (exact copy): WhatsApp, call and contact
// options plus the usual reply time.
export function StillHaveQuestions({openingHours}: {openingHours?: string | null}) {
  const hours = openingHours ? ` (${openingHours})` : "";
  return (
    <SiteSection>
      <CtaBand
        tone="soft"
        title="Still have a question?"
        description={`Message us on WhatsApp. We usually reply within 1 hour during opening hours${hours}.`}
      >
        <Button
          variant="whatsapp"
          href={buildWhatsAppLink(generalChatMessage())}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "whatsapp_chat_click", location: "faq"})}
        >
          Ask on WhatsApp
        </Button>
        <Button variant="secondary" href={`tel:${siteConfig.phone.number}`} onClick={() => track({event: "phone_click", location: "faq"})}>
          Call {siteConfig.phone.display}
        </Button>
        <Button variant="link" href="/contact" className="sm:self-center">
          Other ways to contact us
        </Button>
      </CtaBand>
    </SiteSection>
  );
}
