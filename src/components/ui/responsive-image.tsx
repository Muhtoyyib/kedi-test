import {cn} from "cn";
import type {GeneratedImage} from "@/lib/catalog/types";

interface ResponsiveImageProps {
  image: GeneratedImage;
  sizes: string;
  priority?: boolean;
  className?: string;
}

function srcSet(variants: GeneratedImage["variants"], key: "avif" | "webp") {
  return variants.map((v) => `${v[key]} ${v.width}w`).join(", ");
}

export function ResponsiveImage({image, sizes, priority = false, className}: ResponsiveImageProps) {
  const fallback = image.variants.find((v) => v.width === 768)?.webp ?? image.variants.at(-1)?.webp;

  return (
    <div className={cn("overflow-hidden bg-brand-soft", className)}>
      {fallback ? (
        <picture>
          <source type="image/avif" srcSet={srcSet(image.variants, "avif")} sizes={sizes} />
          <source type="image/webp" srcSet={srcSet(image.variants, "webp")} sizes={sizes} />
          <img
            src={fallback}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className="size-full object-cover"
          />
        </picture>
      ) : (
        <span role="img" aria-label={image.alt} className="block aspect-square" />
      )}
    </div>
  );
}
