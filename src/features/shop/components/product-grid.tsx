import {useEffect, useRef} from "react";
import {track} from "@/lib/analytics/track";
import type {Product} from "@/lib/catalog/types";
import {ProductCard} from "@/components/marketing/product-card";

interface ProductGridProps {
  items: Product[];
  /** Identifies the result set for analytics (e.g. "shop", "shop:energy-vitality"). */
  listId: string;
  density?: "full" | "compact";
}

// Two columns on phones, three on tablets, four on desktops. Fires
// view_item_list once per distinct result set when scrolled into view
// (immediately where IntersectionObserver is unavailable).
export function ProductGrid({items, listId, density}: ProductGridProps) {
  const ref = useRef<HTMLUListElement>(null);
  const seenRef = useRef("");
  const signature = `${listId}:${items.map((p) => p.id).join(",")}`;

  useEffect(() => {
    const seen = seenRef;
    const fire = () => {
      if (seen.current === signature || items.length === 0) return;
      seen.current = signature;
      track({event: "view_item_list", item_list_id: listId, items: items.map((p) => p.id)});
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
  }, [signature, items, listId]);

  return (
    <ul ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {items.map((product, index) => (
        <li key={product.id} className="contents">
          <ProductCard
            product={product}
            density={density}
            priority={index < 4}
            onSelect={() => track({event: "select_item", item_list_id: listId, item_id: product.id})}
          />
        </li>
      ))}
    </ul>
  );
}
