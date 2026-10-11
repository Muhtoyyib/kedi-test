import {useEffect, useState, useSyncExternalStore} from "react";
import {cn} from "cn";
import {cartDrawer} from "@/lib/cart/drawer-state";
import type {Product} from "@/lib/catalog/types";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {outOfStockMessage, productAskMessage} from "@/lib/whatsapp/messages";
import {AddToCartButton} from "@/features/cart/add-to-cart-button";
import {Button} from "@/components/ui/button";
import {Price} from "@/components/ui/price";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {WhatsAppIcon} from "@/components/ui/whatsapp-icon";

function BarContent({product, askHref}: {product: Product; askHref: string}) {
  const thumb = product.images[0];
  return (
    <div className="flex items-center gap-3">
      {thumb ? <ResponsiveImage image={thumb} sizes="40px" className="size-10 shrink-0 rounded-field" /> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
        <Price amountNgn={product.priceNgn} size="sm" className="font-bold" />
      </div>
      {product.inStock ? (
        <>
          <AddToCartButton product={product} variant="sticky" className="shrink-0" />
          <a
            href={askHref}
            target="_blank"
            rel="noopener"
            aria-label={`Ask about ${product.name} on WhatsApp`}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-whatsapp text-whatsapp-ink"
          >
            <WhatsAppIcon size={22} />
          </a>
        </>
      ) : (
        <Button variant="whatsapp" size="md" href={askHref} target="_blank" rel="noopener" className="shrink-0">
          Ask when back in stock
        </Button>
      )}
    </div>
  );
}

// Phones only: appears once the purchase panel's CTA scrolls out of view,
// hides while the cart drawer is open, and rides above the cookie bar via
// its --cookie-bar-h property. Slides up (disabled under reduced motion).
export function StickyBuyBar({product}: {product: Product}) {
  const [pastAnchor, setPastAnchor] = useState(false);
  const drawerOpen = useSyncExternalStore(cartDrawer.subscribe, cartDrawer.getSnapshot, cartDrawer.getServerSnapshot);
  const visible = pastAnchor && !drawerOpen;

  useEffect(() => {
    const anchor = document.getElementById("buy-anchor");
    if (!anchor || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setPastAnchor(!entry.isIntersecting && entry.boundingClientRect.bottom < 0), {
      rootMargin: "-72px 0px 0px 0px",
    });
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  const askHref = buildWhatsAppLink(product.inStock ? productAskMessage(product) : outOfStockMessage(product));
  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas px-4 pt-3 pb-safe-comfortable shadow-overlay md:hidden",
        "bottom-[max(0px,var(--cookie-bar-h,0px))]",
        "motion-safe:transition-transform motion-safe:duration-200",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <BarContent product={product} askHref={askHref} />
    </div>
  );
}
