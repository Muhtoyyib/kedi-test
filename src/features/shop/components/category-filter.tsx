import {useEffect, useRef} from "react";
import {cn} from "cn";
import {track} from "@/lib/analytics/track";
import type {Category} from "@/lib/catalog/types";

interface CategoryFilterProps {
  categories: Category[];
  /** Category slug → product count (active products only). */
  counts: Map<string, number>;
  total: number;
  activeSlug: string | null;
  /** Preserve ?q= and ?sort= when switching listings. */
  search: {q?: string; sort?: string};
}

function searchSuffix(search: {q?: string; sort?: string}): string {
  const params = new URLSearchParams();
  if (search.q) params.set("q", search.q);
  if (search.sort) params.set("sort", search.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
}

const chip = (active: boolean) =>
  cn(
    "flex h-10 shrink-0 snap-start items-center rounded-full border px-4 text-sm font-semibold",
    active ? "border-brand bg-brand text-canvas" : "border-line bg-canvas text-ink"
  );

// Sticky chip row of real links — works without JS; the active chip is
// scrolled into view on mount.
export function CategoryFilter({categories, counts, total, activeSlug, search}: CategoryFilterProps) {
  const navRef = useRef<HTMLElement>(null);
  const suffix = searchSuffix(search);

  useEffect(() => {
    const active = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (typeof active?.scrollIntoView === "function") active.scrollIntoView({inline: "center", block: "nearest"});
  }, [activeSlug]);

  return (
    <nav
      ref={navRef}
      aria-label="Product categories"
      className="sticky top-16 z-30 border-b border-line bg-canvas/95 py-3 backdrop-blur md:static lg:top-18"
    >
      <ul className="no-scrollbar mx-auto flex max-w-6xl snap-x gap-2 overflow-x-auto px-4 md:flex-wrap md:overflow-visible md:px-6 lg:px-8">
        <li className="contents">
          <a href={`/shop${suffix}`} className={chip(activeSlug === null)} aria-current={activeSlug === null ? "page" : undefined}>
            All products <span className="ml-1 opacity-80">({total})</span>
          </a>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug} className="contents">
            <a
              href={`/shop/${cat.slug}${suffix}`}
              className={chip(activeSlug === cat.slug)}
              aria-current={activeSlug === cat.slug ? "page" : undefined}
              onClick={() => track({event: "filter_category", category: cat.slug})}
            >
              {cat.name} <span className="ml-1 opacity-80">({counts.get(cat.slug) ?? 0})</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
