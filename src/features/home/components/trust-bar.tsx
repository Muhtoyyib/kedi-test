import {BadgeCheck, MessageCircleHeart, Presentation, Truck} from "lucide-react";
import {siteConfig} from "@/lib/site-config";
import {SiteSection} from "@/components/marketing/site-section";
import {TrustItem} from "@/components/marketing/trust-item";

// The four trust answers right under the hero. The first sub-label stays
// "Genuine stock, never repackaged" until the client confirms the
// "official channel" wording (docs/client-inputs.md).
export function TrustBar() {
  return (
    <SiteSection tone="surface" spacing="tight" className="py-6 md:py-8">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 md:divide-x md:divide-line">
        {[
          {icon: BadgeCheck, label: "Genuine KEDI products", subLabel: "Genuine stock, never repackaged"},
          {icon: Presentation, label: "Free wellness seminars", subLabel: "Every week, in person or online"},
          {icon: MessageCircleHeart, label: "Personal follow-up", subLabel: "We check in after you buy"},
          {icon: Truck, label: `Delivery across ${siteConfig.city}`, subLabel: "And nationwide by courier"},
        ].map((item, i) => (
          <li key={item.label} className={i > 0 ? "md:pl-6" : undefined}>
            <TrustItem icon={item.icon} label={item.label} subLabel={item.subLabel} />
          </li>
        ))}
      </ul>
    </SiteSection>
  );
}
