// Cart model (change 05, sections/01-cart-store). Lines keep insertion
// order — the drawer and the order message list them in the order added.

export const CART_MAX_LINES = 20;
export const CART_MAX_QTY = 20;

export interface CartLine {
  productId: string;
  qty: number;
}

export interface Cart {
  version: 1;
  lines: CartLine[];
}

export type CartAction =
  | {type: "add"; productId: string; qty?: number}
  | {type: "setQty"; productId: string; qty: number}
  | {type: "remove"; productId: string}
  | {type: "clear"};

export const emptyCart: Cart = {version: 1, lines: []};
