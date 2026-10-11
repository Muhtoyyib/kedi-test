import type {BusinessContent} from "@/lib/content/business";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {StepList} from "@/components/marketing/step-list";

// "How it works" — steps from interest to first steps, all copy from
// content/business.ts (business/how-it-works spec).
export function BusinessHowItWorks({steps}: {steps: BusinessContent["howItWorks"]}) {
  return (
    <SiteSection tone="canvas" aria-labelledby="how-it-works-heading">
      <SectionHeader title="How it works" />
      <StepList variant="timeline" steps={steps.map((s) => ({title: s.title, description: s.text}))} className="mt-8" />
    </SiteSection>
  );
}
