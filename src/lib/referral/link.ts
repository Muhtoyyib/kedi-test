// Referral link + share message (docs/whatsapp-messages.md §8). Consumed by
// the Refer page (change 20); any page accepts ?ref=, so deep links work too.

import {siteConfig} from "@/lib/site-config";

export function buildReferralLink(code: string): string {
  const base = siteConfig.url ?? "";
  return `${base}/?ref=${encodeURIComponent(code)}`;
}

/** Share text for wa.me/?text=… — friend chooses their own contact. */
export function referralShareMessage(code: string, friendReward: string): string {
  return (
    `I buy my KEDI wellness products from ${siteConfig.name} in ${siteConfig.city}. ` +
    `They explain everything and follow up properly. Use my link to get ${friendReward} on your first order: ${buildReferralLink(code)}`
  );
}
