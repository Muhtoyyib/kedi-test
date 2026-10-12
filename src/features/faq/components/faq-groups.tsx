import {useEffect, useState} from "react";
import {Check, ChevronDown, Link as LinkIcon} from "lucide-react";
import {faqGroups} from "../../../../content/faq.ts";
import type {ResolvedFaqItem} from "@/lib/content/faq";
import {parseMiniMarkdown} from "@/lib/content/mini-markdown";
import {Inlines} from "@/components/content/inlines";
import {SiteSection} from "@/components/marketing/site-section";
import {siteConfig} from "@/lib/site-config";

// Grouped accordions (faq/faq-groups design): each item is deep-linkable —
// opening /faq#{id} opens and scrolls to that answer. Native <details>, so
// answers also open without JavaScript.
export function FaqGroups({items}: {items: ResolvedFaqItem[]}) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el instanceof HTMLDetailsElement) {
      el.open = true;
      el.scrollIntoView();
    }
  }, []);

  const groups = faqGroups.map((g) => ({...g, items: items.filter((i) => i.group === g.id)})).filter((g) => g.items.length > 0);

  return (
    <SiteSection>
      <div className="max-w-3xl space-y-10">
        {groups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-28">
            <h2 className="text-h2 font-bold text-text-heading">{group.label}</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {group.items.map((item) => (
                <FaqItem key={item.id} item={item} group={group.id} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </SiteSection>
  );
}

function FaqItem({item, group}: {item: ResolvedFaqItem; group: string}) {
  return (
    <details id={item.id} name={group} className="group scroll-mt-28">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold text-ink">
        {item.question}
        <span className="flex shrink-0 items-center gap-1">
          <CopyLinkButton id={item.id} />
          <ChevronDown className="size-5 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <div className="space-y-3 pb-4 text-base text-text-body">
        {parseMiniMarkdown(item.answer).map((paragraph, i) => (
          <p key={i}>
            <Inlines items={paragraph} />
          </p>
        ))}
      </div>
    </details>
  );
}

function CopyLinkButton({id}: {id: string}) {
  const [copied, setCopied] = useState(false);
  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const base = siteConfig.url ?? window.location.origin;
    try {
      await navigator.clipboard.writeText(`${base}/faq#${id}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — leave the link copyable by hand
    }
  }
  const Icon = copied ? Check : LinkIcon;
  return (
    <button
      type="button"
      aria-label="Copy link to this question"
      onClick={copy}
      className="flex size-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-brand"
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
