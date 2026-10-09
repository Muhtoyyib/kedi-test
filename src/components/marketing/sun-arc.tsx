import {cn} from "cn";

const sizeClasses = {
  sm: "w-16",
  md: "w-28",
  lg: "w-44",
} as const;

// The sun-arc motif: a sun half-disc (docs/design-system.md §4). Decorative.
export function SunArc({size = "md", className}: {size?: keyof typeof sizeClasses; className?: string}) {
  return (
    <svg viewBox="0 0 100 50" aria-hidden="true" className={cn(sizeClasses[size], className)}>
      <path d="M0 50a50 50 0 0 1 100 0z" fill="var(--color-sun)" />
    </svg>
  );
}
