import {mkdtempSync, rmSync, unlinkSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {afterAll, describe, expect, it} from "vitest";
import {ImageCache, type CacheEntry} from "../image-cache.ts";

const tmp = mkdtempSync(path.join(tmpdir(), "cache-"));
afterAll(() => rmSync(tmp, {recursive: true, force: true}));

const file = (name: string) => {
  const p = path.join(tmp, name);
  writeFileSync(p, "x");
  return p;
};

const entry = (stamp: string, files: string[]): CacheEntry => ({
  stamp,
  files,
  image: {key: "k", alt: "a", width: 100, height: 100, variants: []},
});

describe("ImageCache", () => {
  it("hits when the stamp matches and files exist", async () => {
    const cache = await ImageCache.load(path.join(tmp, "a.json"));
    const f = file("hit.webp");
    cache.set("p/1", entry("mtime-1", [f]));
    expect(cache.get("p/1", "mtime-1")?.width).toBe(100);
  });

  it("misses when the stamp changed", async () => {
    const cache = await ImageCache.load(path.join(tmp, "b.json"));
    cache.set("p/1", entry("mtime-1", [file("changed.webp")]));
    expect(cache.get("p/1", "mtime-2")).toBeNull();
  });

  it("misses when variant files were deleted", async () => {
    const cache = await ImageCache.load(path.join(tmp, "c.json"));
    const f = file("gone.webp");
    cache.set("p/1", entry("mtime-1", [f]));
    unlinkSync(f);
    expect(cache.get("p/1", "mtime-1")).toBeNull();
  });

  it("latest() returns the previous copy regardless of stamp — the failure fallback", async () => {
    const cache = await ImageCache.load(path.join(tmp, "d.json"));
    cache.set("p/1", entry("mtime-1", [file("prev.webp")]));
    expect(cache.latest("p/1")?.width).toBe(100);
    expect(cache.latest("missing")).toBeNull();
  });

  it("persists to disk and reloads", async () => {
    const filePath = path.join(tmp, "roundtrip.json");
    const cache = await ImageCache.load(filePath);
    cache.set("p/1", entry("mtime-9", [file("rt.webp")]));
    await cache.save();
    const reloaded = await ImageCache.load(filePath);
    expect(reloaded.get("p/1", "mtime-9")?.width).toBe(100);
  });

  it("starts empty when the file is missing or corrupt", async () => {
    const p = path.join(tmp, "corrupt.json");
    writeFileSync(p, "{not json");
    const cache = await ImageCache.load(p);
    expect(cache.get("anything", "x")).toBeNull();
  });
});
