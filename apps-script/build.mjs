import {rm, mkdir, copyFile} from "node:fs/promises";
import {build} from "esbuild";

// Apps Script needs entry-point functions on globalThis — main.ts wires them
// up — and no module syntax. One IIFE bundle plus the manifest.
await rm("dist", {recursive: true, force: true});
await mkdir("dist", {recursive: true});
await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "iife",
  target: "es2022",
  outfile: "dist/Code.js",
  logLevel: "info",
});
await copyFile("appsscript.json", "dist/appsscript.json");
console.log("dist/Code.js + dist/appsscript.json written — run `clasp push`");
