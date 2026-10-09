// Script properties, token check and the CacheService-backed rate limiter.

/** Script Properties are set once in the client's project settings. */
export function prop(name: string): string {
  return PropertiesService.getScriptProperties().getProperty(name) ?? "";
}

/** Constant-time-ish compare: same work regardless of which character differs. */
export function tokenMatches(provided: string | undefined | null, expected: string): boolean {
  const a = provided ?? "";
  let diff = a.length === expected.length ? 0 : 1;
  for (let i = 0; i < Math.max(a.length, expected.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
  }
  return expected !== "" && diff === 0;
}

/** Counts hits per key inside a sliding window backed by CacheService. */
export interface Bucket {
  incr(key: string, ttlSeconds: number): number;
}

export function cacheBucket(cache: Pick<GoogleAppsScript.Cache.Cache, "get" | "put">): Bucket {
  return {
    incr(key, ttlSeconds) {
      const next = Number(cache.get(key) ?? 0) + 1;
      cache.put(key, String(next), ttlSeconds);
      return next;
    },
  };
}

export function json(data: Record<string, unknown>): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
