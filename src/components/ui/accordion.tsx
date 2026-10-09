import type {ReactNode} from "react";
import {cn} from "cn";
import {ChevronDown} from "lucide-react";

interface AccordionItem {
  question: string;
  answer: ReactNode;
}

// Native <details>/<summary>: expands without JavaScript. `name` groups
// items so opening one closes the others (degrades to multi-open).
export function Accordion({items, group, className}: {items: AccordionItem[]; group: string; className?: string}) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <details key={item.question} name={group} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold text-ink">
            {item.question}
            <ChevronDown className="size-5 shrink-0 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="pb-4 text-base text-text-body">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
