import type {BusinessContent} from "@/lib/content/business";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {Card} from "@/components/ui/card";
import {businessIcons} from "./business-icons";

// "What it means to be a KEDI distributor" — all copy from
// content/business.ts, never hardcoded (income language is lint-banned there).
export function WhatItIs({content}: {content: BusinessContent["whatItIs"]}) {
  return (
    <SiteSection tone="canvas" aria-labelledby="what-it-is-heading">
      <SectionHeader title={content.heading} />
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {content.points.map((point) => {
          const Icon = businessIcons[point.icon];
          return (
            <li key={point.title}>
              <Card className="flex h-full gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft" aria-hidden="true">
                  <Icon className="size-5 text-brand-strong" />
                </span>
                <div>
                  <h3 className="font-semibold text-text-heading">{point.title}.</h3>
                  <p className="mt-1 text-base text-text-body">{point.text}</p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-lead text-text-body">{content.closing}</p>
    </SiteSection>
  );
}
