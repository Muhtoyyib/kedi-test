import {useRef} from "react";
import {cn} from "cn";

interface ChipOption {
  value: string;
  label: string;
}

interface ChipGroupProps {
  "aria-label": string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Single-select chips with roving tabindex and arrow-key navigation.
export function ChipGroup({options, value, onChange, "aria-label": ariaLabel, className}: ChipGroupProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  function focusSibling(index: number, direction: 1 | -1) {
    const chips = refs.current.filter((chip): chip is HTMLButtonElement => chip !== null);
    const next = (index + direction + chips.length) % chips.length;
    chips[next]?.focus();
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn("flex gap-2 overflow-x-auto", className)}>
      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="button"
          aria-pressed={option.value === value}
          tabIndex={index === selectedIndex ? 0 : -1}
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              focusSibling(index, event.key === "ArrowRight" ? 1 : -1);
            }
          }}
          className={cn(
            "h-10 shrink-0 rounded-full border-2 px-4 text-sm font-semibold whitespace-nowrap transition-colors",
            option.value === value ? "border-brand bg-brand text-canvas" : "border-line-strong bg-canvas text-text-body hover:border-brand"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
