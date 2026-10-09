import {describe, expect, it} from "vite-plus/test";
import {formatNaira} from "@/lib/format/naira";
import {formatPackDuration} from "@/lib/format/pack-duration";
import {formatSeminarDate, formatSeminarTime, isUpcoming} from "@/lib/format/seminar-date";

describe("formatNaira", () => {
  it("formats amounts with thousands separators and no decimals", () => {
    expect(formatNaira(0)).toBe("₦0");
    expect(formatNaira(999)).toBe("₦999");
    expect(formatNaira(18500)).toBe("₦18,500");
    expect(formatNaira(1250000)).toBe("₦1,250,000");
  });

  it("renders null as 'Ask for price'", () => {
    expect(formatNaira(null)).toBe("Ask for price");
  });
});

describe("formatPackDuration", () => {
  it.each([
    [1, "Lasts about 1 day"],
    [7, "Lasts about 1 week"],
    [14, "Lasts about 2 weeks"],
    [28, "Lasts about 4 weeks"],
    [30, "Lasts about 30 days"],
    [45, "Lasts about 45 days"],
    [60, "Lasts about 60 days"],
    [90, "Lasts about 90 days"],
  ])("%i days → %s", (days, expected) => {
    expect(formatPackDuration(days)).toBe(expected);
  });
});

describe("formatSeminarDate / formatSeminarTime", () => {
  // 2026-10-10 16:00 WAT
  const iso = "2026-10-10T16:00:00+01:00";

  it("formats the date as 'Saturday, 12 October' in WAT", () => {
    expect(formatSeminarDate(iso)).toBe("Saturday, 10 October");
  });

  it("formats the time as '4:00 PM'", () => {
    expect(formatSeminarTime(iso)).toBe("4:00 PM");
  });

  it("keeps the WAT date at the midnight boundary (UTC would be the previous day)", () => {
    expect(formatSeminarDate("2026-10-12T00:30:00+01:00")).toBe("Monday, 12 October");
    expect(formatSeminarTime("2026-10-12T00:30:00+01:00")).toBe("12:30 AM");
  });
});

describe("isUpcoming", () => {
  it("is true only when the start is after now", () => {
    const now = new Date("2026-10-10T15:00:00+01:00");
    expect(isUpcoming(now, "2026-10-10T16:00:00+01:00")).toBe(true);
    expect(isUpcoming(now, "2026-10-10T15:00:00+01:00")).toBe(false);
    expect(isUpcoming(now, "2026-10-09T16:00:00+01:00")).toBe(false);
  });
});
