import {track} from "@/lib/analytics/track";
import {storySubmissionMessage} from "@/lib/whatsapp/messages";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {CtaBand} from "@/components/marketing/cta-band";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";

// End-of-page invitation — the consent promise is required copy
// (stories/share-your-story spec).
export function ShareYourStory() {
  return (
    <SiteSection tone="canvas">
      <CtaBand
        title="Bought from us? Share your experience"
        description="Send us a short message or voice note on WhatsApp about the service you received. We'll only publish it if you say yes, and you can choose to use just your first name."
      >
        <Button
          variant="whatsapp"
          href={buildWhatsAppLink(storySubmissionMessage())}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "whatsapp_chat_click", location: "story_cta"})}
        >
          Share on WhatsApp
        </Button>
        <Button variant="sun" href="/shop">
          Shop products
        </Button>
      </CtaBand>
    </SiteSection>
  );
}
