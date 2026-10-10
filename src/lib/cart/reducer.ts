// Pure cart reducer. `result: "limit"` means the action was refused because
// the cart is at capacity — the UI shows the cart-full message.

import {CART_MAX_LINES, CART_MAX_QTY, type Cart, type CartAction} from "./types";

export type CartResult = "ok" | "limit";

const clampQty = (qty: number) => Math.max(1, Math.min(CART_MAX_QTY, Math.floor(qty)));

export function cartReducer(cart: Cart, action: CartAction): {cart: Cart; result: CartResult} {
  switch (action.type) {
    case "add":
      return add(cart, action.productId, action.qty ?? 1);
    case "setQty":
      return {cart: setQty(cart, action.productId, action.qty), result: "ok"};
    case "remove":
      return {cart: {...cart, lines: cart.lines.filter((l) => l.productId !== action.productId)}, result: "ok"};
    case "clear":
      return {cart: {...cart, lines: []}, result: "ok"};
  }
}

function add(cart: Cart, productId: string, qty: number): {cart: Cart; result: CartResult} {
  const existing = cart.lines.find((l) => l.productId === productId);
  if (existing) {
    const lines = cart.lines.map((l) => (l.productId === productId ? {...l, qty: clampQty(l.qty + qty)} : l));
    return {cart: {...cart, lines}, result: "ok"};
  }
  if (cart.lines.length >= CART_MAX_LINES) return {cart, result: "limit"};
  return {cart: {...cart, lines: [...cart.lines, {productId, qty: clampQty(qty)}]}, result: "ok"};
}

function setQty(cart: Cart, productId: string, qty: number): Cart {
  if (qty <= 0) return {...cart, lines: cart.lines.filter((l) => l.productId !== productId)};
  const lines = cart.lines.map((l) => (l.productId === productId ? {...l, qty: clampQty(qty)} : l));
  return {...cart, lines};
}
