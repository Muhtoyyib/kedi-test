// About content access: resolves {city} tokens in seeded copy from site
// config so the text stays correct when the client's city is supplied.

import {aboutContent, type AboutContent} from "../../../content/about.ts";
import {siteConfig} from "@/lib/site-config";

export type {AboutContent, AboutIcon} from "../../../content/about.ts";

function resolveTokens(text: string): string {
  return text.replaceAll("{city}", siteConfig.city);
}

export function getAbout(): AboutContent {
  return {
    ...aboutContent,
    host: {
      ...aboutContent.host,
      role: resolveTokens(aboutContent.host.role),
      bio: aboutContent.host.bio.map(resolveTokens),
    },
    distributor: {...aboutContent.distributor, story: aboutContent.distributor.story.map(resolveTokens)},
    mission: resolveTokens(aboutContent.mission),
    values: aboutContent.values.map((v) => ({...v, text: resolveTokens(v.text)})),
  };
}
