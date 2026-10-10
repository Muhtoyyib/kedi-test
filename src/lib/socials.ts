// Social profile links from site config. Placeholder values ("[url]") are
// filtered out so the shell never renders dead icon links before the client
// supplies real profiles — the production guard blocks shipping anyway.

import type {SocialNetwork} from "@/components/ui/social-icons";
import {siteConfig} from "./site-config";

export interface SocialLink {
  network: SocialNetwork;
  href: string;
  label: string;
}

const names: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
};

export function getSocialLinks(): SocialLink[] {
  const socials = siteConfig.socials;
  const keys: SocialNetwork[] = ["instagram", "facebook", "tiktok", "youtube"];
  return keys
    .filter((k) => typeof socials[k] === "string" && socials[k].startsWith("http"))
    .map((k) => ({network: k, href: socials[k], label: `${siteConfig.name} on ${names[k]}`}));
}
