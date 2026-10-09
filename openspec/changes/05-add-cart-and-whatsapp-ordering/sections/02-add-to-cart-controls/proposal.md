## Why

Adding to the cart must be one tap from a product card, product page or sticky bar, with clear feedback, and must behave sensibly for out-of-stock and ask-for-price products.

## What Changes

- `AddToCartButton` (`variant: "card" | "pdp" | "sticky"`) and `QuantityStepper`.
- Feedback: the button label changes to "Added ✓" for 1.5 s, the header badge updates, and a toast "Added to cart" appears with a **View cart** action.
- Out of stock: the control becomes "Ask on WhatsApp" (out-of-stock message).

Spec: `../../specs/ordering/add-to-cart/spec.md`

## Impact

- `src/features/cart/add-to-cart-button.tsx`, `quantity-stepper.tsx`
- Used by `ProductCard` (11), product page purchase panel and sticky bar (12), and featured products (10).
