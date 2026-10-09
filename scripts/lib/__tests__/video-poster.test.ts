import {describe, expect, it} from "vitest";
import type {VideoLink} from "../../../src/lib/catalog/types.ts";
import {fetchPoster, posterUrl} from "../video-poster.ts";

const yt = (id = "abc123"): VideoLink => ({provider: "youtube", id, url: `https://www.youtube.com/watch?v=${id}`});
const tt = (id = "xyz"): VideoLink => ({provider: "tiktok", id, url: `https://www.tiktok.com/@u/video/${id}`});

const fakeFetch = (routes: Record<string, {status: number; body?: string}>): typeof fetch =>
  (async (input: RequestInfo | URL) => {
    const hit = routes[String(input)];
    if (!hit) return new Response("nope", {status: 404});
    return new Response(hit.body ?? "img", {status: hit.status});
  }) as typeof fetch;

describe("posterUrl", () => {
  it("prefers YouTube maxresdefault", async () => {
    const url = await posterUrl(yt(), fakeFetch({"https://i.ytimg.com/vi/abc123/maxresdefault.jpg": {status: 200}}));
    expect(url).toBe("https://i.ytimg.com/vi/abc123/maxresdefault.jpg");
  });

  it("falls back to hqdefault when maxres is missing", async () => {
    const url = await posterUrl(yt(), fakeFetch({"https://i.ytimg.com/vi/abc123/hqdefault.jpg": {status: 200}}));
    expect(url).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });

  it("returns null when no YouTube thumbnail exists", async () => {
    expect(await posterUrl(yt(), fakeFetch({}))).toBeNull();
  });

  it("uses the TikTok oembed thumbnail_url", async () => {
    const url = await posterUrl(
      tt(),
      fakeFetch({
        "https://www.tiktok.com/oembed?url=https%3A%2F%2Fwww.tiktok.com%2F%40u%2Fvideo%2Fxyz": {
          status: 200,
          body: JSON.stringify({thumbnail_url: "https://p16.tiktokcdn.com/thumb.jpg"}),
        },
      })
    );
    expect(url).toBe("https://p16.tiktokcdn.com/thumb.jpg");
  });

  it("returns null when TikTok oembed fails", async () => {
    expect(await posterUrl(tt(), fakeFetch({}))).toBeNull();
  });
});

describe("fetchPoster", () => {
  it("returns remote bytes on success", async () => {
    const warnings: string[] = [];
    const src = await fetchPoster(yt(), warnings, fakeFetch({"https://i.ytimg.com/vi/abc123/maxresdefault.jpg": {status: 200}}));
    expect(src.url).toContain("ytimg.com");
    expect(src.data.length).toBeGreaterThan(0);
    expect(warnings).toHaveLength(0);
  });

  it("falls back to the branded placeholder with a warning", async () => {
    const warnings: string[] = [];
    const src = await fetchPoster(yt("missing"), warnings, fakeFetch({}));
    expect(src.url).toBe("placeholder");
    expect(src.data.length).toBeGreaterThan(0); // the placeholder PNG exists
    expect(warnings[0]).toContain("video poster unavailable");
  });
});
