import {Badge} from "@/components/ui/badge";
import {Price} from "@/components/ui/price";
import {formatNaira} from "@/lib/format/naira";
import type {CartApi} from "@/lib/cart/use-cart";
import type {PricedLine} from "@/lib/cart/selectors";
import {QuantityStepper} from "./quantity-stepper";

// One editable row in the cart drawer: image, name + pack, unit price,
// stepper, remove, line total. Out-of-stock since adding → badge.
export function CartLine({line, cart}: {line: PricedLine; cart: CartApi}) {
  const {product, qty, lineTotalNgn} = line;
  const image = product.images[0];
  return (
    <li className="flex min-h-24 gap-3 py-4">
      <div className="size-16 shrink-0 overflow-hidden rounded-field bg-brand-soft">
        {image ? (
          <img src={image.variants[0]?.webp} alt="" width={64} height={64} className="size-full object-cover" loading="lazy" />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 font-semibold text-ink">{product.name}</p>
            <p className="text-sm text-text-muted">{product.packSize}</p>
          </div>
          <p className="shrink-0 font-bold tabular-nums">{lineTotalNgn === null ? "—" : formatNaira(lineTotalNgn)}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <QuantityStepper size="sm" qty={qty} onChange={(next) => cart.setQty(product.id, next)} />
          <div className="flex items-center gap-3">
            {lineTotalNgn === null ? (
              <span className="text-sm text-text-muted">Price to confirm</span>
            ) : (
              <span className="text-sm text-text-muted">
                <Price amountNgn={product.priceNgn} size="sm" /> each
              </span>
            )}
            {!product.inStock ? <Badge variant="out">Out of stock — we'll confirm</Badge> : null}
            <button
              type="button"
              aria-label={`Remove ${product.name}`}
              onClick={() => cart.remove(product.id)}
              className="min-h-11 px-1 text-sm font-medium text-brand-strong underline underline-offset-4 hover:no-underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
