// Parsed fixture catalog for component tests — the real fixture JSON run
// through the parser, with a stub resolver so no filesystem or sharp work
// happens inside vitest.

import wire from "../../scripts/fixtures/catalog.fixture.json";
import {parseCatalog} from "../../scripts/lib/parse-catalog.ts";
import {resolveCatalogImages, type ImageResolver} from "../../scripts/lib/resolve-content.ts";
import type {Catalog, GeneratedImage} from "../lib/catalog/types.ts";

const stubImage = (key: string, alt: string): GeneratedImage => ({
  key,
  alt,
  width: 900,
  height: 900,
  variants: [
    {width: 320, avif: `/media/${key}-320.avif`, webp: `/media/${key}-320.webp`},
    {width: 768, avif: `/media/${key}-768.avif`, webp: `/media/${key}-768.webp`},
  ],
});

const stubResolver: ImageResolver = {
  drive: async (_id, key, alt) => stubImage(key, alt),
  docImage: async (_ref, key, alt) => stubImage(key, alt),
  poster: async (_video, key, alt) => stubImage(key, alt),
};

export const fixtureCatalog: Catalog = await resolveCatalogImages(parseCatalog(wire), stubResolver);
