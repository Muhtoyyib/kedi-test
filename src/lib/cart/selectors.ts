// Cart + catalog projections. Lines whose productId is not in the current
// catalog are filtered out of display (storage keeps them until the next
// write prunes them).

import type {Catalog, Product} from "@/lib/catalog/types";
import type {Cart} from "./types";

export interface PricedLine {
  product: Product;
  qty: number;
  /** null for ask-for-price products. */
  lineTotalNgn: number | null;
}

export function selectLines(cart: Cart, cat: Catalog): PricedLine[] {
  const byId = new Map(cat.products.map((p) => [p.id, p]));
  return cart.lines.flatMap((line) => {
    const product = byId.get(line.productId);
    if (!product) return [];
    const lineTotalNgn = product.priceNgn === null ? null : product.priceNgn * line.qty;
    return [{product, qty: line.qty, lineTotalNgn}];
  });
}

export function selectSubtotal(lines: PricedLine[]): number {
  return lines.reduce((sum, l) => sum + (l.lineTotalNgn ?? 0), 0);
}

export function selectHasAskPrice(lines: PricedLine[]): boolean {
  return lines.some((l) => l.lineTotalNgn === null);
}

export function selectCount(lines: PricedLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

/** Product IDs in the cart that aren't in the current catalog. */
export function selectRemovedProducts(cart: Cart, cat: Catalog): string[] {
  const byId = new Set(cat.products.map((p) => p.id));
  return cart.lines.filter((l) => !byId.has(l.productId)).map((l) => l.productId);
}
