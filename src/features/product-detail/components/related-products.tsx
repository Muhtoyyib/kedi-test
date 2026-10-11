import {useEffect, useRef} from "react";
import {track} from "@/lib/analytics/track";
import {getRelatedProducts} from "@/lib/catalog/products";
import type {Product} from "@/lib/catalog/types";
import {ProductCard} from "@/components/marketing/product-card";
import {SiteSection} from "@/components/marketing/site-section";

// "You may also like" — client's chosen related products first, then
// same-category fill (getRelatedProducts handles the order). Mobile is a
// scroll-snap row; hidden when nothing else exists. view_item_list fires once
// when the band scrolls into view.
export function RelatedProducts({product}: {product: Product}) {
  const related = getRelatedProducts(product, 4);
  const signature = related.map((p) => p.id).join(",");
  const ref = useRef<HTMLUListElement>(null);
  const fired = useRef("");

  useEffect(() => {
    const fire = () => {
      if (fired.current === signature || signature === "") return;
      fired.current = signature;
      track({event: "view_item_list", item_list_id: "related", items: signature.split(",")});
    };
    const node = ref.current;
    if (typeof IntersectionObserver === "undefined" || !node) {
      fire();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) fire();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [signature]);

  if (related.length === 0) return null;
  return (
    <SiteSection tone="brand-soft" spacing="tight" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-h2 text-ink">
        You may also like
      </h2>
      <ul
        ref={ref}
        className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0"
      >
        {related.map((p) => (
          <li key={p.id} className="w-[70%] shrink-0 snap-start md:w-auto">
            <ProductCard product={p} density="compact" />
          </li>
        ))}
      </ul>
    </SiteSection>
  );
}
