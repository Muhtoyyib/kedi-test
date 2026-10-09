// Validation plumbing shared by the catalog endpoint and the Sheet's
// "Check content for errors" menu. Errors block publishing; warnings don't.

import {str} from "./table.ts";

export type Severity = "error" | "warning";

export interface Issue {
  severity: Severity;
  tab: string;
  row: number;
  id: string;
  message: string;
}

export class Issues {
  readonly list: Issue[] = [];

  add(severity: Severity, tab: string, row: number, id: string, message: string): void {
    this.list.push({severity, tab, row, id, message});
  }

  error(tab: string, row: number, id: string, message: string): void {
    this.add("error", tab, row, id, message);
  }

  warn(tab: string, row: number, id: string, message: string): void {
    this.add("warning", tab, row, id, message);
  }

  get errors(): Issue[] {
    return this.list.filter((i) => i.severity === "error");
  }

  get warnings(): Issue[] {
    return this.list.filter((i) => i.severity === "warning");
  }

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }
}

// Banned health-claim words (docs/copy-and-compliance.md §2): claim verbs plus
// disease/condition names. Whole-word, case-insensitive.
const CLAIM_WORDS = [
  "cure",
  "cures",
  "cured",
  "curing",
  "treat",
  "treats",
  "treated",
  "treating",
  "treatment",
  "heal",
  "heals",
  "healed",
  "healing",
  "prevent",
  "prevents",
  "prevented",
  "preventing",
  "prevention",
  "reverse",
  "reverses",
  "reversed",
  "reversing",
  "eliminate",
  "eliminates",
  "fight",
  "fights",
  "miracle",
  "remedy",
];
const DISEASE_WORDS = [
  "diabetes",
  "hypertension",
  "ulcer",
  "ulcers",
  "infertility",
  "cancer",
  "infection",
  "arthritis",
  "hiv",
  "aids",
  "stroke",
  "asthma",
  "fibroid",
  "fibroids",
  "malaria",
  "typhoid",
];
const BANNED = new RegExp(`\\b(${[...CLAIM_WORDS, ...DISEASE_WORDS].join("|")})\\b`, "gi");

/** Returns the banned words found in `text` (unique, lowercase). */
export function bannedWordsIn(text: string): string[] {
  return [...new Set((text.match(BANNED) ?? []).map((w) => w.toLowerCase()))];
}

export function slugify(text: string): string {
  return str(text)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && value === d.toISOString().slice(0, 10);
}

export function isTime24(value: string): boolean {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return false;
  return true;
}

export function isHttpsUrl(value: string): boolean {
  return /^https:\/\/[^\s]+$/.test(value);
}
