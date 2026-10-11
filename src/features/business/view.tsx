import {catalog} from "@/lib/catalog/data";
import {getNextSeminar} from "@/lib/catalog/seminars";
import {getBusinessContent} from "@/lib/content/business";
import {useHydrated} from "@/lib/use-hydrated";
import {BusinessFaq} from "./components/business-faq";
import {BusinessHero} from "./components/business-hero";
import {BusinessHowItWorks} from "./components/how-it-works";
import {BusinessSupport} from "./components/support";
import {EarningsDisclaimer} from "./components/earnings-disclaimer";
import {InterestForm} from "./components/interest-form";
import {SeminarInvite} from "./components/seminar-invite";
import {WhatItIs} from "./components/what-it-is";

// /business-opportunity — no income language anywhere; the earnings
// disclaimer appears under the hero CTA, under the form and as its own
// section (business/page spec).
export function BusinessView() {
  const hydrated = useHydrated();
  // Pin to the catalog's build time at prerender; re-check on hydration so a
  // started seminar is never advertised.
  const now = hydrated ? new Date() : new Date(catalog.generatedAt);
  const content = getBusinessContent();
  return (
    <>
      <BusinessHero />
      <WhatItIs content={content.whatItIs} />
      <BusinessHowItWorks steps={content.howItWorks} />
      <BusinessSupport items={content.support} />
      <SeminarInvite next={getNextSeminar(now)} />
      <InterestForm />
      <EarningsDisclaimer />
      <BusinessFaq />
    </>
  );
}
