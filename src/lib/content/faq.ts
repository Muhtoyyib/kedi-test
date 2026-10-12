// FAQ access: resolves {tokens} from the Sheet's Settings (and site config),
// parses [text](/path) answer links into inlines, and omits items whose
// required token has no value (e.g. no bank details → no "How do I pay?").

import {faqItems, type FaqGroup, type FaqItem, type FaqPage} from "../../../content/faq.ts";
import {parseMiniMarkdown} from "@/lib/content/mini-markdown";
import {catalog} from "@/lib/catalog/data";
import {getSettings} from "@/lib/catalog/settings";
import type {Catalog, Inline} from "@/lib/catalog/types";
import {siteConfig} from "@/lib/site-config";

export interface ResolvedFaqItem {
  id: string;
  group: FaqGroup;
  question: string;
  answer: string;
  inlines: Inline[];
}

function tokenValues(cat: Catalog): Record<string, string | null> {
  const s = getSettings(cat);
  return {
    bank: s.bank ? `${s.bank.name} · ${s.bank.accountName} · ${s.bank.accountNumber}` : null,
    deliveryNote: s.deliveryNote || null,
    pickupAddress: s.pickupAddress || null,
    openingHours: s.openingHours || null,
    referralReward: s.referralRewardText || null,
    referralFriendReward: s.referralFriendRewardText || null,
    loyaltyText: s.loyaltyText,
    city: siteConfig.city,
  };
}

/** Substitutes {tokens}; null when a required token has no value. */
export function resolveAnswer(answer: string, cat: Catalog = catalog): string | null {
  const tokens = tokenValues(cat);
  let missing = false;
  const resolved = answer.replace(/\{(\w+)\}/g, (raw, name: string) => {
    const value = tokens[name];
    if (value === undefined || value === null || value === "") {
      missing = true;
      return raw;
    }
    return value;
  });
  return missing ? null : resolved;
}

/** Splits resolved answer text into Inline runs (bold + links via mini-markdown). */
export function answerInlines(answer: string): Inline[] {
  return parseMiniMarkdown(answer).flat();
}

export function getFaqs(options: {page?: FaqPage; group?: FaqGroup} = {}, cat: Catalog = catalog): ResolvedFaqItem[] {
  return faqItems.flatMap((item) => resolveItem(item, options, cat));
}

function resolveItem(item: FaqItem, options: {page?: FaqPage; group?: FaqGroup}, cat: Catalog): ResolvedFaqItem[] {
  if (options.page && !item.showOn.includes(options.page)) return [];
  if (options.group && item.group !== options.group) return [];
  const answer = resolveAnswer(item.answer, cat);
  if (answer === null) return [];
  return [{id: item.id, group: item.group, question: item.question, answer, inlines: answerInlines(answer)}];
}
