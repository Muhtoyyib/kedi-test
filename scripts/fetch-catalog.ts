// CATALOG_SOURCE=fixture (the default for local dev and PR previews) copies the
// fixture into src/generated. Live fetching from the Apps Script web app —
// catalog JSON plus product images — is implemented in
// 04-add-catalog-data-pipeline.
import {copyFileSync, mkdirSync} from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fixture = path.join(root, "scripts/fixtures/catalog.fixture.json");
const outDir = path.join(root, "src/generated");
const outFile = path.join(outDir, "catalog.json");

if ((process.env.CATALOG_SOURCE ?? "fixture") === "fixture") {
  mkdirSync(outDir, {recursive: true});
  copyFileSync(fixture, outFile);
  console.log(`catalog: copied fixture to ${path.relative(root, outFile)}`);
} else {
  console.error("catalog:fetch with CATALOG_SOURCE=live is implemented in change 04 (add-catalog-data-pipeline).");
  process.exit(1);
}
