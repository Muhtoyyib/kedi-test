// Repo-content compliance lint (change 08 design §4): scans developer-edited
// content for banned health-claim words, plus an extra income-language list
// for business.ts. Allowlisted: the exact disclaimer texts, "see a doctor",
// and the health-disclaimer legal page itself (it must name disease to
// disclaim it).

import {bannedWordsIn} from "./compliance.ts";

export interface LintFinding {
  path: string;
  line: number;
  word: string;
}

export const HEALTH_DISCLAIMER =
  "These products are food supplements and wellness products. They are not intended to diagnose, treat, cure or prevent any disease. Always follow the usage instructions on the pack. If you are pregnant, breastfeeding, taking medication or have a medical condition, speak to a doctor before use.";

const SHORT_DISCLAIMER = "Food supplements are not medicines. Not intended to diagnose, treat, cure or prevent any disease.";

export const EARNINGS_DISCLAIMER =
  "Becoming a distributor is a business, not a job or a guaranteed income. What you earn depends entirely on your own effort, sales and KEDI's official compensation plan. We do not promise any level of income.";

// Extra list for content/business.ts only (change 16 design). FAQ business
// answers may mention earnings to deny them, so this list never applies there.
const BUSINESS_BANNED =
  /\b(income|earn|earns|earning|earnings|per month|financial freedom|passive|rich|millionaire|car|travel|be your own boss|guarantee|guaranteed)\b|₦\s*\d/gi;

// Files checked against the extra business list.
const BUSINESS_FILES = new Set(["content/business.ts"]);

// The health-disclaimer legal page names disease in order to disclaim it.
const EXEMPT_FILES = new Set(["content/legal/health-disclaimer.mdx"]);

const ALLOWLIST = [HEALTH_DISCLAIMER, SHORT_DISCLAIMER, "see a doctor"];

function stripAllowlisted(text: string, path: string): string {
  let out = text;
  for (const phrase of ALLOWLIST) out = out.split(phrase).join(" ");
  if (BUSINESS_FILES.has(path)) out = out.split(EARNINGS_DISCLAIMER).join(" ");
  return out;
}

export function lintContent(files: {path: string; text: string}[]): LintFinding[] {
  const findings: LintFinding[] = [];
  for (const file of files) {
    if (EXEMPT_FILES.has(file.path)) continue;
    const cleaned = stripAllowlisted(file.text, file.path);
    const isBusiness = BUSINESS_FILES.has(file.path);
    cleaned.split("\n").forEach((line, i) => {
      for (const word of bannedWordsIn(line)) findings.push({path: file.path, line: i + 1, word});
      if (isBusiness) {
        for (const m of line.matchAll(BUSINESS_BANNED)) findings.push({path: file.path, line: i + 1, word: m[0].trim().toLowerCase()});
      }
    });
  }
  return findings;
}

// Early frontmatter check for legal MDX (mirrors the strict schema in
// source.config.ts, which fumadocs only validates when the collection is
// imported). Fails naming the file and the missing/invalid field.
const LEGAL_REQUIRED: [string, (v: string | undefined) => boolean][] = [
  ["title", (v) => !!v],
  ["description", (v) => !!v && unquote(v).length <= 155],
  ["updated", (v) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(unquote(v))],
];

function unquote(v: string): string {
  return v.replace(/^["']|["']$/g, "");
}

export function lintLegalFrontmatter(files: {path: string; text: string}[]): LintFinding[] {
  const findings: LintFinding[] = [];
  for (const file of files) {
    if (!file.path.startsWith("content/legal/")) continue;
    const fm = file.text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const fields = Object.fromEntries([...fm.matchAll(/^(\w+):\s*(.+)$/gm)].map((m) => [m[1], m[2].trim()]));
    for (const [field, ok] of LEGAL_REQUIRED) {
      if (!ok(fields[field])) findings.push({path: file.path, line: 1, word: `frontmatter: missing or invalid ${field}`});
    }
  }
  return findings;
}
