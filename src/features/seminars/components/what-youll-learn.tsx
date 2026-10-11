import {CircleCheck} from "lucide-react";
import type {Seminar} from "@/lib/catalog/types";
import {Card} from "@/components/ui/card";
import {Notice} from "@/components/ui/notice";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

const GENERIC_POINTS = [
  "Simple daily habits that support your wellbeing",
  "How to read and follow product usage instructions",
  "Answers to your questions, in plain language",
];

// What attendees take away — Sheet learn points, or the standard three when
// none are set. The seminar-only offer is named without sales pressure.
export function WhatYoullLearn({seminar, offerText}: {seminar?: Seminar; offerText: string | null}) {
  const points = seminar && seminar.learnPoints.length > 0 ? seminar.learnPoints : GENERIC_POINTS;
  return (
    <SiteSection tone="surface">
      <SectionHeader eyebrow="This week" title="What you'll learn" />
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {points.map((point) => (
          <li key={point}>
            <Card className="flex h-full items-start gap-4 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-leaf-soft" aria-hidden="true">
                <CircleCheck className="size-5 text-leaf-strong" />
              </span>
              <span className="pt-1.5 text-lead text-ink">{point}</span>
            </Card>
          </li>
        ))}
      </ul>
      {offerText ? (
        <Notice tone="sun" title="At the end of the seminar" className="mt-8">
          We teach first. If you'd like to try a product, there's a seminar-only offer: {offerText} There's no pressure to buy.
        </Notice>
      ) : null}
    </SiteSection>
  );
}
