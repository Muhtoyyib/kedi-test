import {getSettings} from "@/lib/catalog/settings";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {Notice} from "@/components/ui/notice";

// refer/referral-terms design — seed copy (client confirms).
const TERMS = [
  "Rewards apply when a new customer's first order is paid. Existing customers can't be referred.",
  "Your friend must use your link or code when ordering.",
  "You can't refer yourself or use your own code.",
  "Rewards are applied to your next order and can't be exchanged for cash.",
  "We may change or end the programme at any time. Rewards already earned will be honoured.",
];

export function ReferralTerms() {
  const {loyaltyText} = getSettings();
  return (
    <SiteSection tone="surface" spacing="tight">
      <div className="max-w-2xl">
        <SectionHeader title="The small print" />
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-text-body">
          {TERMS.map((term) => (
            <li key={term}>{term}</li>
          ))}
          <li>
            Questions?{" "}
            <a
              href={buildWhatsAppLink(generalChatMessage())}
              target="_blank"
              rel="noopener"
              className="font-semibold text-brand-strong underline underline-offset-2"
            >
              Ask us on WhatsApp
            </a>
            .
          </li>
        </ul>
        {loyaltyText ? (
          <Notice tone="sun" title="Loyalty reward" className="mt-6">
            {loyaltyText}
          </Notice>
        ) : null}
      </div>
    </SiteSection>
  );
}
