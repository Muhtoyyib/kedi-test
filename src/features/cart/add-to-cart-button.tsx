import {useEffect, useRef, useState} from "react";
import {Plus} from "lucide-react";
import {cn} from "cn";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@/components/ui/visually-hidden";
import {useToast} from "@/components/ui/toast";
import {track} from "@/lib/analytics/track";
import {cartDrawer} from "@/lib/cart/drawer-state";
import {useCart, type CartApi} from "@/lib/cart/use-cart";
import type {CartLocation} from "@/lib/analytics/events";
import type {Product} from "@/lib/catalog/types";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {outOfStockMessage} from "@/lib/whatsapp/messages";
import {QuantityStepper} from "./quantity-stepper";

export type AddToCartVariant = "card" | "pdp" | "sticky";

const LOCATIONS: Record<AddToCartVariant, CartLocation> = {card: "card", pdp: "pdp", sticky: "sticky_bar"};
const SIZES: Record<AddToCartVariant, "sm" | "md" | "lg"> = {card: "sm", pdp: "lg", sticky: "md"};

interface AddToCartButtonProps {
  product: Product;
  variant: AddToCartVariant;
  className?: string;
}

// The add-to-order control for cards, the PDP and sticky bars. Ask-price
// products stay addable; out-of-stock swaps to an "Ask on WhatsApp" link.
export function AddToCartButton({product, variant, className}: AddToCartButtonProps) {
  const cart = useCart();
  const [qty, setQty] = useState(1);
  const {added, onAdd} = useAddFeedback({product, variant, qty, add: cart.add});

  if (!product.inStock) return <OutOfStockButton product={product} className={className} />;

  const inCartQty = cart.lines.find((l) => l.product.id === product.id)?.qty ?? 0;
  const askPrice = product.priceNgn === null;

  return (
    <div className={className}>
      <div className={cn("flex", variant === "card" ? "flex-col items-stretch gap-1" : "items-center gap-3")}>
        {variant === "pdp" ? <QuantityStepper qty={qty} onChange={setQty} /> : null}
        <Button variant="primary" size={SIZES[variant]} fullWidth={variant === "card"} onClick={onAdd}>
          {variant === "card" && !added ? <Plus className="size-4" aria-hidden="true" /> : null}
          {buttonLabel({added, askPrice, inCart: inCartQty > 0, variant})}
        </Button>
        <VisuallyHidden>
          <span aria-live="polite">{added ? `${product.name} added to cart` : ""}</span>
        </VisuallyHidden>
      </div>
      <StatusLines askPrice={askPrice} inCartQty={inCartQty} variant={variant} />
    </div>
  );
}

function StatusLines({askPrice, inCartQty, variant}: {askPrice: boolean; inCartQty: number; variant: AddToCartVariant}) {
  // pdp suppresses this — its price block already carries the same helper.
  if (askPrice) return variant === "pdp" ? null : <p className="mt-1 text-sm text-text-muted">We'll confirm the price on WhatsApp</p>;
  if (inCartQty > 0 && variant !== "pdp") return <p className="mt-1 text-sm text-leaf-strong">In your cart: {inCartQty}</p>;
  return null;
}

function buttonLabel(input: {added: boolean; askPrice: boolean; inCart: boolean; variant: AddToCartVariant}): string {
  if (input.added) return "Added ✓";
  if (input.askPrice) return "Add to order";
  return input.inCart && input.variant !== "pdp" ? "Add another" : "Add to cart";
}

function OutOfStockButton({product, className}: {product: Product; className?: string}) {
  return (
    <Button
      variant="whatsapp"
      size="sm"
      href={buildWhatsAppLink(outOfStockMessage(product))}
      target="_blank"
      rel="noopener"
      onClick={() => track({event: "whatsapp_chat_click", location: "out_of_stock", context: product.id})}
      className={className}
    >
      Ask on WhatsApp
    </Button>
  );
}

// Adds to the cart, then gives 1.5 s of "Added ✓" feedback, a live-region
// announcement and a toast with a "View cart" action.
function useAddFeedback(input: {product: Product; variant: AddToCartVariant; qty: number; add: CartApi["add"]}) {
  const {product, variant, qty, add} = input;
  const toast = useToast();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onAdd = () => {
    if (add(product.id, qty) === "limit") {
      toast.show({message: "Your cart is full. Send this order first, or message us for large orders."});
      return;
    }
    track({event: "add_to_cart", item_id: product.id, quantity: qty, price: product.priceNgn ?? undefined, location: LOCATIONS[variant]});
    toast.show({message: `Added to cart · ${product.name}`, action: {label: "View cart", onClick: () => cartDrawer.open()}});
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1500);
  };

  return {added, onAdd};
}
