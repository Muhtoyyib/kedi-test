import {lazy, Suspense, useRef, useState} from "react";
import {cn} from "cn";
import type {Product} from "@/lib/catalog/types";
import {Badge} from "@/components/ui/badge";
import {ResponsiveImage} from "@/components/ui/responsive-image";

const ImageViewer = lazy(() => import("./image-viewer").then((m) => ({default: m.ImageViewer})));

function altAt(product: Product, i: number): string {
  return i === 0 ? `${product.name} — ${product.packSize}` : `${product.name} — image ${i + 1}`;
}

function OutOfStockBadge() {
  return (
    <Badge variant="out" className="absolute top-3 left-3">
      Out of stock
    </Badge>
  );
}

function StripDots({count, active, stripRef}: {count: number; active: number; stripRef: React.RefObject<HTMLDivElement | null>}) {
  if (count <= 1) return null;
  return (
    <div className="mt-3 flex justify-center gap-2">
      {Array.from({length: count}, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Show image ${i + 1} of ${count}`}
          aria-current={i === active}
          onClick={() => stripRef.current?.children[i]?.scrollIntoView({behavior: "smooth", inline: "start", block: "nearest"})}
          className={cn("size-2 rounded-full", i === active ? "bg-brand" : "bg-line-strong")}
        />
      ))}
    </div>
  );
}

// Mobile: scroll-snap strip with position dots.
function MobileStrip({
  product,
  onZoom,
  active,
  setActive,
  stripRef,
}: {
  product: Product;
  onZoom: () => void;
  active: number;
  setActive: (i: number) => void;
  stripRef: React.RefObject<HTMLDivElement | null>;
}) {
  const images = product.images;
  const onScroll = () => {
    const el = stripRef.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  return (
    <div className="relative md:hidden">
      <div
        ref={stripRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto"
        role="group"
        aria-label="Product photos"
      >
        {images.map((img, i) => (
          <button
            key={img.key}
            type="button"
            onClick={onZoom}
            className="w-full shrink-0 snap-start"
            aria-label={`Zoom ${altAt(product, i)}`}
          >
            <ResponsiveImage image={img} sizes="100vw" priority={i === 0} className="aspect-square w-full rounded-card" />
          </button>
        ))}
      </div>
      {!product.inStock ? <OutOfStockBadge /> : null}
      <StripDots count={images.length} active={active} stripRef={stripRef} />
    </div>
  );
}

// md+: main image with a thumbnail row that swaps it.
function DesktopGallery({
  product,
  onZoom,
  active,
  setActive,
}: {
  product: Product;
  onZoom: () => void;
  active: number;
  setActive: (i: number) => void;
}) {
  const images = product.images;
  return (
    <div className="relative max-md:hidden">
      <button type="button" onClick={onZoom} className="block w-full" aria-label={`Zoom ${altAt(product, active)}`}>
        <ResponsiveImage
          image={images[active]}
          sizes="(min-width: 768px) 45vw, 100vw"
          priority
          className="aspect-square w-full rounded-card"
        />
      </button>
      {!product.inStock ? <OutOfStockBadge /> : null}
      {images.length > 1 ? (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.key}
              type="button"
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={cn("size-18 shrink-0 rounded-field", i === active && "ring-2 ring-brand")}
            >
              <ResponsiveImage image={img} sizes="72px" className="aspect-square rounded-field" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Tap opens the lazy full-screen viewer. First image is priority (LCP).
export function ImageGallery({product}: {product: Product}) {
  const [active, setActive] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const images = product.images;
  if (images.length === 0) return null;

  return (
    <div>
      <MobileStrip product={product} onZoom={() => setViewerOpen(true)} active={active} setActive={setActive} stripRef={stripRef} />
      <DesktopGallery product={product} onZoom={() => setViewerOpen(true)} active={active} setActive={setActive} />
      {viewerOpen ? (
        <Suspense fallback={null}>
          <ImageViewer images={images} index={active} alt={(i) => altAt(product, i)} onClose={() => setViewerOpen(false)} />
        </Suspense>
      ) : null}
    </div>
  );
}
