import {useEffect, useRef, useState} from "react";
import {Search, X} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {SHOP_SORTS, type ShopSort} from "@/lib/shop/filter";
import {useShopQuery, type ShopQuery} from "@/features/shop/use-shop-query";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {VisuallyHidden} from "@/components/ui/visually-hidden";

const SORT_LABELS: Record<ShopSort, string> = {
  recommended: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name A–Z",
};

// Local echo of ?q= — typing feels instant; the URL catches up after 300ms
// and the `search` analytics event after 800ms (terms of 2+ chars only).
function useDebouncedSearch(query: ShopQuery, setQuery: (next: Partial<ShopQuery>) => void) {
  const [value, setValue] = useState(query.q);
  const urlTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const trackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => (clearTimeout(urlTimer.current), clearTimeout(trackTimer.current)), []);

  // External q changes (category links, back/forward) sync into the field.
  const [prevQ, setPrevQ] = useState(query.q);
  if (prevQ !== query.q) {
    setPrevQ(query.q);
    setValue(query.q);
  }

  const onSearch = (next: string) => {
    setValue(next);
    clearTimeout(urlTimer.current);
    urlTimer.current = setTimeout(() => setQuery({q: next}), 300);
    clearTimeout(trackTimer.current);
    const term = next.trim();
    if (term.length >= 2) trackTimer.current = setTimeout(() => track({event: "search", search_term: term}), 800);
  };
  return {value, onSearch};
}

function SearchField({value, onSearch}: {value: string; onSearch: (next: string) => void}) {
  return (
    <div className="relative flex-1">
      <VisuallyHidden>
        <label htmlFor="shop-search">Search products</label>
      </VisuallyHidden>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
      <Input
        id="shop-search"
        type="search"
        name="q"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by product name"
        enterKeyHint="search"
        className="pl-9"
      />
      {value !== "" ? (
        <button
          type="button"
          onClick={() => onSearch("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center text-text-muted"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function SortSelect({value, onChange}: {value: ShopSort; onChange: (sort: ShopSort) => void}) {
  return (
    <div className="md:w-56">
      <label htmlFor="shop-sort" className="mb-1 block text-sm font-semibold text-text-heading max-md:sr-only">
        Sort
      </label>
      <Select id="shop-sort" name="sort" value={value} onChange={(e) => onChange(e.target.value as ShopSort)} className="w-full">
        {SHOP_SORTS.map((s) => (
          <option key={s} value={s}>
            {s === "recommended" ? "Sort: Recommended" : SORT_LABELS[s]}
          </option>
        ))}
      </Select>
    </div>
  );
}

// Instant search + sort bound to ?q= / ?sort=. With JS off the plain
// method="get" form still submits q (static pages just show everything).
export function SearchAndSort({total, shown}: {total: number; shown: number}) {
  const {query, setQuery} = useShopQuery();
  const {value, onSearch} = useDebouncedSearch(query, setQuery);
  const filtering = query.q.trim() !== "" || query.sort !== "recommended";

  return (
    <form
      method="get"
      action=""
      className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-end md:px-6 lg:px-8"
      onSubmit={(e) => e.preventDefault()}
    >
      <SearchField value={value} onSearch={onSearch} />
      <SortSelect value={query.sort} onChange={(sort) => setQuery({sort})} />
      <p aria-live="polite" className="text-sm text-text-muted md:self-center">
        {filtering ? `Showing ${shown} of ${total} products` : `${total} products`}
      </p>
    </form>
  );
}
