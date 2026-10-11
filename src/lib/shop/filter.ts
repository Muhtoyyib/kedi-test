import {getCategory} from "@/lib/catalog/categories";
import type {Product} from "@/lib/catalog/types";

export const SHOP_SORTS = ["recommended", "price-asc", "price-desc", "name"] as const;
export type ShopSort = (typeof SHOP_SORTS)[number];

export function isShopSort(value: string | undefined): value is ShopSort {
  return value !== undefined && (SHOP_SORTS as readonly string[]).includes(value);
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Category-name resolver — injectable for tests; defaults to shell data. */
export type CategoryNamer = (slug: string) => string;
const defaultNamer: CategoryNamer = (slug) => getCategory(slug)?.name ?? slug;

/** Every whitespace-separated term must appear somewhere in the searchable
 * text (name, benefit, category name, pack size). Case and accents ignored. */
export function searchProducts(items: Product[], term: string, namer: CategoryNamer = defaultNamer): Product[] {
  const words = normalize(term).split(" ").filter(Boolean);
  if (words.length === 0) return items;
  return items.filter((p) => {
    const haystack = normalize(`${p.name} ${p.shortBenefit} ${namer(p.categorySlug)} ${p.packSize}`);
    return words.every((w) => haystack.includes(w));
  });
}

function byPrice(direction: 1 | -1) {
  return (a: Product, b: Product): number => {
    if (a.priceNgn === null && b.priceNgn === null) return 0;
    if (a.priceNgn === null) return 1; // ask-price always sorts last
    if (b.priceNgn === null) return -1;
    return (a.priceNgn - b.priceNgn) * direction;
  };
}

/**
 * recommended — catalog order with in-stock items first.
 * price-asc / price-desc — priced items in order; ask-price items last.
 * name — alphabetical. Always returns a new array.
 */
export function sortProducts(items: Product[], sort: ShopSort): Product[] {
  const sorted = [...items];
  if (sort === "recommended") {
    sorted.sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.sortOrder - b.sortOrder);
  } else if (sort === "price-asc") {
    sorted.sort(byPrice(1));
  } else if (sort === "price-desc") {
    sorted.sort(byPrice(-1));
  } else {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}
