import {mkdtempSync, rmSync} from "node:fs";
import {existsSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import sharp from "sharp";
import {afterAll, describe, expect, it} from "vitest";
import {processImage, WIDTHS} from "../image-pipeline.ts";

const tmp = mkdtempSync(path.join(tmpdir(), "pipeline-"));
afterAll(() => rmSync(tmp, {recursive: true, force: true}));

const png = async (w: number, h: number) =>
  sharp({create: {width: w, height: h, channels: 3, background: "#317ABE"}})
    .png()
    .toBuffer();

describe("processImage", () => {
  it("emits avif+webp at every width for a large source", async () => {
    const {image, files} = await processImage(await png(1600, 800), {key: "t/big", alt: "big", outDir: tmp});
    expect(image.width).toBe(1600);
    expect(image.height).toBe(800);
    expect(image.variants.map((v) => v.width)).toEqual([...WIDTHS]);
    for (const v of image.variants) {
      expect(v.avif).toBe(`/media/t/big-${v.width}.avif`);
      expect(v.webp).toBe(`/media/t/big-${v.width}.webp`);
    }
    expect(files).toHaveLength(WIDTHS.length * 2);
    for (const f of files) expect(existsSync(f)).toBe(true);
  });

  it("never upscales — a 500px source stops at 320 and 480", async () => {
    const {image} = await processImage(await png(500, 500), {key: "t/small", alt: "small", outDir: tmp});
    expect(image.variants.map((v) => v.width)).toEqual([320, 480]);
    expect(image.width).toBe(500);
  });

  it("rejects non-image input", async () => {
    await expect(processImage(Buffer.from("not an image"), {key: "t/bad", alt: "bad", outDir: tmp})).rejects.toThrow();
  });
});
