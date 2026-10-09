// Video helpers — newest first, optional topic filter.

import {catalog} from "./data.ts";
import type {Catalog, Topic, Video} from "./types.ts";

export function getVideos(filter: {topic?: Topic} = {}, cat: Catalog = catalog): Video[] {
  return [...cat.videos].filter((v) => !filter.topic || v.topic === filter.topic).sort((a, b) => (a.date < b.date ? 1 : -1));
}
