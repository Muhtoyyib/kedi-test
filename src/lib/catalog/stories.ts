// Story helpers — featured first, then newest.

import {catalog} from "./data.ts";
import type {Catalog, Story} from "./types.ts";

const storyOrder = (a: Story, b: Story) => Number(b.featured) - Number(a.featured) || (a.date < b.date ? 1 : -1);

export function getStories(filter: {featured?: boolean} = {}, cat: Catalog = catalog): Story[] {
  return [...cat.stories].filter((s) => filter.featured === undefined || s.featured === filter.featured).sort(storyOrder);
}

export function getStory(id: string, cat: Catalog = catalog): Story | undefined {
  return cat.stories.find((s) => s.id === id || s.slug === id);
}
