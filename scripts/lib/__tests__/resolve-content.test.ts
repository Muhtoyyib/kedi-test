import {describe, expect, it} from "vitest";
import type {GeneratedImage} from "../../../src/lib/catalog/types.ts";
import fixture from "../../fixtures/catalog.fixture.json";
import {parseCatalog} from "../parse-catalog.ts";
import {collectImages, resolveCatalogImages, type ImageResolver} from "../resolve-content.ts";

const img = (key: string, alt: string): GeneratedImage => ({key, alt, width: 10, height: 10, variants: []});

const calls: string[] = [];
const resolver: ImageResolver = {
  drive: async (id, key, alt) => {
    calls.push(`drive:${id}@${key}`);
    return img(key, alt);
  },
  docImage: async (ref, key, alt) => {
    calls.push(`doc:${ref.doc}:${ref.n}@${key}`);
    return img(key, alt);
  },
  poster: async (video, key, alt) => {
    calls.push(`poster:${video.id}@${key}`);
    return img(key, alt);
  },
};

describe("resolveCatalogImages", () => {
  it("resolves every image/video ref into GeneratedImage data", async () => {
    calls.length = 0;
    const catalog = await resolveCatalogImages(parseCatalog(fixture), resolver);

    const p1 = catalog.products[0]!;
    expect(p1.images).toHaveLength(3);
    expect(p1.images[0]!.key).toBe("p/KD-F001/0");
    expect(catalog.categories[0]!.image?.key).toBe("cat/digestion");

    const h1 = catalog.highlights.find((h) => h.id === "FX-H1")!;
    expect(h1.photos).toHaveLength(2);
    expect(h1.video?.poster.key).toBe("hl/FX-H1/clip");

    expect(catalog.videos.every((v) => v.video.poster.key.startsWith("vid/"))).toBe(true);

    const s1 = catalog.stories.find((s) => s.id === "FX-S1")!;
    expect(s1.photo?.key).toBe("st/FX-S1/photo");
    const s2 = catalog.stories.find((s) => s.id === "FX-S2")!;
    expect(s2.video?.poster.key).toBe("st/FX-S2/video");

    const a1 = catalog.articles.find((a) => a.id === "FX-A1")!;
    expect(a1.cover.key).toBe("art/fixture-everyday-gut-guide/cover");
    const imgBlock = a1.body.find((b) => b.type === "image");
    expect(imgBlock && "image" in imgBlock ? imgBlock.image.key : "").toBe("art/fixture-everyday-gut-guide/img-0");
    const vidBlock = a1.body.find((b) => b.type === "video");
    expect(vidBlock && "video" in vidBlock ? vidBlock.video.poster.key : "").toBe("art/fixture-everyday-gut-guide/vid-0");
  });

  it("collectImages keys every generated image once", async () => {
    const catalog = await resolveCatalogImages(parseCatalog(fixture), resolver);
    const all = collectImages(catalog);
    expect(all["p/KD-F001/0"]?.alt).toContain("packshot");
    expect(Object.keys(all).length).toBeGreaterThan(20);
    // doc image + posters + covers are all present
    expect(all["art/fixture-everyday-gut-guide/img-0"]).toBeDefined();
    expect(all["vid/FX-V3"]).toBeDefined();
  });
});
