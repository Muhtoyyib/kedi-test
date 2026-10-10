import {beforeEach, describe, expect, it} from "vite-plus/test";
import {act, renderHook} from "@testing-library/react";
import fc from "fast-check";
import {catalog} from "@/lib/catalog/data";
import {cartReducer} from "@/lib/cart/reducer";
import {selectCount, selectHasAskPrice, selectLines, selectRemovedProducts, selectSubtotal} from "@/lib/cart/selectors";
import {CART_KEY, cartStore, dispatch, parseCart} from "@/lib/cart/store";
import {CART_MAX_LINES, CART_MAX_QTY, emptyCart, type Cart, type CartAction} from "@/lib/cart/types";
import {useCart} from "@/lib/cart/use-cart";

const priced = "KD-F001"; // ₦18,500
const askPrice = "KD-F002"; // priceNgn null
const outOfStock = "KD-F005"; // inStock false

describe("cartReducer", () => {
  it("adds new lines and merges existing ones, clamping at 20", () => {
    let cart = emptyCart;
    cart = cartReducer(cart, {type: "add", productId: "A", qty: 2}).cart;
    cart = cartReducer(cart, {type: "add", productId: "A", qty: 25}).cart;
    expect(cart.lines).toEqual([{productId: "A", qty: 20}]);
  });

  it("rejects a 21st distinct product with 'limit'", () => {
    let cart = emptyCart;
    for (let i = 0; i < CART_MAX_LINES; i++) cart = cartReducer(cart, {type: "add", productId: `P${i}`}).cart;
    const {cart: next, result} = cartReducer(cart, {type: "add", productId: "P20"});
    expect(result).toBe("limit");
    expect(next.lines).toHaveLength(CART_MAX_LINES);
  });

  it("clamps setQty to 1–20 and removes at zero", () => {
    let cart = cartReducer(emptyCart, {type: "add", productId: "A"}).cart;
    cart = cartReducer(cart, {type: "setQty", productId: "A", qty: 99}).cart;
    expect(cart.lines[0].qty).toBe(20);
    cart = cartReducer(cart, {type: "setQty", productId: "A", qty: 0}).cart;
    expect(cart.lines).toHaveLength(0);
  });

  it("supports remove and clear", () => {
    let cart = cartReducer(emptyCart, {type: "add", productId: "A"}).cart;
    cart = cartReducer(cart, {type: "add", productId: "B"}).cart;
    cart = cartReducer(cart, {type: "remove", productId: "A"}).cart;
    expect(cart.lines.map((l) => l.productId)).toEqual(["B"]);
    cart = cartReducer(cart, {type: "clear"}).cart;
    expect(cart.lines).toEqual([]);
  });

  it("always keeps cart limits — property test over random op sequences", () => {
    const op = fc.record({
      type: fc.constantFrom("add", "setQty", "remove", "clear") as fc.Arbitrary<CartAction["type"]>,
      productId: fc.constantFrom(...Array.from({length: 25}, (_, i) => `P${i}`)),
      qty: fc.integer({min: -5, max: 30}),
    });
    fc.assert(
      fc.property(fc.array(op, {maxLength: 60}), (ops) => {
        let cart = emptyCart;
        for (const op_ of ops) cart = cartReducer(cart, op_ as CartAction).cart;
        expect(cart.lines.length).toBeLessThanOrEqual(CART_MAX_LINES);
        expect(new Set(cart.lines.map((l) => l.productId)).size).toBe(cart.lines.length);
        for (const line of cart.lines) {
          expect(line.qty).toBeGreaterThanOrEqual(1);
          expect(line.qty).toBeLessThanOrEqual(CART_MAX_QTY);
        }
      })
    );
  });
});

describe("parseCart", () => {
  it("returns an empty cart for missing, corrupt or wrong-version data", () => {
    expect(parseCart(null).lines).toEqual([]);
    expect(parseCart("not json").lines).toEqual([]);
    expect(parseCart('{"version":2,"lines":[{"productId":"A","qty":1}]}').lines).toEqual([]);
    expect(parseCart('{"version":1,"lines":"oops"}').lines).toEqual([]);
  });

  it("drops malformed lines and truncates beyond 20", () => {
    const bad = parseCart(
      JSON.stringify({
        version: 1,
        lines: [{productId: "A", qty: 1}, {productId: "", qty: 1}, {productId: "B", qty: 0}, {productId: "C", qty: 21}, {qty: 2}, "x"],
      })
    );
    expect(bad.lines).toEqual([{productId: "A", qty: 1}]);
    const many = parseCart(JSON.stringify({version: 1, lines: Array.from({length: 30}, (_, i) => ({productId: `P${i}`, qty: 1}))}));
    expect(many.lines).toHaveLength(20);
  });
});

describe("cart store", () => {
  beforeEach(() => window.localStorage.clear());

  it("persists dispatched lines to localStorage[cart:v1]", () => {
    dispatch({type: "add", productId: "A", qty: 3});
    expect(JSON.parse(window.localStorage.getItem(CART_KEY)!)).toEqual({version: 1, lines: [{productId: "A", qty: 3}]});
  });

  it("syncs across tabs via the storage event", () => {
    const seen: Cart[] = [];
    const unsubscribe = cartStore.subscribe(() => seen.push(cartStore.getSnapshot()));
    window.localStorage.setItem(CART_KEY, JSON.stringify({version: 1, lines: [{productId: "X", qty: 3}]}));
    window.dispatchEvent(new StorageEvent("storage", {key: CART_KEY}));
    unsubscribe();
    expect(seen.at(-1)?.lines).toEqual([{productId: "X", qty: 3}]);
  });
});

describe("selectors", () => {
  const cart: Cart = {
    version: 1,
    lines: [
      {productId: priced, qty: 2},
      {productId: askPrice, qty: 1},
      {productId: outOfStock, qty: 1},
      {productId: "GONE", qty: 5},
    ],
  };

  it("prices lines, keeps out-of-stock, and excludes stale IDs", () => {
    const lines = selectLines(cart, catalog);
    expect(lines.map((l) => l.product.id)).toEqual([priced, askPrice, outOfStock]);
    expect(lines[0].lineTotalNgn).toBe(37000);
    expect(lines[1].lineTotalNgn).toBeNull();
    expect(selectRemovedProducts(cart, catalog)).toEqual(["GONE"]);
  });

  it("computes subtotal (excluding ask-price), count and ask-price flag", () => {
    const lines = selectLines(cart, catalog);
    expect(selectSubtotal(lines)).toBe(65000);
    expect(selectCount(lines)).toBe(4);
    expect(selectHasAskPrice(lines)).toBe(true);
    expect(selectHasAskPrice([lines[0]])).toBe(false);
  });
});

describe("useCart", () => {
  beforeEach(() => window.localStorage.clear());

  it("exposes live lines, count and subtotal", () => {
    const {result} = renderHook(() => useCart());
    act(() => result.current.add(priced, 2));
    expect(result.current.count).toBe(2);
    expect(result.current.subtotalNgn).toBe(37000);
    act(() => result.current.remove(priced));
    expect(result.current.lines).toHaveLength(0);
  });

  it("prunes stale product IDs on the next write", () => {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        version: 1,
        lines: [
          {productId: "GONE", qty: 1},
          {productId: priced, qty: 1},
        ],
      })
    );
    const {result} = renderHook(() => useCart());
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.removedIds).toEqual(["GONE"]);
    act(() => result.current.setQty(priced, 3));
    expect(JSON.parse(window.localStorage.getItem(CART_KEY)!).lines).toEqual([{productId: priced, qty: 3}]);
  });
});
