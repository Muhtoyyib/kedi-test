import {useEffect, useRef} from "react";
import {track} from "@/lib/analytics/track";
import {getCategories} from "@/lib/catalog/categories";
import type {Product} from "@/lib/catalog/types";
import {Button} from "@/components/ui/button";
import {ProductCard} from "@/components/marketing/product-card";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

const LIST_ID = "home_featured";

function CategoryShortcuts() {
  const cats = getCategories().slice(0, 6);
  return (
    <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
      {cats.map((c) => (
        <a
          key={c.slug}
          href={`/shop/${c.slug}`}
          className="flex h-10 shrink-0 items-center rounded-full border border-line bg-canvas px-4 text-sm font-semibold text-ink"
        >
          {c.name}
        </a>
      ))}
      <a
        href="/shop"
        className="flex h-10 shrink-0 items-center rounded-full border border-brand bg-canvas px-4 text-sm font-semibold text-brand-strong"
      >
        All
      </a>
    </div>
  );
}

// Up to 8 featured products as cards; phones see the first 4 (rest are
// max-md:hidden so the HTML is identical). view_item_list fires once when
// the grid scrolls into view.
export function FeaturedProducts({products}: {products: Product[]}) {
  const ref = useRef<HTMLUListElement>(null);
  const seenRef = useRef(false);

  useEffect(() => {
    const fire = () => {
      if (seenRef.current) return;
      seenRef.current = true;
      track({event: "view_item_list", item_list_id: LIST_ID, items: products.map((p) => p.id)});
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
  }, [products]);

  if (products.length === 0) return null;
  return (
    <SiteSection tone="brand-soft">
      <div className="md:flex md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Shop"
          title="Featured products"
          description="Popular picks from our range. Not sure which suits you? Ask us."
        />
        <Button variant="secondary" href="/shop" className="max-md:hidden">
          View all products
        </Button>
      </div>
      <CategoryShortcuts />
      <ul ref={ref} className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <li key={p.id} className={i >= 4 ? "max-md:hidden md:contents" : "contents"}>
            <ProductCard product={p} density="compact" />
          </li>
        ))}
      </ul>
      <Button variant="secondary" href="/shop" fullWidth className="mt-6 md:hidden">
        View all products
      </Button>
    </SiteSection>
  );
}
