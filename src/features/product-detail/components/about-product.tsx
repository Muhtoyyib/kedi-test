import {useState} from "react";
import {cn} from "cn";
import type {Product} from "@/lib/catalog/types";

// "About this product" — approved description paragraphs verbatim and the
// key-ingredients list. Beyond 3 paragraphs the rest hide behind a "Read
// more" toggle on mobile (full text stays in the HTML; no-JS shows all).
export function AboutProduct({product}: {product: Product}) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = product.description.length > 3;

  return (
    <section id="about" className="scroll-mt-28">
      <h2 className="text-h2 text-ink">About this product</h2>
      <div className="mt-4 max-w-prose space-y-4 text-base text-text-body">
        {product.description.map((p, i) => (
          <p key={i} className={cn(collapsible && !expanded && i >= 2 && "max-md:hidden")}>
            {p}
          </p>
        ))}
      </div>
      {collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 font-semibold text-brand-strong underline underline-offset-2 md:hidden"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      ) : null}
      {product.ingredients.length > 0 ? (
        <>
          <h3 className="mt-6 text-h3 text-ink">Key ingredients</h3>
          <ul className="mt-3 space-y-2 text-base text-text-body md:columns-2">
            {product.ingredients.map((ing) => (
              <li key={ing} className="flex items-center gap-2 break-inside-avoid">
                <span className="size-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                {ing}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
