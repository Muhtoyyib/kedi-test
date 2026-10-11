import {HandHeart} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {SiteSection} from "@/components/marketing/site-section";

export function ShopHelpCta() {
  return (
    <SiteSection spacing="tight">
      <div className="flex flex-col gap-5 rounded-panel bg-brand-soft p-6 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sun text-ink" aria-hidden="true">
            <HandHeart className="size-6" />
          </span>
          <div>
            <h2 className="text-h2 text-text-heading">Not sure which to choose?</h2>
            <p className="mt-2 max-w-xl text-text-body">
              Tell us what you're looking for and we'll recommend what fits your routine. Or come to our free weekly seminar and ask in
              person.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:shrink-0 lg:flex-row">
          <Button
            variant="whatsapp"
            href={buildWhatsAppLink(generalChatMessage())}
            target="_blank"
            rel="noopener"
            onClick={() => track({event: "whatsapp_chat_click", location: "shop_help"})}
          >
            Ask on WhatsApp
          </Button>
          <Button variant="secondary" href="/seminars">
            See seminar dates
          </Button>
        </div>
      </div>
    </SiteSection>
  );
}
