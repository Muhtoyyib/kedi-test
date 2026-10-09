// Regenerates the fixture images in scripts/fixtures/images/ — flat labeled
// packshot PNGs that flow through the same sharp pipeline as live Drive
// images. Run: `node scripts/gen-fixture-images.ts`.

import {mkdirSync} from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve(import.meta.dirname, "fixtures/images");
const placeholderDir = path.resolve(import.meta.dirname, "fixtures");

interface Img {
  name: string;
  w: number;
  h: number;
  bg: string;
  fg: string;
  label: string;
}

const SQUARE = [900, 900] as const;
const WIDE = [1400, 788] as const;
const TALL = [900, 1200] as const;

const images: Img[] = [
  // Product packshots (product 1 has three).
  {name: "fix-p1-a", w: SQUARE[0], h: SQUARE[1], bg: "#317ABE", fg: "#FFFFFF", label: "P1"},
  {name: "fix-p1-b", w: SQUARE[0], h: SQUARE[1], bg: "#245F96", fg: "#FFFFFF", label: "P1·2"},
  {name: "fix-p1-c", w: SQUARE[0], h: SQUARE[1], bg: "#1B4A75", fg: "#FFFFFF", label: "P1·3"},
  {name: "fix-p2", w: SQUARE[0], h: SQUARE[1], bg: "#E8A020", fg: "#1B4A75", label: "P2"},
  {name: "fix-p3", w: SQUARE[0], h: SQUARE[1], bg: "#4C8C4A", fg: "#FFFFFF", label: "P3"},
  {name: "fix-p4", w: SQUARE[0], h: SQUARE[1], bg: "#7A5195", fg: "#FFFFFF", label: "P4"},
  {name: "fix-p5", w: SQUARE[0], h: SQUARE[1], bg: "#317ABE", fg: "#FFE9A8", label: "P5"},
  {name: "fix-p6", w: SQUARE[0], h: SQUARE[1], bg: "#B0522F", fg: "#FFFFFF", label: "P6"},
  {name: "fix-p7", w: SQUARE[0], h: SQUARE[1], bg: "#2E7D6B", fg: "#FFFFFF", label: "P7"},
  {name: "fix-p8", w: SQUARE[0], h: SQUARE[1], bg: "#8C6D2F", fg: "#FFFFFF", label: "P8"},
  {name: "fix-p9", w: SQUARE[0], h: SQUARE[1], bg: "#555F6E", fg: "#FFFFFF", label: "P9"},
  // Category tiles.
  {name: "fix-cat-digestion", w: WIDE[0], h: WIDE[1], bg: "#4C8C4A", fg: "#FFFFFF", label: "Digestion"},
  {name: "fix-cat-energy", w: WIDE[0], h: WIDE[1], bg: "#E8A020", fg: "#1B4A75", label: "Energy"},
  {name: "fix-cat-immunity", w: WIDE[0], h: WIDE[1], bg: "#317ABE", fg: "#FFFFFF", label: "Immunity"},
  {name: "fix-cat-heart", w: WIDE[0], h: WIDE[1], bg: "#B0522F", fg: "#FFFFFF", label: "Heart"},
  // Highlight photos.
  {name: "fix-hl-1a", w: 1000, h: 750, bg: "#245F96", fg: "#FFFFFF", label: "Seminar"},
  {name: "fix-hl-1b", w: 1000, h: 750, bg: "#2E7D6B", fg: "#FFFFFF", label: "Q&A"},
  {name: "fix-hl-2a", w: 1000, h: 750, bg: "#7A5195", fg: "#FFFFFF", label: "Demo"},
  // Story photo (portrait).
  {name: "fix-story-1", w: TALL[0], h: TALL[1], bg: "#C46A8A", fg: "#FFFFFF", label: "Adaeze"},
  // Article covers + one inline doc image.
  {name: "fix-cover-gut", w: WIDE[0], h: WIDE[1], bg: "#4C8C4A", fg: "#FFFFFF", label: "Gut guide"},
  {name: "fix-cover-energy", w: WIDE[0], h: WIDE[1], bg: "#E8A020", fg: "#1B4A75", label: "Energy guide"},
  {name: "fix-cover-daily", w: WIDE[0], h: WIDE[1], bg: "#317ABE", fg: "#FFFFFF", label: "Daily habits"},
  {name: "fix-doc-gut-0", w: 1200, h: 675, bg: "#F4EAD8", fg: "#4C8C4A", label: "Plate diagram"},
  // Video posters (fixture fetch serves this for every remote URL) + the TikTok fallback.
  {name: "poster", w: WIDE[0], h: WIDE[1], bg: "#101820", fg: "#FFFFFF", label: "▶ video"},
  {name: "video-placeholder", w: WIDE[0], h: WIDE[1], bg: "#245F96", fg: "#FFFFFF", label: "▶ KEDI"},
];

function svgFor(img: Img): Buffer {
  const pad = Math.round(Math.min(img.w, img.h) * 0.08);
  const fontSize = Math.round(Math.min(img.w, img.h) * 0.12);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${img.w}" height="${img.h}">
      <rect width="${img.w}" height="${img.h}" fill="${img.bg}"/>
      <rect x="${pad}" y="${pad}" width="${img.w - pad * 2}" height="${img.h - pad * 2}"
        fill="none" stroke="${img.fg}" stroke-width="${Math.round(pad / 6)}"/>
      <text x="50%" y="54%" text-anchor="middle" font-family="sans-serif"
        font-size="${fontSize}" font-weight="700" fill="${img.fg}">${img.label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
      <text x="50%" y="70%" text-anchor="middle" font-family="sans-serif"
        font-size="${Math.round(fontSize / 3)}" fill="${img.fg}" opacity="0.75">fixture image</text>
    </svg>`
  );
}

mkdirSync(dir, {recursive: true});
for (const img of images) {
  // The branded video-placeholder sits at fixtures/ root (video-poster.ts reads it).
  const base = img.name === "video-placeholder" ? placeholderDir : dir;
  const out = path.join(base, `${img.name}.png`);
  await sharp(svgFor(img)).png().toFile(out);
  console.log(`fixture image: ${path.relative(process.cwd(), out)}`);
}
