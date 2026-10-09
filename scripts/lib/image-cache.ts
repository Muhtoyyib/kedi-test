// .cache/images.json — maps a cache key to the last GeneratedImage produced
// for it plus the freshness stamp (Drive modifiedTime, or the poster URL).
// If the stamp matches and all variant files still exist on disk, the image
// is reused without downloading or re-encoding.

import {existsSync} from "node:fs";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import type {GeneratedImage} from "../../src/lib/catalog/types.ts";
import {isRecord, type UntrustedValue} from "../../src/lib/untrusted.ts";

export interface CacheEntry {
  stamp: string;
  image: GeneratedImage;
  files: string[];
}

export class ImageCache {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly filePath: string;

  private constructor(filePath: string) {
    this.filePath = filePath;
  }

  static async load(filePath = ".cache/images.json"): Promise<ImageCache> {
    const cache = new ImageCache(filePath);
    try {
      const raw: UntrustedValue = JSON.parse(await readFile(filePath, "utf8"));
      if (isRecord(raw)) loadEntries(raw, cache.entries);
    } catch {
      // missing/corrupt cache — start empty
    }
    return cache;
  }

  /** Cached result if the stamp matches and every variant file is still there. */
  get(key: string, stamp: string): GeneratedImage | null {
    const entry = this.entries.get(key);
    if (!entry || entry.stamp !== stamp) return null;
    if (!entry.files.every((f) => existsSync(f))) return null;
    return entry.image;
  }

  /** Newest cached result for a key regardless of stamp — the fallback when a fetch fails. */
  latest(key: string): GeneratedImage | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (!entry.files.every((f) => existsSync(f))) return null;
    return entry.image;
  }

  set(key: string, entry: CacheEntry): void {
    this.entries.set(key, entry);
  }

  async save(): Promise<void> {
    await mkdir(path.dirname(this.filePath), {recursive: true});
    await writeFile(this.filePath, `${JSON.stringify(Object.fromEntries(this.entries), null, 2)}\n`, "utf8");
  }
}

function loadEntries(raw: Record<string, UntrustedValue>, entries: Map<string, CacheEntry>): void {
  for (const [key, value] of Object.entries(raw)) {
    if (isEntry(value)) entries.set(key, value);
  }
}

function isEntry(v: UntrustedValue): v is CacheEntry {
  if (!isRecord(v)) return false;
  return (
    typeof v.stamp === "string" &&
    isRecord(v.image) &&
    Array.isArray(v.files) &&
    v.files.every((f: UntrustedValue) => typeof f === "string")
  );
}
