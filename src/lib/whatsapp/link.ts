// WhatsApp deep links (docs/whatsapp-messages.md). Message builders live in
// messages.ts; change 05 adds the order builder there.

import {siteConfig} from "../site-config";

export function buildWhatsAppLink(message: string): string {
  const url = new URL(`https://wa.me/${siteConfig.whatsapp.number}`);
  url.searchParams.set("text", message);
  return url.toString();
}
