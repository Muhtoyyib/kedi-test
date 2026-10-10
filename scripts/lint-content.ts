// Content compliance lint — runs in ci:build before the build. Scans
// developer-edited repo content for banned health-claim and income wording.
// Client content is checked separately in Apps Script and the catalog parse.

import {existsSync, readdirSync, readFileSync} from "node:fs";
import path from "node:path";
import {lintContent, lintLegalFrontmatter} from "./lib/content-lint.ts";

const root = path.resolve(import.meta.dirname, "..");

function contentFiles(): {path: string; text: string}[] {
  const files = ["content/faq.ts", "content/business.ts"];
  const legalDir = path.join(root, "content/legal");
  if (existsSync(legalDir)) {
    for (const name of readdirSync(legalDir)) {
      if (name.endsWith(".mdx")) files.push(`content/legal/${name}`);
    }
  }
  return files.map((file) => ({path: file, text: readFileSync(path.join(root, file), "utf8")}));
}

const files = contentFiles();
const findings = [...lintContent(files), ...lintLegalFrontmatter(files)];
if (findings.length > 0) {
  console.error("Content lint failed:");
  for (const f of findings) console.error(`  ${f.path}:${f.line} — ${f.word}`);
  process.exit(1);
}
console.log("Content lint passed.");
