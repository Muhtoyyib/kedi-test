import {track} from "@/lib/analytics/track";
import type {Product} from "@/lib/catalog/types";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {productAskMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {Notice} from "@/components/ui/notice";

// "How to use" — the Sheet's usage lines as numbered steps, verbatim, plus
// the safety note and two ways to ask for help.
export function HowToUse({product}: {product: Product}) {
  if (product.howToUse.length === 0) return null;
  return (
    <section id="how-to-use" className="scroll-mt-28 rounded-card bg-surface p-6">
      <h2 className="text-h2 text-ink">How to use</h2>
      <ol className="mt-4 space-y-4">
        {product.howToUse.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="pt-0.5 text-base text-text-body">{step}</span>
          </li>
        ))}
      </ol>
      <Notice tone="info" className="mt-5">
        Always follow the instructions on the pack. If you're pregnant, breastfeeding, taking medication or have a medical condition, speak
        to a doctor first.
      </Notice>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <Button
          variant="link"
          href={buildWhatsAppLink(productAskMessage(product))}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "whatsapp_chat_click", location: "pdp_ask", context: product.id})}
        >
          Questions about using it? Ask us on WhatsApp
        </Button>
        <Button variant="link" href="/seminars">
          Learn more at our free seminar
        </Button>
      </div>
    </section>
  );
}
