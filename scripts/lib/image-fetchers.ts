// Concrete ImageFetcher implementations (fixture files vs the live Apps
// Script image endpoints) and the mediaResolver that ties fetch → cache →
// sharp pipeline together.

import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import path from "node:path";
import type {VideoLink} from "../../src/lib/catalog/types.ts";
import {isRecord, readString, type UntrustedValue} from "../../src/lib/untrusted.ts";
import type {ImageCache} from "./image-cache.ts";
import {processImage} from "./image-pipeline.ts";
import type {ImageResolver} from "./resolve-content.ts";
import {fetchPoster} from "./video-poster.ts";

export interface ImageBytes {
  data: Buffer;
  /** Freshness stamp used for cache lookup — Drive modifiedTime, content hash, or video URL. */
  stamp: string;
  /** True for the placeholder poster — usable this build, but never written to the cache. */
  temporary?: boolean;
}

export interface ImageFetcher {
  drive(id: string): Promise<ImageBytes>;
  docImage(ref: {doc: string; n: number}): Promise<ImageBytes>;
  poster(video: VideoLink): Promise<ImageBytes>;
}

const sha1 = (data: Buffer) => createHash("sha1").update(data).digest("hex").slice(0, 12);

// ── Fixture fetcher: local PNGs, deterministic and offline ────────────────────

/**
 * A fetch stand-in for fixture mode: serves oembed JSON for TikTok and the
 * fixture poster PNG for every image URL (including fixture:// URLs), so the
 * whole poster code path is exercised without the network.
 */
function fixtureFetch(posterPath: string): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = input instanceof URL ? input.href : typeof input === "string" ? input : input.url;
    if (url.includes("tiktok.com/oembed")) {
      return new Response(JSON.stringify({thumbnail_url: "https://fixture.local/poster.png"}), {status: 200});
    }
    return new Response(new Uint8Array(await readFile(posterPath)), {status: 200});
  }) as typeof fetch;
}

export function fixtureFetcher(fixturesDir: string, warnings: string[]): ImageFetcher {
  const file = async (name: string): Promise<ImageBytes> => {
    const data = await readFile(path.join(fixturesDir, `${name}.png`));
    return {data, stamp: sha1(data)};
  };
  return {
    drive: (id) => file(id),
    docImage: (ref) => file(`${ref.doc}-${ref.n}`),
    poster: (video) =>
      fetchPoster(video, warnings, fixtureFetch(path.join(fixturesDir, "poster.png"))).then((p) => ({
        data: p.data,
        stamp: video.url,
        temporary: p.url === "placeholder",
      })),
  };
}

// ── Live fetcher: Apps Script ?action=image / doc_image + real poster URLs ────

async function apiImage(endpoint: string, qs: string): Promise<ImageBytes> {
  const res = await fetch(`${endpoint}${endpoint.includes("?") ? "&" : "?"}${qs}`);
  if (!res.ok) throw new Error(`image request failed (${res.status})`);
  const body: UntrustedValue = await res.json();
  if (!isRecord(body) || body.ok !== true || typeof body.base64 !== "string") {
    const msg = isRecord(body) ? readString(body, "message") : null;
    throw new Error(msg ?? "image endpoint returned an unexpected response");
  }
  const data = Buffer.from(body.base64, "base64");
  const modified = readString(body, "modifiedTime") ?? "";
  return {data, stamp: modified || sha1(data)};
}

export function liveFetcher(endpoint: string, token: string, warnings: string[]): ImageFetcher {
  const tok = `token=${encodeURIComponent(token)}`;
  return {
    drive: (id) => apiImage(endpoint, `${tok}&action=image&id=${encodeURIComponent(id)}`),
    docImage: async (ref) => {
      const bytes = await apiImage(endpoint, `${tok}&action=doc_image&doc=${encodeURIComponent(ref.doc)}&n=${ref.n}`);
      // doc images carry no modifiedTime — key by doc/n plus a content hash.
      return {...bytes, stamp: `doc:${ref.doc}:${ref.n}:${sha1(bytes.data)}`};
    },
    poster: async (video) => {
      const p = await fetchPoster(video, warnings);
      return {data: p.data, stamp: video.url, temporary: p.url === "placeholder"};
    },
  };
}

// ── Resolver: fetch → cache → encode ─────────────────────────────────────────

interface ResolveJob {
  key: string;
  alt: string;
  /** Stamp known before fetching (video URL for posters) — a hit skips fetching entirely. */
  knownStamp?: string;
  get: () => Promise<ImageBytes>;
}

export function mediaResolver(fetcher: ImageFetcher, cache: ImageCache, warnings: string[]): ImageResolver {
  const resolve = async (job: ResolveJob) => {
    if (job.knownStamp) {
      const hit = cache.get(job.key, job.knownStamp);
      if (hit) return {...hit, alt: job.alt};
    }
    try {
      const {data, stamp, temporary} = await job.get();
      const hit = cache.get(job.key, stamp);
      if (hit) return {...hit, alt: job.alt};
      const out = await processImage(data, {key: job.key, alt: job.alt});
      if (!temporary) cache.set(job.key, {stamp, image: out.image, files: out.files});
      return out.image;
    } catch (err) {
      const prev = cache.latest(job.key);
      if (prev) {
        warnings.push(`image "${job.key}" failed (${err instanceof Error ? err.message : String(err)}) — reusing cached copy`);
        return {...prev, alt: job.alt};
      }
      throw err;
    }
  };
  return {
    drive: (id, key, alt) => resolve({key, alt, get: () => fetcher.drive(id)}),
    docImage: (ref, key, alt) => resolve({key, alt, get: () => fetcher.docImage(ref)}),
    // Posters are cached by the video URL itself — a hit skips remote probing entirely.
    poster: (video, key, alt) => resolve({key, alt, knownStamp: video.url, get: () => fetcher.poster(video)}),
  };
}
