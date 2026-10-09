/* oxlint-disable typescript/no-restricted-types */
// Boundary helpers for values that are not typed at compile time: generated
// catalog JSON, localStorage, URL params and Apps Script responses.

export type UntrustedValue = unknown;

export type UntrustedRecord = Record<string, UntrustedValue>;

export function isRecord(value: UntrustedValue): value is UntrustedRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readString(record: UntrustedRecord, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function readNumber(record: UntrustedRecord, key: string): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
