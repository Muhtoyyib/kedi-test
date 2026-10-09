// "Lasts about 4 weeks" when the count is a whole number of weeks,
// otherwise "Lasts about 30 days" (docs/copy-and-compliance.md §7).
export function formatPackDuration(days: number): string {
  if (days % 7 === 0) {
    const weeks = days / 7;
    return `Lasts about ${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }
  return `Lasts about ${days} ${days === 1 ? "day" : "days"}`;
}
