// Business-opportunity content access: resolves {distributorName} from the
// about content and drops support items the client hasn't confirmed.

import {aboutContent} from "../../../content/about.ts";
import {businessContent, type BusinessContent} from "../../../content/business.ts";

export type {BusinessContent, BusinessIcon} from "../../../content/business.ts";

export function getBusinessContent(): BusinessContent {
  const resolve = (text: string) => text.replaceAll("{distributorName}", aboutContent.distributor.name);
  return {
    ...businessContent,
    support: businessContent.support.filter((item) => item.confirmed).map((item) => ({...item, text: resolve(item.text)})),
  };
}
