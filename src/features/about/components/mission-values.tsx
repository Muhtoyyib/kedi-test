import {BadgeCheck, BookOpen, MessageCircleHeart, Scale} from "lucide-react";
import {getAbout} from "@/lib/content/about";
import type {AboutIcon} from "@/lib/content/about";
import {SiteSection} from "@/components/marketing/site-section";
import {Card} from "@/components/ui/card";

const icons: Record<AboutIcon, typeof BookOpen> = {BookOpen, Scale, MessageCircleHeart, BadgeCheck};

// Mission + values from content/about.ts (about/mission-values spec).
export function MissionValues() {
  const {mission, values} = getAbout();
  return (
    <SiteSection tone="canvas" aria-labelledby="mission-heading">
      <h2 id="mission-heading" className="max-w-3xl text-h2 text-balance text-text-heading">
        {mission}
      </h2>
      <span className="mt-4 block h-1.5 w-24 rounded-full bg-sun" aria-hidden="true" />
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {values.map((value) => {
          const Icon = icons[value.icon];
          return (
            <li key={value.title}>
              <Card className="flex h-full gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft" aria-hidden="true">
                  <Icon className="size-5 text-brand-strong" />
                </span>
                <div>
                  <h3 className="font-semibold text-text-heading">{value.title}</h3>
                  <p className="mt-1 text-base text-text-body">{value.text}</p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </SiteSection>
  );
}
