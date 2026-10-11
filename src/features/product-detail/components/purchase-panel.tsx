import {BadgeCheck, MessageCircleHeart, Truck} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {getCategory} from "@/lib/catalog/categories";
import type {Product} from "@/lib/catalog/types";
import {formatPackDuration} from "@/lib/format/pack-duration";
import {siteConfig} from "@/lib/site-config";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {outOfStockMessage, productAskMessage} from "@/lib/whatsapp/messages";
import {AddToCartButton} from "@/features/cart/add-to-cart-button";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Price} from "@/components/ui/price";

const TRUST_LINES = [
  {icon: BadgeCheck, text: "Genuine KEDI product"},
  {icon: Truck, text: `Delivery across ${siteConfig.city}: fee confirmed on WhatsApp`},
  {icon: MessageCircleHeart, text: "We'll check in after delivery to help you use it well"},
] as const;

function TrustLines() {
  return (
    <ul className="mt-6 space-y-2 text-sm text-text-body">
      {TRUST_LINES.map(({icon: Icon, text}) => (
        <li key={text} className="flex items-start gap-2">
          <Icon className="mt-0.5 size-4 shrink-0 text-leaf-strong" aria-hidden="true" />
          <span>
            {text}
            {text.includes("fee confirmed") ? (
              <>
                {" "}
                <a href="/delivery-and-returns" className="font-semibold text-brand-strong underline underline-offset-2">
                  Delivery info
                </a>
              </>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

// The decision panel: what it is, price, availability, and the two ways to
// proceed. Sticky on md+ (caller sets the sticky class on the wrapper).
export function PurchasePanel({product}: {product: Product}) {
  const category = getCategory(product.categorySlug);
  const askHref = buildWhatsAppLink(product.inStock ? productAskMessage(product) : outOfStockMessage(product));

  return (
    <div className="bg-canvas">
      {category ? (
        <a href={`/shop/${category.slug}`} className="text-eyebrow font-bold uppercase text-brand-strong">
          {category.name}
        </a>
      ) : null}
      <h1 className="mt-1 text-h1 text-ink">{product.name}</h1>
      <p className="mt-3 text-lead text-text-body">{product.shortBenefit}</p>
      <p className="mt-2 text-sm text-text-muted">
        {product.packSize} · {formatPackDuration(product.packDays)}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <Price amountNgn={product.priceNgn} size="lg" />
        <Badge variant={product.inStock ? "stock" : "out"}>{product.inStock ? "In stock" : "Out of stock"}</Badge>
      </div>
      {product.priceNgn === null ? <p className="mt-1 text-sm text-text-muted">We'll confirm the price on WhatsApp</p> : null}
      <div id="buy-anchor" className="mt-6">
        {product.inStock ? <AddToCartButton product={product} variant="pdp" /> : null}
        <Button
          variant="whatsapp"
          size="lg"
          fullWidth
          className="mt-3"
          href={askHref}
          target="_blank"
          rel="noopener"
          onClick={() => track({event: "whatsapp_chat_click", location: "pdp_ask", context: product.id})}
        >
          {product.inStock ? "Ask about this product on WhatsApp" : "Ask when it's back in stock"}
        </Button>
      </div>
      <TrustLines />
    </div>
  );
}
