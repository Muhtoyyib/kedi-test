// Production deploy guard. Runs in deploy.yml only — preview and local builds
// are allowed to use the fixture catalog and placeholder config.
import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import {checkProductionReadiness} from "./lib/production-readiness.ts";

const root = path.resolve(import.meta.dirname, "..");

function readCatalogSource(): string | null {
  const catalogPath = path.join(root, "src/generated/catalog.json");
  if (!existsSync(catalogPath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(catalogPath, "utf8")) as {source?: string};
    return parsed.source ?? null;
  } catch {
    return null;
  }
}

const failures = checkProductionReadiness({
  catalogSource: readCatalogSource(),
  siteConfigSource: readFileSync(path.join(root, "src/lib/site-config.ts"), "utf8"),
  siteUrl: process.env.VITE_SITE_URL,
});

if (failures.length > 0) {
  console.error("Production deploy blocked:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("Production readiness checks passed.");
