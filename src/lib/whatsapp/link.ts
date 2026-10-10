// WhatsApp deep links (docs/whatsapp-messages.md). Message builders live in
// messages.ts; change 05 adds the order builder there.

import {siteConfig} from "../site-config";

export function buildWhatsAppLink(message: string): string {
  const url = new URL(`https://wa.me/${siteConfig.whatsapp.number}`);
  url.searchParams.set("text", message);
  const link = url.toString();
  // wa.me rejects encoded texts over ~2,000 characters — catch in dev.
  if (import.meta.env?.DEV && link.length > 2000) {
    throw new Error(`WhatsApp link is ${link.length} chars (max 2,000)`);
  }
  return link;
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  if (/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)) return true;
  return typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
}

/** Desktop opens a new tab; phones navigate same-tab so WhatsApp takes over. */
export function openWhatsApp(link: string, mobile: boolean = isMobileDevice()): void {
  if (mobile) window.location.href = link;
  else window.open(link, "_blank", "noopener");
}
