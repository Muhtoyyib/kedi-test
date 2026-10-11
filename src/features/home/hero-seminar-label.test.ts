import {describe, expect, it} from "vite-plus/test";
import {getSeminars} from "@/lib/catalog/seminars";
import {TOPIC_LABELS, topicLabel} from "@/lib/content/topics";
import {TOPICS} from "@/lib/catalog/types";
import {heroSeminarLabel} from "./hero-seminar-label";

describe("heroSeminarLabel", () => {
  const next = getSeminars().find((s) => s.id === "SEM-NEXT")!; // starts 2026-10-17T16:00+01:00

  it("says this week when the seminar starts within 7 days", () => {
    expect(heroSeminarLabel(next, new Date("2026-10-16T12:00:00+01:00"))).toBe("Join this week's free seminar");
  });

  it("says next when the seminar is more than a week out", () => {
    expect(heroSeminarLabel(next, new Date("2026-10-10T12:00:00+01:00"))).toBe("Join our next free seminar");
  });

  it("treats exactly 7×24 h away as this week", () => {
    expect(heroSeminarLabel(next, new Date("2026-10-10T16:00:00+01:00"))).toBe("Join this week's free seminar");
    expect(heroSeminarLabel(next, new Date("2026-10-10T15:59:59+01:00"))).toBe("Join our next free seminar");
  });

  it("says upcoming when there is no future seminar", () => {
    expect(heroSeminarLabel(undefined, new Date())).toBe("See upcoming seminars");
  });
});

describe("topicLabel", () => {
  it("covers every catalog topic", () => {
    for (const t of TOPICS) {
      expect(topicLabel(t)).toBe(TOPIC_LABELS[t]);
      expect(topicLabel(t).length).toBeGreaterThan(0);
    }
  });

  it("labels the multiword topics correctly", () => {
    expect(topicLabel("heart-and-circulation")).toBe("Heart & circulation");
    expect(topicLabel("everyday-wellness")).toBe("Everyday wellness");
  });
});
