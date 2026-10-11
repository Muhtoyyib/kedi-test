import type {BusinessContent} from "@/lib/content/business";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {Card} from "@/components/ui/card";
import {businessIcons} from "./business-icons";

// "The support we give our team" — only items the client confirmed in
// content/business.ts reach this list (business/support-we-provide spec).
export function BusinessSupport({items}: {items: BusinessContent["support"]}) {
  if (items.length === 0) return null;
  return (
    <SiteSection tone="surface" aria-labelledby="support-heading">
      <SectionHeader title="The support we give our team" />
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => {
          const Icon = businessIcons[item.icon];
          return (
            <li key={item.title}>
              <Card className="h-full p-6">
                <Icon className="size-6 text-brand-strong" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-text-heading">{item.title}</h3>
                <p className="mt-1 text-base text-text-body">{item.text}</p>
              </Card>
            </li>
          );
        })}
      </ul>
    </SiteSection>
  );
}
