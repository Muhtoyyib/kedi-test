import {defineCollections, defineConfig, frontmatterSchema} from "fumadocs-mdx/config";

// Legal pages (privacy, terms, health disclaimer, delivery & returns). The full
// frontmatter schema lands in change 08-add-content-collections.
export const legal = defineCollections({
  type: "doc",
  dir: "content/legal",
  files: ["**/*.mdx"],
  schema: frontmatterSchema,
});

export default defineConfig({});
