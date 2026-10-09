// Types for the generated catalog (docs/content-model.md §2). Change
// 04-add-catalog-data-pipeline adds the full model; this covers what the
// design-system primitives need.

export interface GeneratedImage {
  key: string;
  alt: string;
  width: number;
  height: number;
  variants: {width: number; avif: string; webp: string}[];
}
