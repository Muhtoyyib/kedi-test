import {cn} from "cn";

// Exact wording from docs/copy-and-compliance.md — do not paraphrase.
// Exported for the "About earnings" Notice on the business page, which wraps
// the same text in a titled callout (change 16 §07).
export const disclaimerText = {
  health:
    "These products are food supplements and wellness products. They are not intended to diagnose, treat, cure or prevent any disease. Always follow the usage instructions on the pack. If you are pregnant, breastfeeding, taking medication or have a medical condition, speak to a doctor before use.",
  earnings:
    "Becoming a distributor is a business, not a job or a guaranteed income. What you earn depends entirely on your own effort, sales and KEDI's official compensation plan. We do not promise any level of income.",
} as const;

export type DisclaimerKind = keyof typeof disclaimerText;

export function Disclaimer({kind, className}: {kind: DisclaimerKind; className?: string}) {
  return <p className={cn("text-sm text-text-muted", className)}>{disclaimerText[kind]}</p>;
}
