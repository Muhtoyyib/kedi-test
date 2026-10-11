import {ShieldCheck} from "lucide-react";
import {siteConfig} from "@/lib/site-config";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

// /stories intro — consent + no-medical-claims note is required copy
// (stories/intro spec). `empty` swaps the description before any stories exist.
export function StoriesIntro({empty = false}: {empty?: boolean}) {
  return (
    <SiteSection tone="brand-soft" spacing="tight">
      <SectionHeader
        as="h1"
        eyebrow="Customer stories"
        title="In our customers' words"
        description={
          empty
            ? "Our first customer stories are on the way. Have you bought from us? We'd love to hear from you."
            : `Real customers in ${siteConfig.city} on what it's like to buy from us: the guidance, the follow-up and the service.`
        }
      />
      <p className="mt-6 flex items-start gap-2 text-sm text-text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-strong" aria-hidden="true" />
        Every story is shared with the customer's written permission. Stories describe personal experiences of our service. They are not
        medical advice, and individual experiences vary.
      </p>
    </SiteSection>
  );
}
