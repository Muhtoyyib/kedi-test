import {track} from "@/lib/analytics/track";
import type {Product} from "@/lib/catalog/types";
import {getFaqs} from "@/lib/content/faq";
import type {Inline} from "@/lib/catalog/types";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {productAskMessage} from "@/lib/whatsapp/messages";
import {Accordion} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";

// The three ordering questions appended after the product's own FAQs
// (design: how to order, how to pay, delivery times).
const ORDERING_FAQ_IDS = ["how-to-order", "how-to-pay", "delivery-areas"];

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

// "Questions about {name}" — product FAQs first, then ordering questions;
// ends with a WhatsApp fallback naming the product.
export function ProductFaqs({product}: {product: Product}) {
  const general = ORDERING_FAQ_IDS.map((id) => getFaqs().find((f) => f.id === id)).filter((f) => f !== undefined);
  const items = [
    ...product.faqs.map((f) => ({question: f.question, answer: f.answer})),
    ...general.map((f) => ({question: f.question, answer: renderInlines(f.inlines)})),
  ];
  if (items.length === 0) return null;

  return (
    <section id="faqs" className="scroll-mt-28">
      <h2 className="text-h2 text-ink">Questions about {product.name}</h2>
      <Accordion items={items} group={`product-faq-${product.id}`} className="mt-4" />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-text-muted">Still have a question?</span>
        <Button
          variant="whatsapp"
          size="sm"
          href={buildWhatsAppLink(productAskMessage(product))}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "whatsapp_chat_click", location: "pdp_ask", context: product.id})}
        >
          Ask on WhatsApp
        </Button>
      </div>
    </section>
  );
}
