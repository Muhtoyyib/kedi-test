import {resolve} from "node:path";
import {defineConfig} from "vite-plus";

const fumadocsCollectionsMockResolver = {
  name: "fumadocs-collections-test-mock",
  enforce: "pre" as const,
  resolveId(id: string) {
    if (id === "fumadocs-mdx:collections/browser") {
      return resolve(import.meta.dirname, "./src/test-utils/fumadocs-browser-collections.mock.ts");
    }
    if (id === "fumadocs-mdx:collections/server") {
      return resolve(import.meta.dirname, "./src/test-utils/fumadocs-server-collections.mock.ts");
    }
  },
};

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    pool: "forks",
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}", "scripts/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html", "lcov"],
      cleanOnRerun: true,
      exclude: ["node_modules/", "dist/", "**/*.config.{js,ts}", "**/*.d.ts", "**/*.gen.ts", "**/__tests__/**"],
      include: ["src/lib/**"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
  plugins: [fumadocsCollectionsMockResolver],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
});
