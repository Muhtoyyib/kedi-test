import {useCallback, useEffect, useState} from "react";
import {cn} from "cn";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import type {GeneratedImage} from "@/lib/catalog/types";
import {ResponsiveImage} from "@/components/ui/responsive-image";

function NavArrow({side, label, onTap}: {side: "left" | "right"; label: string; onTap: () => void}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onTap}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full bg-canvas/10 p-3 text-canvas transition-colors hover:bg-canvas/20",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </button>
  );
}

function useViewerKeys(onClose: () => void, prev: () => void, next: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);
}

// Full-screen tap-to-zoom viewer — lazy-loaded on first tap. Closes via the
// close button, Escape or a downward swipe (per spec).
export function ImageViewer({
  images,
  index,
  alt,
  onClose,
}: {
  images: GeneratedImage[];
  index: number;
  alt: (i: number) => string;
  onClose: () => void;
}) {
  const [i, setI] = useState(index);
  const [touchY, setTouchY] = useState<number | null>(null);
  const prev = useCallback(() => setI((v) => (v - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setI((v) => (v + 1) % images.length), [images.length]);
  useViewerKeys(onClose, prev, next);

  const multi = images.length > 1;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product photo viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
      onTouchStart={(e) => setTouchY(e.touches[0].clientY)}
      onTouchEnd={(e) => {
        if (touchY !== null && e.changedTouches[0].clientY - touchY > 60) onClose();
        setTouchY(null);
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-canvas/10 p-3 text-canvas hover:bg-canvas/20"
      >
        <X className="size-6" aria-hidden="true" />
      </button>
      {multi ? <NavArrow side="left" label="Previous photo" onTap={prev} /> : null}
      <ResponsiveImage
        image={images[i]}
        sizes="100vw"
        priority
        className="max-h-full w-full max-w-4xl rounded-card [&_img]:object-contain"
      />
      {multi ? <NavArrow side="right" label="Next photo" onTap={next} /> : null}
      <span className="sr-only">{alt(i)}</span>
    </div>
  );
}
