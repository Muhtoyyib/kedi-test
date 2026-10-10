// Generates public/og/default.jpg — the 1200×630 share card (brand blue,
// sun arc, brand name, "Independent KEDI Distributor"). Re-run after the
// client supplies the real brand name: `bun scripts/gen-og-image.ts`.

import {mkdir} from "node:fs/promises";
import sharp from "sharp";
import {siteConfig} from "../src/lib/site-config.ts";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f2a47"/>
  <path d="M0 630 A1200 700 0 0 1 1200 630 Z" fill="#f4e028"/>
  <rect x="80" y="252" width="14" height="48" rx="7" fill="#f4e028"/>
  <text x="120" y="290" font-family="sans-serif" font-size="64" font-weight="800" fill="#ffffff">${esc(siteConfig.name)}</text>
  <text x="120" y="352" font-family="sans-serif" font-size="32" font-weight="600" fill="#8fc1ee">Independent KEDI Distributor</text>
  <text x="120" y="420" font-family="sans-serif" font-size="26" fill="#e8f1fa">Genuine KEDI products, local delivery, weekly wellness seminars</text>
</svg>`;

await mkdir("public/og", {recursive: true});
await sharp(Buffer.from(svg)).jpeg({quality: 82}).toFile("public/og/default.jpg");
console.log("wrote public/og/default.jpg");
