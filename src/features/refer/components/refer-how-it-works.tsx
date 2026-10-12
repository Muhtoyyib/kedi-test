import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {StepList} from "@/components/marketing/step-list";

// refer/how-it-works design — exact copy.
const steps = [
  {
    title: "Get your link.",
    description: "Enter your first name and WhatsApp number below. Your code is ready instantly.",
  },
  {
    title: "Share it.",
    description: "Send your link to friends and family on WhatsApp. When they open it, your code is applied to their order automatically.",
  },
  {
    title: "You both get rewarded.",
    description:
      "Your friend gets their welcome reward on their first order. You get yours once their first order is paid. We'll message you on WhatsApp.",
  },
];

export function ReferHowItWorks() {
  return (
    <SiteSection>
      <SectionHeader title="How it works" />
      <StepList steps={steps} className="mt-8 max-w-2xl" />
    </SiteSection>
  );
}
