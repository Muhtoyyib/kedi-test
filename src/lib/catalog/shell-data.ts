// Slim generated data for the eager shell — settings, categories and delivery
// areas only. The full catalog.json stays in lazy chunks (cart drawer, pages).

import raw from "../../generated/shell.json";
import type {Catalog} from "./types.ts";

export const shell = raw as Pick<Catalog, "settings" | "categories" | "delivery">;
