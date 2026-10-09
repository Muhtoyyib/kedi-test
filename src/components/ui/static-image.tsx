import {cn} from "cn";

interface StaticImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

// For content-imported local images (Vite asset URLs), e.g. article covers.
export function StaticImage({src, alt, width, height, priority = false, className}: StaticImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={cn("bg-brand-soft", className)}
    />
  );
}
