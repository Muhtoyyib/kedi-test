// Turns one source image into the responsive variant set under
// public/media/: AVIF q50 + WebP q72 at 320/480/768/1200, never upscaling
// beyond the source width. Returns the GeneratedImage metadata that lands in
// catalog.json / images.json.

import {mkdir} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type {GeneratedImage} from "../../src/lib/catalog/types.ts";

export const MEDIA_DIR = "public/media";
export const WIDTHS = [320, 480, 768, 1200] as const;

export interface ProcessedImage {
  image: GeneratedImage;
  files: string[]; // relative paths written
}

export interface ImageJob {
  key: string; // media key, e.g. `p/KD-P001/0` — subdirectories are created
  alt: string;
  outDir?: string;
}

/**
 * Encode `input` into variants under `<outDir>/<key>-<w>.{avif,webp}`.
 */
export async function processImage(input: Buffer | Uint8Array, job: ImageJob): Promise<ProcessedImage> {
  const {key, alt} = job;
  const outDir = job.outDir ?? MEDIA_DIR;
  const img = sharp(input);
  const meta = await img.metadata();
  const srcWidth = meta.width ?? 0;
  const srcHeight = meta.height ?? 0;
  if (!srcWidth || !srcHeight) throw new Error(`image "${key}": cannot read dimensions`);

  const files: string[] = [];
  const variants: GeneratedImage["variants"] = [];
  for (const w of WIDTHS) {
    if (w > srcWidth) continue;
    const resized = sharp(input).resize({width: w});
    const avifPath = path.join(outDir, `${key}-${w}.avif`);
    const webpPath = path.join(outDir, `${key}-${w}.webp`);
    await mkdir(path.dirname(avifPath), {recursive: true});
    await resized.clone().avif({quality: 50}).toFile(avifPath);
    await resized.clone().webp({quality: 72}).toFile(webpPath);
    files.push(path.normalize(avifPath), path.normalize(webpPath));
    variants.push({width: w, avif: `/media/${key}-${w}.avif`, webp: `/media/${key}-${w}.webp`});
  }
  return {image: {key, alt, width: srcWidth, height: srcHeight, variants}, files};
}
