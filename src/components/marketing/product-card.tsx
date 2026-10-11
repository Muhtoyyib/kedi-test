import {cn} from "cn";
import {getCategory} from "@/lib/catalog/categories";
import {formatPackDuration} from "@/lib/format/pack-duration";
import type {Product} from "@/lib/catalog/types";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {Price} from "@/components/ui/price";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {AddToCartButton} from "@/features/cart/add-to-cart-button";

const SIZES = "(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw";

interface ProductCardProps {
  product: Product;
  /** "compact" tightens padding/typography for dense listings (e.g. related). */
  density?: "full" | "compact";
  /** Eager-load the image — use for the first few cards in a listing. */
  priority?: boolean;
  onSelect?: (product: Product) => void;
}

// The name link is stretched (after:inset-0) over the image and text so the
// whole card is one tap target; the add button sits above it (z-10).
export function ProductCard({product, density = "full", priority = false, onSelect}: ProductCardProps) {
  const compact = density === "compact";
  const category = getCategory(product.categorySlug);
  return (
    <Card interactive className={cn("relative flex flex-col", compact ? "p-3" : "p-3 md:p-4")}>
      <div className="relative overflow-hidden rounded-field bg-brand-soft">
        {product.images[0] ? (
          <ResponsiveImage image={product.images[0]} sizes={SIZES} priority={priority} className="aspect-square" />
        ) : (
          <div className="aspect-square" aria-hidden="true" />
        )}
        {!product.inStock ? (
          <Badge variant="out" className="absolute top-2 left-2">
            Out of stock
          </Badge>
        ) : null}
      </div>
      {category ? <p className="mt-3 text-eyebrow text-brand-strong">{category.name}</p> : null}
      <h3 className={cn("mt-1 font-bold text-ink", compact ? "text-base" : "text-base md:text-lg")}>
        <a href={`/products/${product.slug}`} className="line-clamp-2 after:absolute after:inset-0" onClick={() => onSelect?.(product)}>
          {product.name}
        </a>
      </h3>
      <p className={cn("mt-1 text-sm text-text-body line-clamp-2", compact && "max-[380px]:hidden")}>{product.shortBenefit}</p>
      <p className="mt-1 text-sm text-text-muted">
        {product.packSize} · {formatPackDuration(product.packDays)}
      </p>
      <div className="mt-2">
        <Price amountNgn={product.priceNgn} size={compact ? "sm" : "md"} />
      </div>
      <div className="relative z-10 mt-auto pt-3">
        <AddToCartButton product={product} variant="card" />
      </div>
    </Card>
  );
}
