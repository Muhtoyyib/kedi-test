import {track} from "@/lib/analytics/track";
import type {Inline} from "@/lib/catalog/types";
import type {ResolvedFaqItem} from "@/lib/content/faq";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {seminarQuestionMessage} from "@/lib/whatsapp/messages";
import {Accordion} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {SiteSection} from "@/components/marketing/site-section";

function renderInlines(inlines: Inline[]) {
  return inlines.map((inline, i) =>
    inline.href ? (
      <a key={i} href={inline.href} className="font-semibold text-brand-strong underline underline-offset-2">
        {inline.text}
      </a>
    ) : (
      <span key={i}>{inline.text}</span>
    )
  );
}

// "Seminar questions" — the doubts that stop people registering, answered.
export function SeminarFaq({faqs}: {faqs: ResolvedFaqItem[]}) {
  if (faqs.length === 0) return null;
  return (
    <SiteSection tone="surface" aria-labelledby="seminar-faq-heading">
      <div className="max-w-3xl">
        <h2 id="seminar-faq-heading" className="text-h2 text-text-heading">
          Seminar questions
        </h2>
        <Accordion
          items={faqs.map((f) => ({question: f.question, answer: renderInlines(f.inlines)}))}
          group="seminar-faq"
          className="mt-6"
        />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-sm text-text-muted">Another question?</span>
          <Button
            variant="whatsapp"
            size="sm"
            href={buildWhatsAppLink(seminarQuestionMessage())}
            target="_blank"
            rel="noopener"
            onClick={() => track({event: "whatsapp_chat_click", location: "seminar_faq"})}
          >
            Ask on WhatsApp
          </Button>
        </div>
      </div>
    </SiteSection>
  );
}
