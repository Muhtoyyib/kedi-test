import {describe, expect, it} from "vitest";
import {highlightsFrom, parseVideoUrl, storiesFrom, videosFrom} from "../src/content.ts";
import {Issues} from "../src/validate.ts";
import type {TabKey} from "../src/schema.ts";
import type {Cell} from "../src/table.ts";
import {MemoryStore} from "./fakes.ts";

const issues = () => new Issues();
const store = (seed: Partial<Record<TabKey, Record<string, Cell>[]>>) => new MemoryStore(seed);

describe("parseVideoUrl", () => {
  it.each([
    ["https://www.youtube.com/watch?v=abc123XYZ", "youtube", "abc123XYZ"],
    ["https://youtu.be/abc123XYZ", "youtube", "abc123XYZ"],
    ["https://www.youtube.com/shorts/abc123XYZ", "youtube", "abc123XYZ"],
    ["https://www.youtube.com/live/abc123XYZ", "youtube", "abc123XYZ"],
    ["https://www.tiktok.com/@user/video/1234567890", "tiktok", "1234567890"],
  ])("parses %s", (url, provider, id) => {
    expect(parseVideoUrl(url)).toEqual({provider, id, url});
  });

  it.each(["https://vimeo.com/123", "https://facebook.com/watch?v=1", "not a url", ""])("rejects %s", (url) => {
    expect(parseVideoUrl(url)).toBeNull();
  });
});

const storyRow = (over: Record<string, Cell> = {}): Record<string, Cell> => ({
  story_id: "ST-001",
  active: "Yes",
  name: "Ngozi A.",
  area: "Ikeja",
  quote: "Friendly service every time.",
  full_story: "",
  photo_id: "",
  video_url: "",
  consent_date: "2026-09-01",
  consent_channel: "WhatsApp",
  consent_photo: "Yes",
  consent_video: "Yes",
  featured: "",
  date: "2026-10-01",
  ...over,
});

describe("storiesFrom", () => {
  it("publishes a fully-consented story", () => {
    const i = issues();
    const out = storiesFrom(store({stories: [storyRow()]}), i);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe("written");
    expect(i.errors).toEqual([]);
  });

  it("leaves out a story with no consent date and warns", () => {
    const i = issues();
    const out = storiesFrom(store({stories: [storyRow({consent_date: ""})]}), i);
    expect(out).toHaveLength(0);
    expect(i.warnings.some((w) => w.message.includes("no consent date"))).toBe(true);
  });

  it("drops the photo when consent_photo is not Yes", () => {
    const i = issues();
    const out = storiesFrom(store({stories: [storyRow({photo_id: "img1", consent_photo: "No"})]}), i);
    expect(out[0].photoId).toBeNull();
    expect(i.warnings.some((w) => w.message.includes("photo dropped"))).toBe(true);
  });

  it("drops the video when consent_video is not Yes", () => {
    const i = issues();
    const out = storiesFrom(store({stories: [storyRow({video_url: "https://youtu.be/abc123XYZ", consent_video: "No"})]}), i);
    expect(out[0].video).toBeNull();
    expect(out[0].kind).toBe("written");
  });

  it("errors on a full name instead of first name + initial", () => {
    const i = issues();
    storiesFrom(store({stories: [storyRow({name: "Ngozi Adeyemi"})]}), i);
    expect(i.errors.some((e) => e.message.includes("first name and initial"))).toBe(true);
  });

  it("keeps only the newest 3 featured stories and warns", () => {
    const rows = [1, 2, 3, 4].map((n) => storyRow({story_id: `ST-00${n}`, featured: "Yes", date: `2026-10-0${n}`}));
    const i = issues();
    const out = storiesFrom(store({stories: rows}), i);
    expect(out.filter((s) => s.featured).map((s) => s.id)).toEqual(["ST-004", "ST-003", "ST-002"]);
    expect(i.warnings.some((w) => w.message.includes("newest 3"))).toBe(true);
  });

  it("errors on banned health words in the quote", () => {
    const i = issues();
    storiesFrom(store({stories: [storyRow({quote: "It cured my ulcer completely."})]}), i);
    expect(i.errors.some((e) => e.message.includes("cured"))).toBe(true);
  });
});

describe("videosFrom", () => {
  const row = (over: Record<string, Cell> = {}): Record<string, Cell> => ({
    video_id: "VID-001",
    active: "Yes",
    url: "https://www.youtube.com/shorts/abc123XYZ",
    title: "3 easy breakfast swaps",
    topic: "digestion",
    duration_text: "1 min",
    date: "2026-10-01",
    ...over,
  });

  it("publishes an active video with provider + id", () => {
    const out = videosFrom(store({videos: [row()]}), issues());
    expect(out[0].video).toMatchObject({provider: "youtube", id: "abc123XYZ"});
  });

  it("errors on an unsupported link", () => {
    const i = issues();
    videosFrom(store({videos: [row({url: "https://vimeo.com/1"})]}), i);
    expect(i.errors.some((e) => e.message.includes("YouTube or TikTok"))).toBe(true);
  });
});

describe("highlightsFrom", () => {
  const row = (over: Record<string, Cell> = {}): Record<string, Cell> => ({
    highlight_id: "HL-001",
    active: "Yes",
    date: "2026-10-05",
    topic: "Better digestion",
    seminar_id: "",
    photo_ids: "p1, p2",
    photo_alts: "Group photo|Room view",
    video_url: "",
    comment_text: "",
    comment_name: "",
    comment_consent_date: "",
    ...over,
  });

  it("requires at least one photo", () => {
    const i = issues();
    highlightsFrom(store({highlights: [row({photo_ids: ""})]}), i);
    expect(i.errors.some((e) => e.message.includes("at least one photo"))).toBe(true);
  });

  it("drops a comment without a consent date and warns", () => {
    const i = issues();
    const out = highlightsFrom(store({highlights: [row({comment_text: "Lovely seminar", comment_name: "Bola T."})]}), i);
    expect(out[0].comment).toBeNull();
    expect(i.warnings.some((w) => w.message.includes("comment dropped"))).toBe(true);
  });

  it("keeps a consented comment", () => {
    const i = issues();
    const out = highlightsFrom(
      store({highlights: [row({comment_text: "Lovely seminar", comment_name: "Bola T.", comment_consent_date: "2026-10-05"})]}),
      i
    );
    expect(out[0].comment).toEqual({text: "Lovely seminar", name: "Bola T."});
  });
});
