// Video poster URLs: YouTube tries maxresdefault then hqdefault; TikTok uses
// the oembed thumbnail_url. On TikTok failure the caller falls back to the
// branded placeholder PNG (scripts/fixtures/video-placeholder.png) — the
// build continues with a warning. No third-party poster is ever hotlinked;
// every poster is downloaded and run through the image pipeline.

import {readFile} from "node:fs/promises";
import path from "node:path";
import type {VideoLink} from "../../src/lib/catalog/types.ts";
import {isRecord, readString, type UntrustedValue} from "../../src/lib/untrusted.ts";

export const PLACEHOLDER_PATH = path.resolve(import.meta.dirname, "../fixtures/video-placeholder.png");

export interface PosterSource {
  /** Where the bytes came from: the remote URL, or "placeholder". */
  url: string;
  data: Buffer;
  /** Cache stamp — the URL for remote posters, fixed token for the placeholder. */
  stamp: string;
}

type FetchFn = typeof fetch;

async function fetchOk(url: string, fetchFn: FetchFn): Promise<Response | null> {
  try {
    const res = await fetchFn(url);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/** Poster URL candidates for a video, best first. Empty array → placeholder. */
export async function posterUrl(video: VideoLink, fetchFn: FetchFn = fetch): Promise<string | null> {
  if (video.provider === "youtube") {
    const max = `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;
    if (await fetchOk(max, fetchFn)) return max;
    const hq = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    if (await fetchOk(hq, fetchFn)) return hq;
    return null;
  }
  const res = await fetchOk(`https://www.tiktok.com/oembed?url=${encodeURIComponent(video.url)}`, fetchFn);
  if (!res) return null;
  try {
    const body: UntrustedValue = await res.json();
    const thumb = isRecord(body) ? readString(body, "thumbnail_url") : null;
    return thumb && thumb.startsWith("https://") ? thumb : null;
  } catch {
    return null;
  }
}

async function fetchBytes(url: string, fetchFn: FetchFn): Promise<Buffer | null> {
  const res = await fetchOk(url, fetchFn);
  if (!res) return null;
  try {
    const data = Buffer.from(await res.arrayBuffer());
    return data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/**
 * Resolve a poster's bytes. Falls back to the placeholder PNG and pushes a
 * warning into `warnings` when the remote poster can't be fetched.
 */
export async function fetchPoster(video: VideoLink, warnings: string[], fetchFn: FetchFn = fetch): Promise<PosterSource> {
  const url = await posterUrl(video, fetchFn);
  const data = url ? await fetchBytes(url, fetchFn) : null;
  if (url && data) return {url, data, stamp: url};
  warnings.push(`video poster unavailable for ${video.provider} "${video.id}" — using branded placeholder`);
  return {url: "placeholder", data: await readFile(PLACEHOLDER_PATH), stamp: `placeholder:${video.provider}`};
}
