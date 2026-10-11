import {PackageOpen, SearchX} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage, searchEnquiry} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";

type EmptyStateProps = {kind: "no-results"; term: string; onClear: () => void} | {kind: "empty-category"; category: string};

const ICONS = {"no-results": SearchX, "empty-category": PackageOpen} as const;

// Copy per sections/05 design. The WhatsApp context term is trimmed to 40
// chars and lower-cased for analytics.
export function EmptyState(props: EmptyStateProps) {
  const Icon = ICONS[props.kind];
  const noResults = props.kind === "no-results";
  const title = noResults ? `No products match "${props.term}"` : `Nothing in ${props.category} right now`;
  const body = noResults
    ? "Check the spelling, try a shorter word, or ask us. It may be listed under a different name."
    : "New stock arrives regularly. Ask us what's available or browse everything else.";
  const waLink = buildWhatsAppLink(noResults ? searchEnquiry(props.term) : generalChatMessage());
  const onWhatsApp = () =>
    track({
      event: "whatsapp_chat_click",
      location: "shop_no_results",
      ...(noResults ? {context: props.term.trim().toLowerCase().slice(0, 40)} : {}),
    });

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand-strong" aria-hidden="true">
        <Icon className="size-8" />
      </span>
      <h2 className="mt-4 text-h3 text-text-heading">{title}</h2>
      <p className="mt-2 text-text-body">{body}</p>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        {noResults ? (
          <Button variant="secondary" onClick={props.onClear}>
            Clear search
          </Button>
        ) : (
          <Button variant="primary" href="/shop">
            See all products
          </Button>
        )}
        <Button variant="whatsapp" href={waLink} target="_blank" rel="noopener" onClick={onWhatsApp}>
          {noResults ? "Ask us on WhatsApp" : "Ask on WhatsApp"}
        </Button>
      </div>
    </div>
  );
}
