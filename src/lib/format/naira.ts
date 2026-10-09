const formatter = new Intl.NumberFormat("en-NG", {maximumFractionDigits: 0});

// Explicit ₦ prefix: some Android ICU builds render the currency as "NGN".
export function formatNaira(amountNgn: number | null): string {
  if (amountNgn === null) return "Ask for price";
  return `₦${formatter.format(amountNgn)}`;
}
