// Pre-filled WhatsApp message text (docs/whatsapp-messages.md). None of
// these include personal data the visitor didn't type.

import {siteConfig} from "../site-config";

export function generalChatMessage(): string {
  return `Hello ${siteConfig.name}! I'd like some advice on which KEDI product is right for me.`;
}
