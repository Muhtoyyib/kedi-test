import {track} from "@/lib/analytics/track";
import {getFaqs} from "@/lib/content/faq";
import {Inlines} from "@/components/content/inlines";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {businessInterestMessage} from "@/lib/whatsapp/messages";
import {Accordion} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

// Business FAQs from content/faq.ts (business/faq spec). Answers may mention
// earnings to deny them — they're copy-reviewed, not lint-banned.
export function BusinessFaq() {
  const items = getFaqs({page: "business"});
  if (items.length === 0) return null;
  return (
    <SiteSection tone="surface" aria-labelledby="business-faq-heading">
      <div className="max-w-3xl">
        <SectionHeader title="Questions about becoming a distributor" />
        <Accordion
          group="business-faq"
          className="mt-6"
          items={items.map((item) => ({question: item.question, answer: <Inlines items={item.inlines} />}))}
        />
        <div className="mt-8 flex items-center gap-4">
          <p className="font-semibold text-ink">Still curious?</p>
          <Button
            variant="whatsapp"
            size="sm"
            href={buildWhatsAppLink(businessInterestMessage())}
            target="_blank"
            rel="noopener"
            onClick={() => track({event: "whatsapp_chat_click", location: "business"})}
          >
            Ask on WhatsApp
          </Button>
        </div>
      </div>
    </SiteSection>
  );
}
