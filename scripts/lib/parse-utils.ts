// Shared plumbing for the catalog parsers: error collector, safe field
// readers and the cross-section helpers.

import {isRecord, readNumber, readString, type UntrustedRecord, type UntrustedValue} from "../../src/lib/untrusted.ts";
import type {VideoLink} from "../../src/lib/catalog/types.ts";

/** Where a problem is: which tab, which Sheet row, which row id. */
export interface At {
  tab: string;
  row: number;
  id: string;
}

export class Collector {
  readonly errors: string[] = [];

  error(loc: At, message: string): void {
    this.errors.push(`${loc.tab} row ${loc.row}${loc.id ? ` (${loc.id})` : ""}: ${message}`);
  }
}

/** Sheet row numbers are 1-based with a header row, so data index 0 → row 2. */
export const at = (tab: string, i: number, id: string): At => ({tab, row: i + 2, id});

export type Issue = (message: string) => void;

export function str(rec: UntrustedRecord, key: string): string {
  const v = readString(rec, key);
  return v === null ? "" : v.trim();
}

export function optNum(rec: UntrustedRecord, key: string): number | null {
  return readNumber(rec, key);
}

export function bool(rec: UntrustedRecord, key: string): boolean {
  return rec[key] === true || rec[key] === "Yes";
}

/** Accepts a string[] or a separator-joined string (hand-edited fixture). */
export function list(rec: UntrustedRecord, key: string, separator: string | RegExp = ","): string[] {
  const v = rec[key];
  if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(separator)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export function paragraphs(rec: UntrustedRecord, key: string): string[] {
  const v = rec[key];
  if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export function isIsoDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  return v === new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10);
}

export function isHttps(v: string): boolean {
  return /^https:\/\/[^\s]+$/.test(v);
}

export function eachRow(rows: UntrustedValue, fn: (rec: UntrustedRecord, i: number) => void): void {
  if (!Array.isArray(rows)) return;
  rows.forEach((r, i) => {
    if (isRecord(r)) fn(r, i);
  });
}

export function parseVideoRef(raw: UntrustedValue): VideoLink | null {
  if (!isRecord(raw)) return null;
  const provider = str(raw, "provider");
  if ((provider !== "youtube" && provider !== "tiktok") || !str(raw, "id") || !str(raw, "url")) return null;
  return {provider, id: str(raw, "id"), url: str(raw, "url")};
}
