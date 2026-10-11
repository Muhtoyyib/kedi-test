import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {StepList} from "@/components/marketing/step-list";
import {Button} from "@/components/ui/button";

const STEPS = [
  {title: "Add products to your cart"},
  {title: "Send your order on WhatsApp"},
  {title: "Pay to our business account and we deliver"},
];

// Page title + "how ordering works" strip. On category pages the
// CategoryHeader replaces the title block but this strip still renders via
// `intro={false}`.
export function ShopHeader({intro = true}: {intro?: boolean}) {
  return (
    <SiteSection spacing="tight" className="pt-8">
      {intro ? (
        <SectionHeader
          as="h1"
          eyebrow="Shop"
          title="Genuine KEDI products"
          description="Prices in Naira. Add what you need to your cart, then send your order on WhatsApp. We'll confirm stock, delivery and payment with you."
        />
      ) : null}
      <div className="mt-6 rounded-card bg-surface p-4">
        <StepList variant="compact" steps={STEPS} />
        <Button variant="link" href="/delivery-and-returns" className="mt-3">
          Delivery areas and fees
        </Button>
      </div>
    </SiteSection>
  );
}
