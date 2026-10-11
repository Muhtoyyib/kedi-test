// "Lasts about 4 weeks" when the count is a whole number of weeks,
// otherwise "Lasts about 30 days" (docs/copy-and-compliance.md §7).
// style="fragment" drops the prefix for table cells: "4 weeks at the
// recommended use" after a "Lasts about" row label.
export function formatPackDuration(days: number, style: "sentence" | "fragment" = "sentence"): string {
  const weeks = days / 7;
  const unit = days % 7 === 0 ? `${weeks} ${weeks === 1 ? "week" : "weeks"}` : `${days} ${days === 1 ? "day" : "days"}`;
  return style === "fragment" ? `${unit} at the recommended use` : `Lasts about ${unit}`;
}
