import {useNavigate, useSearch} from "@tanstack/react-router";
import {isShopSort, type ShopSort} from "@/lib/shop/filter";
import type {UntrustedRecord} from "@/lib/untrusted";

/** Shared ?q= / ?sort= parser — both shop routes use it in validateSearch. */
export function validateShopSearch(search: UntrustedRecord) {
  return {
    q: typeof search.q === "string" && search.q.trim() !== "" ? search.q : undefined,
    sort: typeof search.sort === "string" && isShopSort(search.sort) ? search.sort : undefined,
  };
}

export interface ShopQuery {
  q: string;
  sort: ShopSort;
}

/** Shared ?q= / ?sort= state for /shop and /shop/{category}. validateSearch on
 * the routes keeps the URL clean; this hook is the read/write API. */
export function useShopQuery(): {query: ShopQuery; setQuery: (next: Partial<ShopQuery>) => void} {
  const search = useSearch({strict: false}) as {q?: string; sort?: string};
  const navigate = useNavigate();
  const query: ShopQuery = {q: search.q ?? "", sort: isShopSort(search.sort) ? search.sort : "recommended"};

  const setQuery = (next: Partial<ShopQuery>) => {
    void navigate({
      to: ".",
      replace: true,
      search: (prev) => ({
        ...prev,
        q: next.q !== undefined ? next.q || undefined : prev.q,
        sort: next.sort !== undefined ? next.sort : prev.sort,
      }),
    });
  };

  return {query, setQuery};
}
