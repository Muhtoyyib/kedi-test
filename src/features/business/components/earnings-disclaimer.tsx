import {disclaimerText} from "@/components/ui/disclaimer";
import {Notice} from "@/components/ui/notice";
import {SiteSection} from "@/components/marketing/site-section";

// The exact §4 earnings text in a titled callout — the page shows it once,
// prominently, in addition to the compact disclaimers under the hero CTA and
// the form (business/earnings-disclaimer spec).
export function EarningsDisclaimer() {
  return (
    <SiteSection tone="canvas">
      <div className="max-w-3xl">
        <Notice tone="info" title="About earnings">
          <p>{disclaimerText.earnings}</p>
          <p className="mt-2">For KEDI's official distributor terms, ask us for the current KEDI documentation.</p>
        </Notice>
      </div>
    </SiteSection>
  );
}
