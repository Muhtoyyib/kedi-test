// Resolves every image/poster reference in a ParsedCatalog into GeneratedImage
// data, producing the Catalog that gets written to src/generated/catalog.json.
//
// The resolver is injected: fetch-catalog wires it to Drive/YouTube/TikTok
// through the image pipeline + cache; tests and the fixture loader can inject
// stubs without touching the filesystem or network.

import type {ArticleBlock, Catalog, GeneratedImage, VideoLink, VideoRef} from "../../src/lib/catalog/types.ts";
import type {ParsedCatalog, WireBlock} from "./parsed-types.ts";

export interface ImageResolver {
  /** Drive-backed image (product/category/highlight/story/cover). */
  drive(id: string, key: string, alt: string): Promise<GeneratedImage>;
  /** Inline Doc image: ?action=doc_image&doc=…&n=… — cache key `doc:{doc}:{n}:{docLastUpdated}` is built by the caller. */
  docImage(ref: {doc: string; n: number}, key: string, alt: string): Promise<GeneratedImage>;
  /** Video poster (YouTube/TikTok thumbnail or branded placeholder). */
  poster(video: VideoLink, key: string, alt: string): Promise<GeneratedImage>;
}

interface MediaRef {
  key: string;
  alt: string;
}

async function resolveVideo(video: VideoLink, meta: MediaRef, r: ImageResolver): Promise<VideoRef> {
  return {...video, poster: await r.poster(video, meta.key, meta.alt)};
}

async function resolveBlocks(blocks: WireBlock[], prefix: string, r: ImageResolver): Promise<ArticleBlock[]> {
  const out: ArticleBlock[] = [];
  let img = 0;
  let vid = 0;
  for (const b of blocks) {
    if (b.type === "image") {
      const alt = b.alt || "Article image";
      const key = `${prefix}/img-${img++}`;
      out.push({type: "image", image: await r.docImage(b.ref, key, alt), alt});
    } else if (b.type === "video") {
      out.push({type: "video", video: await resolveVideo(b.video, {key: `${prefix}/vid-${vid++}`, alt: `Video: ${b.video.url}`}, r)});
    } else if (b.type === "doctor-callout") {
      out.push({type: "doctor-callout", blocks: await resolveBlocks(b.blocks, `${prefix}/callout`, r)});
    } else {
      out.push(b);
    }
  }
  return out;
}

/** Parsed → final Catalog with all media resolved. */
export async function resolveCatalogImages(parsed: ParsedCatalog, r: ImageResolver): Promise<Catalog> {
  return {
    ...parsed,
    products: await Promise.all(parsed.products.map((p) => product(p, r))),
    categories: await Promise.all(parsed.categories.map((cat) => category(cat, r))),
    highlights: await Promise.all(parsed.highlights.map((h) => highlight(h, r))),
    videos: await Promise.all(parsed.videos.map((v) => videoItem(v, r))),
    stories: await Promise.all(parsed.stories.map((s) => story(s, r))),
    articles: await Promise.all(parsed.articles.map((a) => article(a, r))),
  };
}

async function product(p: ParsedCatalog["products"][number], r: ImageResolver): Promise<Catalog["products"][number]> {
  const images = await Promise.all(
    p.imageIds.map((id, i) => r.drive(id, `p/${p.id}/${i}`, i === 0 ? `${p.name} — packshot` : `${p.name} — image ${i + 1}`))
  );
  const {imageIds: _ids, ...rest} = p;
  return {...rest, images};
}

async function category(cat: ParsedCatalog["categories"][number], r: ImageResolver): Promise<Catalog["categories"][number]> {
  const image = cat.imageId ? await r.drive(cat.imageId, `cat/${cat.slug}`, `${cat.name} category`) : null;
  const {imageId: _id, ...rest} = cat;
  return {...rest, image};
}

async function highlight(h: ParsedCatalog["highlights"][number], r: ImageResolver): Promise<Catalog["highlights"][number]> {
  const photos = await Promise.all(
    h.photoIds.map((id, i) => r.drive(id, `hl/${h.id}/${i}`, h.photoAlts[i] || `Seminar highlight — ${h.topic}`))
  );
  const video = h.video ? await resolveVideo(h.video, {key: `hl/${h.id}/clip`, alt: `Clip: ${h.topic}`}, r) : null;
  const {photoIds: _p, photoAlts: _a, ...rest} = h;
  return {...rest, photos, video};
}

async function videoItem(v: ParsedCatalog["videos"][number], r: ImageResolver): Promise<Catalog["videos"][number]> {
  return {...v, video: await resolveVideo(v.video, {key: `vid/${v.id}`, alt: `Video: ${v.title}`}, r)};
}

async function story(s: ParsedCatalog["stories"][number], r: ImageResolver): Promise<Catalog["stories"][number]> {
  const photo = s.photoId ? await r.drive(s.photoId, `st/${s.id}/photo`, `${s.name} — customer photo`) : null;
  const video = s.video ? await resolveVideo(s.video, {key: `st/${s.id}/video`, alt: `Video story: ${s.name}`}, r) : null;
  const {photoId: _id, ...rest} = s;
  return {...rest, photo, video};
}

async function article(a: ParsedCatalog["articles"][number], r: ImageResolver): Promise<Catalog["articles"][number]> {
  const cover = await r.drive(a.coverImageId, `art/${a.slug}/cover`, a.coverAlt);
  const body = await resolveBlocks(a.body, `art/${a.slug}`, r);
  const {coverImageId: _id, ...rest} = a;
  return {...rest, cover, body};
}

/** All generated images in a catalog, keyed by their media key — written to src/generated/images.json. */
export function collectImages(catalog: Catalog): Record<string, GeneratedImage> {
  const out: Record<string, GeneratedImage> = {};
  const add = (img: GeneratedImage | null) => {
    if (img) out[img.key] = img;
  };
  for (const p of catalog.products) p.images.forEach(add);
  for (const cat of catalog.categories) add(cat.image);
  for (const h of catalog.highlights) {
    h.photos.forEach(add);
    if (h.video) add(h.video.poster);
  }
  for (const v of catalog.videos) add(v.video.poster);
  for (const s of catalog.stories) {
    add(s.photo);
    if (s.video) add(s.video.poster);
  }
  for (const a of catalog.articles) {
    add(a.cover);
    collectBlockImages(a.body, add);
  }
  return out;
}

function collectBlockImages(blocks: ArticleBlock[], add: (img: GeneratedImage | null) => void): void {
  for (const b of blocks) {
    if (b.type === "image") add(b.image);
    else if (b.type === "video") add(b.video.poster);
    else if (b.type === "doctor-callout") collectBlockImages(b.blocks, add);
  }
}
