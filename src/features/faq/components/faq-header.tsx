import type {FaqGroup} from "../../../../content/faq.ts";
import {faqGroups} from "../../../../content/faq.ts";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

interface FaqHeaderProps {
  /** Groups that have at least one item to jump to. */
  groups: FaqGroup[];
}

// faq/faq-header design: h1 + intro + jump chips for groups with items.
export function FaqHeader({groups}: FaqHeaderProps) {
  const links = faqGroups.filter((g) => groups.includes(g.id));
  return (
    <SiteSection tone="brand-soft" spacing="tight">
      <SectionHeader
        as="h1"
        eyebrow="Help"
        title="Frequently asked questions"
        description="Quick answers about ordering, payment, delivery and our seminars. Can't find yours? Message us."
      />
      <nav aria-label="Jump to a question group" className="mt-8 -mx-4 overflow-x-auto px-4 no-scrollbar">
        <div className="flex gap-2">
          {links.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="flex h-10 shrink-0 items-center rounded-full border-2 border-line-strong bg-canvas px-4 text-sm font-semibold whitespace-nowrap text-text-body transition-colors hover:border-brand"
            >
              {g.label}
            </a>
          ))}
        </div>
      </nav>
    </SiteSection>
  );
}
