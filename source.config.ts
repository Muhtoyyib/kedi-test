import {defineCollections, defineConfig} from "fumadocs-mdx/config";
import {z} from "zod";

// Legal pages (privacy, terms, health disclaimer, delivery & returns).
// Strict frontmatter: the build fails on a missing field or typo'd key.
export const legal = defineCollections({
  type: "doc",
  dir: "content/legal",
  files: ["**/*.mdx"],
  schema: z
    .object({
      title: z.string(),
      description: z.string().max(155),
      updated: z.string().date(),
    })
    .strict(),
});

export default defineConfig({});
