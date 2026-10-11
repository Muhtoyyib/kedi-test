import {BadgeCheck, BookOpen, HandHeart, MessageCircleHeart, Presentation} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {differentiators, type DifferentiatorIcon} from "@/features/home/content";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Reveal} from "@/components/marketing/reveal";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

const ICONS: Record<DifferentiatorIcon, typeof BookOpen> = {
  BookOpen,
  HandHeart,
  MessageCircleHeart,
  Presentation,
  BadgeCheck,
};

function WhatsAppCell() {
  return (
    <Card className="flex flex-col items-start justify-center bg-brand-soft p-6">
      <h3 className="text-h3 text-text-heading">Have a question?</h3>
      <p className="mt-2 text-base text-text-body">Ask us on WhatsApp — we reply quickly.</p>
      <Button
        variant="whatsapp"
        size="sm"
        className="mt-4"
        href={buildWhatsAppLink(generalChatMessage())}
        target="_blank"
        rel="noopener"
        onClick={() => track({event: "whatsapp_chat_click", location: "business"})}
      >
        Ask us on WhatsApp
      </Button>
    </Card>
  );
}

// "More than a stockist" — five differentiators; the sixth grid cell is a
// supporting photo (when supplied) or a WhatsApp prompt.
export function WhyBuyFromUs({photo}: {photo?: {src: string; alt: string} | null}) {
  return (
    <SiteSection>
      <SectionHeader
        eyebrow="Why buy from us"
        title="More than a stockist"
        description="Anyone can sell you a pack. We make sure you know how to use it, and we stay with you after."
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {differentiators.map((d, i) => {
          const Icon = ICONS[d.icon];
          return (
            <li key={d.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <Card className="h-full p-6">
                  <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft" aria-hidden="true">
                    <Icon className="size-5 text-brand-strong" />
                  </span>
                  <h3 className="mt-4 text-h3 text-text-heading">{d.title}</h3>
                  <p className="mt-2 text-base text-text-body">{d.body}</p>
                </Card>
              </Reveal>
            </li>
          );
        })}
        <li>
          {photo ? (
            <img src={photo.src} alt={photo.alt} className="aspect-4/3 h-full w-full rounded-card object-cover" loading="lazy" />
          ) : (
            <WhatsAppCell />
          )}
        </li>
      </ul>
    </SiteSection>
  );
}
