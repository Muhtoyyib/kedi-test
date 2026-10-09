// Moves the prerendered /404 page to dist/client/404.html, which wrangler's
// `not_found_handling: "404-page"` serves for unknown paths with a real 404.
import {copyFileSync, existsSync, rmSync} from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const from = path.join(root, "dist/client/404/index.html");
const to = path.join(root, "dist/client/404.html");

if (!existsSync(from)) {
  console.error("dist/client/404/index.html is missing — was /404 prerendered?");
  process.exit(1);
}

copyFileSync(from, to);
rmSync(path.dirname(from), {recursive: true});
console.log("wrote dist/client/404.html");
