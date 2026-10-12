import {BadgeCheck} from "lucide-react";
import {siteConfig} from "@/lib/site-config";
import {SiteSection} from "@/components/marketing/site-section";

// The exact independence statement — required copy, do not paraphrase
// (about/independent-distributor spec).
export function IndependentStatement() {
  return (
    <SiteSection tone="canvas">
      <div className="rounded-panel border-2 border-brand bg-canvas p-6 md:p-8">
        <div className="flex items-start gap-4">
          <BadgeCheck className="mt-1 size-8 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <h2 className="text-h3 text-text-heading">We are an independent distributor of KEDI Healthcare products.</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-text-body">
              <li>We buy genuine KEDI products through KEDI's official distribution channel.</li>
              <li>Your order, payment, delivery and follow-up are handled by {siteConfig.name}, not by KEDI directly.</li>
              <li>Questions about your order? Contact us. We're here to help.</li>
            </ul>
          </div>
        </div>
      </div>
    </SiteSection>
  );
}
