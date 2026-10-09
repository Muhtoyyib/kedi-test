import {defineConfig, lazyPlugins} from "vite-plus";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "fumadocs-mdx/vite";
import {catalogPrerenderPaths, readCatalog} from "./scripts/lib/read-catalog.ts";

const catalog = readCatalog();
if (catalog.source === "fixture") {
  console.log("[prerender] building against the fixture catalog (src/generated/catalog.json missing or fixture)");
}

// Every public page must be listed here so the build emits static HTML for it.
// Catalog-driven paths (/products/{slug}, /shop/{category}, /learn/{slug}) are
// added once their route files exist — the page changes land in later changes.
// "/404" is the rendered not-found page; scripts/write-404.ts moves it to
// dist/client/404.html for wrangler's `not_found_handling: "404-page"`.
const staticPaths = ["/", "/404", ...catalogPrerenderPaths(catalog)];
const pages = staticPaths.map((path) => ({path}));

export default defineConfig({
  fmt: {
    printWidth: 140,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    arrowParens: "always",
    bracketSpacing: false,
    bracketSameLine: false,
    endOfLine: "lf",
    ignorePatterns: ["routeTree.gen.ts"],
  },
  lint: {
    plugins: ["react", "react-perf", "typescript", "jsx-a11y"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/prefer-tag-over-role": "off",
      "typescript/no-explicit-any": "warn",
      "typescript/no-restricted-types": [
        "error",
        {
          types: {
            unknown: "Use explicit domain types or UntrustedValue/UntrustedRecord at untrusted boundaries.",
          },
        },
      ],
      "eslint/complexity": [
        "error",
        {
          max: 10,
        },
      ],
      "eslint/max-lines-per-function": [
        "error",
        {
          max: 50,
          skipComments: true,
        },
      ],
      "eslint/max-lines": [
        "error",
        {
          max: 250,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "eslint/max-params": ["error", 3],
      "eslint/max-depth": ["error", 3],
      "eslint/max-statements": ["error", 25],
      "eslint/max-classes-per-file": ["error", 1],
      "oxc/branches-sharing-code": "warn",
      "vite-plus/prefer-vite-plus-imports": "error",
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": [
        "error",
        {
          // Marketing layouts and per-element letter-spacing/line-height are bespoke by design.
          allow: ["layout", "tracking-*", "leading-*"],
        },
      ],
      "shadcn/no-inline-styles": "error",
      "shadcn/require-static-classes": "error",
      "shadcn/no-unknown-classes": [
        "error",
        {
          // "not-prose" is a fumadocs typography opt-out marker, not a styled class.
          allow: ["not-prose"],
        },
      ],
    },
    ignorePatterns: ["*.html", "docker", "public", "__tests__", "*.test.ts", "*.config.ts", "routeTree.gen.ts", "apps-script"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
      {
        name: "shadcn",
        specifier: "@shadcn/lint",
      },
    ],
  },
  staged: {
    "*.{js,ts,jsx,tsx}": ["vp check --fix", "vp test related --run --reporter=verbose --bail=1"],
    "*.{json,md,yaml,yml,css}": "vp fmt --write",
  },
  plugins: lazyPlugins(async () => [
    mdx(await import("./source.config.ts")),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: false,
          autoSubfolderIndex: true,
        },
      },
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        autoSubfolderIndex: true,
        failOnError: true,
      },
      router: {
        quoteStyle: "double",
      },
      pages,
    }),
    react({compiler: true}),
  ]),
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5180,
  },
});
